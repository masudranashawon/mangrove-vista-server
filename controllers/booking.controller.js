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
    const accommodation = await Accommodation.findById(accommodationId?._id);

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
      checkInDate,
      checkOutDate
    );

    if (!isAvailable) {
      return res
        .status(400)
        .json({ error: "Accommodation not available for the selected dates." });
    }

    // calculate total price
    const pricePerNight = accommodation.pricePerNight;
    const numberOfDays = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = personData + childData + pricePerNight * numberOfDays;

    const booking = await Booking.create({
      user: req.user?._id,
      accommodation: accommodationId,
      personData,
      childData,
      checkInDate,
      checkOutDate,
      totalPrice,
      status: "pending",
    });

    res.status(200).json(booking);
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
  rejectBooking,
};
