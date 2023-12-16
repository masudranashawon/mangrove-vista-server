const mongoose = require("mongoose");
const Booking = require("../models/booking.model");
const User = require("../models/user.model");
const Accommodation = require("../models/accommodation.model");

const createBooking = async (req, res) => {
  try {
    const { personData, childData, checkInDate, checkOutDate } = req.body;
    const { accommodationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(accommodationId)) {
      res.status(404).json({ message: "Accommodation not found" });
    }

    const user = await User.findById(req.user?._id).populate("bookings");
    const accommodation = await Accommodation.findById(accommodationId);

    // check if the user is banned
    if (user?.isBlacklisted) {
      res.status(403).json({
        message:
          "Your account is suspended for violating our policy. You can't make bookings right now. Please contact support for any inquiries",
      });
      return;
    }

    const alreadyBooked = user?.bookings.find(
      (booking) => accommodationId === booking.accommodation?._id?.toString()
    );

    if (alreadyBooked) {
      res.status(403).json({ message: "Accommodation already booked" });
      return;
    }

    // check if accommodation is available for the given dates
    const isAvailable = await Accommodation.isAvailable(
      accommodationId,
      checkInDate,
      checkOutDate
    );

    if (!isAvailable) {
      return res
        .status(400)
        .json({ error: "Accommodation not available for the selected dates." });
    }

    // Parse date strings to Date objects
    const parsedCheckInDate = new Date(checkInDate);
    const parsedCheckOutDate = new Date(checkOutDate);

    // Calculate the number of nights stayed
    const numberOfDays = Math.ceil(
      (parsedCheckOutDate - parsedCheckInDate) / (1000 * 60 * 60 * 24)
    );

    // calculate total price
    const pricePerNight = accommodation.pricePerNight;
    const totalPrice = personData + childData + pricePerNight * numberOfDays;

    const booking = await Booking.create({
      user: req.user?._id,
      accommodation: accommodationId,
      personData,
      childData,
      checkInDate: parsedCheckInDate,
      checkOutDate: parsedCheckOutDate,
      totalPrice,
    });

    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all user bookings
const getAllBookingsUser = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized access" });
      return;
    }

    const bookings = await Booking.find({ user: userId }).populate(
      "accommodation"
    );

    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      res.status(404).json({ message: "Booking not found" });
    }

    const existedBooking = await Booking.findById(bookingId);

    if (!existedBooking) {
      res.status(403).json({ message: "Booking doesn't exist" });
      return;
    }

    const user = await User.findById(req.user?._id);

    const matchedBooking = user?.bookings.find(
      (booking) => bookingId === booking._id.toString()
    );

    if (!matchedBooking) {
      res.status(403).json({ message: "Booking doesn't exist" });
      return;
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    // check if the booking is in a cancelable state (e.g., pending)
    if (booking.status !== "pending") {
      res.status(400).json({
        message: "Cannot cancel a booking that is not in pending status",
      });
      return;
    }

    // update booking status to canceled
    booking.status = "canceled";

    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate("accommodation user");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// approve a booking
const approveBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    // update booking status to approved
    booking.status = "approved";

    // Save the changes to the database
    await booking.save();

    // update user and accommodation models if approved
    await User.findByIdAndUpdate(booking.user, {
      $addToSet: {
        bookings: booking._id,
      },
    });

    await Accommodation.findByIdAndUpdate(booking.accommodation, {
      $addToSet: {
        bookings: booking._id,
      },
    });

    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// reject a booking
const rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    // update booking status to rejected
    booking.status = "rejected";

    // Save the changes to the database
    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createBooking,
  cancelBooking,
  approveBooking,
  getAllBookings,
  getAllBookingsUser,
  rejectBooking,
};
