const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { client } = require("../db");

router.post("/signup", async (req, res, next) => {
  const { username, email, password, full_name, address, phone_number } =
    req.body;

  try {
    const checkUserQuery = `
      SELECT * FROM users
      WHERE username = $1 OR email = $2;
    `;
    const checkUserValues = [username, email];
    const { rows } = await client.query(checkUserQuery, checkUserValues);

    if (rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = uuidv4();

    const insertUserQuery = `
      INSERT INTO users (user_id, username, email, password_hash, full_name, address, phone_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING user_id, username, email, full_name, address, phone_number;
    `;
    const insertUserValues = [
      userId,
      username,
      email,
      hashedPassword,
      full_name,
      address,
      phone_number,
    ];
    const result = await client.query(insertUserQuery, insertUserValues);

    const newUser = result.rows[0];

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error signing up:", error);
    next(error);
  }
});

module.exports = router;
