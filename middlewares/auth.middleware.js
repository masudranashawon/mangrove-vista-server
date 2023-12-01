const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const isAuthenticated = async (req, res, next) => {
  try {
    //Varify authentication
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new Error("Invalid token format");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized user" });
      return;
    }

    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById({ _id });

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({ error: "Invalid token" });
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }
  }
};

const isAdmin = async (req, res, next) => {
  const user = req.user;

  if (user && user?.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
};

module.exports = { isAuthenticated, isAdmin };
