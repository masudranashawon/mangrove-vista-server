require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");

// variables
const port = process.env.PORT || 8080;
const uri = process.env.MONGO_URI;

// express app
const app = express();

//middlewares
app.use(express.json());
app.use(
  cors({
    credentials: true,
  })
);

// test api
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Mangrove Vista server." });
});

// bypass API
app.use("/api/auth/user", authRoutes);
app.use("/api/user", userRoutes);

//mongodb database connection
mongoose.set("strictQuery", false);
mongoose
  .connect(uri)
  .then(() => {
    //Listening for request
    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
