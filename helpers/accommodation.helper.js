const handleAvailabilityDates = (availability) => {
  if (!availability || (!availability.startDate && !availability.endDate)) {
    availability.startDate = new Date();
    availability.endDate = new Date();
  }

  // Convert date strings to Date objects
  availability.startDate = new Date(availability.startDate);
  availability.endDate = new Date(availability.endDate);

  return availability;
};

module.exports = { handleAvailabilityDates };
