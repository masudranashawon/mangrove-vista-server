const express = require("express");
const {
  getUser,
  updateUser,
  deleteUser,
  getUsers,
  blacklistUser,
} = require("../controllers/user.controller");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");

//router
const router = express.Router();

// get an user route
router.get("/:userId", isAuthenticated, getUser);

// update an user route
router.put("/:userId", isAuthenticated, updateUser);

// delete an user route
router.delete("/:userId", isAuthenticated, deleteUser);

// get all users route
router.get("/", isAuthenticated, isAdmin, getUsers);

// suspend/unsuspend an user route
router.put("/blacklist/:userId", isAuthenticated, isAdmin, blacklistUser);

module.exports = router;
