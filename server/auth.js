const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { loginUser, signupUser, logoutUser } = require("./authService");
const { findUserByUsername } = require("./users");

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await loginUser(username, password);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/signup", async (req, res, next) => {
  const { username, email, password, full_name, address, phone_number } =
    req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await signupUser(
      username,
      email,
      hashedPassword,
      full_name,
      address,
      phone_number
    );
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const result = await logoutUser();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
