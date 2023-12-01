const { createToken } = require("../helpers/token.helper");
const User = require("../models/user.model");

//register controller
const registerUser = async (req, res) => {
  const { name, email, password, number } = req.body;

  try {
    const user = await User.register(name, email, password, number);

    //Create token
    const token = createToken(user._id);

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// login controller
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
