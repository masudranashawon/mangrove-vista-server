const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const accommodationSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  amenities: [String],
  specialFeatures: [String],
  images: [String],
  availability: {
    startDate: { type: Date },
    endDate: { type: Date },
  },
  bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
});

accommodationSchema.statics.isAvailable = async function (
  accommodationId,
  checkInDate,
  checkOutDate
) {
  const existingBookings = await mongoose.model("Booking").find({
    accommodation: accommodationId,
    $or: [
      {
        $and: [
          { checkInDate: { $lte: checkInDate } },
          { checkOutDate: { $gt: checkInDate } },
        ],
      },
      {
        $and: [
          { checkInDate: { $lt: checkOutDate } },
          { checkOutDate: { $gte: checkOutDate } },
        ],
      },
      {
        $and: [
          { checkInDate: { $gte: checkInDate } },
          { checkOutDate: { $lte: checkOutDate } },
        ],
      },
    ],
  });

  return existingBookings.length === 0;
};

module.exports = mongoose.model("Accommodation", accommodationSchema);
