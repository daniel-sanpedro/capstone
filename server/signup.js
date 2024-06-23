const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid"); // for generating UUIDs
const { pool } = require("../db"); // assuming you have a PostgreSQL pool set up

// POST /auth/signup
router.post("/signup", async (req, res) => {
  const { username, email, password, full_name, address, phone_number } =
    req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate UUID for user_id
    const user_id = uuidv4();

    // Insert user into database
    const query = `
      INSERT INTO users (user_id, username, email, password_hash, full_name, address, phone_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING user_id, username, email, full_name, address, phone_number, created_at
    `;
    const values = [
      user_id,
      username,
      email,
      hashedPassword,
      full_name,
      address,
      phone_number,
    ];

    const { rows } = await pool.query(query, values);

    const newUser = rows[0]; // get the first row returned (should be the newly created user)

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Signup failed. Please try again later." });
  }
});

module.exports = router;
