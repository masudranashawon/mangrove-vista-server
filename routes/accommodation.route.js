const express = require("express");
const {
  getAllAccommodations,
  getAccommodation,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
} = require("../controllers/accommodation.controller");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");

//router
const router = express.Router();

// get all accommodations route
router.get("/", getAllAccommodations);

// get an accommodation route
router.get("/:accommodationId", getAccommodation);

// create an accommodation route
router.post("/", isAuthenticated, isAdmin, createAccommodation);

// update an accommodation route
router.put("/:accommodationId", isAuthenticated, isAdmin, updateAccommodation);

// delete an Accommodation route
router.delete(
  "/:accommodationId",
  isAuthenticated,
  isAdmin,
  deleteAccommodation
);

module.exports = router;
