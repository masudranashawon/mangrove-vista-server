const express = require("express");
const { registerUser, loginUser } = require("../controllers/user.controller");

//router
const router = express.Router();

// register
router.post("/register", registerUser);

//login
router.post("/login", loginUser);

module.exports = router;
