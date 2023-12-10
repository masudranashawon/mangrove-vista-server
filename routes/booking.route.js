const express = require("express");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");
const {
  createBooking,
  cancelBooking,
  getAllBookings,
  approveBooking,
} = require("../controllers/booking.controller");

const router = express.Router();

// create a booking route
router.post("/create/:accommodationId", isAuthenticated, createBooking);

// cancel a booking route
router.put("/:bookingId", isAuthenticated, cancelBooking);

// approve a booking route
router.put("/approve/:bookingId", isAuthenticated, isAdmin, approveBooking);

// get all bookings route
router.get("/", isAuthenticated, isAdmin, getAllBookings);

module.exports = router;
