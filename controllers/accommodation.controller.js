const mongoose = require("mongoose");
const Accommodation = require("../models/accommodation.model");
const { handleAvailabilityDates } = require("../helpers/accommodation.helper");

//get an accommodation controller
const getAccommodation = async (req, res) => {
  try {
    const { accommodationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(accommodationId)) {
      res.status(404).json({ message: "Accommodation not found!" });
      return;
    }

    const accommodation = await Accommodation.findById(accommodationId);

    res.status(200).json(accommodation);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

//get all accommodations controller
const getAllAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find({}).sort({
      createdAt: -1,
    });

    res.status(200).json(accommodations);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

//create an accommodation controller
const createAccommodation = async (req, res) => {
  try {
    const {
      title,
      type,
      description,
      capacity,
      pricePerNight,
      amenities,
      specialFeatures,
      images,
      availability,
    } = req.body;

    if (
      !title ||
      !type ||
      !description ||
      !capacity ||
      !pricePerNight ||
      !amenities ||
      !specialFeatures ||
      !images
    ) {
      throw new Error("All field is required and cannot be empty");
    }

    const accommodation = await Accommodation.create({
      title,
      type,
      description,
      capacity,
      pricePerNight,
      amenities,
      specialFeatures,
      images,
      availability: handleAvailabilityDates(availability),
    });

    res.status(200).json(accommodation);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

//update an accommodation controller
const updateAccommodation = async (req, res) => {
  try {
    const {
      title,
      type,
      description,
      capacity,
      pricePerNight,
      amenities,
      specialFeatures,
      images,
    } = req.body;
    const { accommodationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(accommodationId)) {
      res.status(404).json({ message: "Accommodation not found" });
      return;
    }

    const accommodation = await Accommodation.findByIdAndUpdate(
      accommodationId,
      {
        title,
        type,
        description,
        capacity,
        pricePerNight,
        amenities,
        specialFeatures,
        images,
      },
      { new: true }
    );

    res.status(200).json(accommodation);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

//delete an accommodation controller
const deleteAccommodation = async (req, res) => {
  try {
    const { accommodationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(accommodationId)) {
      res.status(404).json({ message: "Accommodation not found" });
    }

    const beautyPackage = await Accommodation.findByIdAndDelete(
      accommodationId
    );

    res.status(200).json(beautyPackage);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  getAccommodation,
  getAllAccommodations,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
};
