const express = require("express");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");
const {
  createBooking,
  cancelBooking,
  getAllBookings,
  approveBooking,
  rejectBooking,
  getAllBookingsUser,
} = require("../controllers/booking.controller");

const router = express.Router();

// create a booking route
router.post("/create/:accommodationId", isAuthenticated, createBooking);

// get all bookings an user route
router.get("/user", isAuthenticated, getAllBookingsUser);

// cancel a booking route
router.put("/:bookingId", isAuthenticated, cancelBooking);

// approve a booking route
router.put("/approve/:bookingId", isAuthenticated, isAdmin, approveBooking);

// reject a booking route
router.put("/reject/:bookingId", isAuthenticated, isAdmin, rejectBooking);

// get all bookings route
router.get("/", isAuthenticated, isAdmin, getAllBookings);

module.exports = router;
