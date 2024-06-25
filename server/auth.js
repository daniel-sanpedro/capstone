const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { client } = require("../db");
const { jwtSecret } = require("../config");

router.post("/signup", async (req, res, next) => {
  const { username, email, password, full_name, address, phone_number } =
    req.body;

  try {
    const userCheck = await client.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const result = await client.query(
      "INSERT INTO users (user_id, username, email, password_hash, full_name, address, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        userId,
        username,
        email,
        hashedPassword,
        full_name,
        address,
        phone_number,
      ]
    );

    const newUser = result.rows[0];

    const token = jwt.sign(
      { user_id: newUser.user_id, username: newUser.username },
      jwtSecret,
      { expiresIn: "1h" }
    );

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error("Error signing up user:", error);
    next(error);
  }
});

module.exports = router;
