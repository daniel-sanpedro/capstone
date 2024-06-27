const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { client } = require("../db");
const { signupUser } = require("../utils/userUtils");
const { updateUserToAdmin } = require("../utils/userUtils");

const signupUser = async (
  username,
  email,
  password,
  full_name,
  address,
  phone_number,
  isAdmin = false
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user_id = uuidv4();
  try {
    const result = await client.query(
      "INSERT INTO users (user_id, username, email, password_hash, full_name, address, phone_number, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        user_id,
        username,
        email,
        hashedPassword,
        full_name,
        address,
        phone_number,
        isAdmin,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error signing up user:", error);
    throw error;
  }
};

router.post("/signup", async (req, res) => {
  const {
    username,
    email,
    password,
    full_name,
    address,
    phone_number,
    is_admin,
  } = req.body;

  try {
    const newUser = await signupUser(
      username,
      email,
      password,
      full_name,
      address,
      phone_number,
      is_admin || false
    );

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Signup failed. Please try again later." });
  }
});

module.exports = router;
