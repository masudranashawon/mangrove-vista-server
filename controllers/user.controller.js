const mongoose = require("mongoose");
const User = require("../models/user.model");

//get an user controller
const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (userId !== req.user?._id.toString()) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const user = await User.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//update an user controller
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, number } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (userId !== req.user?._id.toString()) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    // blank checking
    if (!name || !number) {
      return res
        .status(400)
        .json({ error: "All field is required and cannot be empty" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: { name, number },
      },
      { new: true }
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete an user controller
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (userId !== req.user?._id.toString()) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const user = await User.findByIdAndDelete(userId);

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//blacklist an user controller
const blacklistUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const updateUser = await User.findByIdAndUpdate(
      userId,
      { $set: { isBlacklisted: !user.isBlacklisted } },
      { new: true }
    );

    res.status(200).json(updateUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// manage user role controller
const manageUserRole = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const updatedRole = user.role === "admin" ? "user" : "admin";

    const updateUser = await User.findByIdAndUpdate(
      userId,
      { $set: { role: updatedRole } },
      { new: true }
    );

    res.status(200).json(updateUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get all users controller
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({
      createdAt: -1,
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getUser,
  updateUser,
  deleteUser,
  blacklistUser,
  manageUserRole,
  getUsers,
};
