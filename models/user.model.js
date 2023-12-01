const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    isBlacklisted: {
      type: Boolean,
      default: false,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// register method
userSchema.statics.register = async function (name, email, password, number) {
  //blank checking
  if (!name || !email || !password || !number) {
    throw new Error("All field is required and cannot be empty");
  }

  // existing email
  const existingUser = await this.findOne({ email });

  if (existingUser) {
    throw new Error("Email already in use");
  }

  // validate email
  if (!validator.isEmail(email)) {
    throw new Error("Invalid Email");
  }

  // is strong password
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Your password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
  }

  //encrypt password or hashing
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  //create user
  const user = await this.create({ name, email, password: hash, number });

  return user;
};

// login method
userSchema.statics.login = async function (email, password) {
  //blank checking
  if (!email || !password) {
    throw new Error("All field is required and cannot be empty");
  }

  // find user
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("Incorrect email or password");
  }

  // checking password
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Incorrect email or password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
