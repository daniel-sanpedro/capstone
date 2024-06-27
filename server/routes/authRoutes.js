const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { client } = require("../db");
const { jwtSecret } = require("../config");
const {
  authenticateToken,
  verifyAdmin,
} = require("../middleware/authMiddleware");
const { v4: uuidv4 } = require("uuid");

const generateToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      username: user.username,
      is_admin: user.is_admin,
    },
    jwtSecret,
    { expiresIn: "1h" }
  );
};

router.post("/signup", async (req, res, next) => {
  const { username, email, password, full_name, address, phone_number } =
    req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

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
    const token = generateToken(newUser);

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error("Error signing up user:", error);
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.json({ user, token });
  } catch (error) {
    console.error("Error logging in:", error);
    next(error);
  }
});

router.post("/logout", authenticateToken, async (req, res, next) => {
  try {
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    next(error);
  }
});

router.get("/check-admin", authenticateToken, (req, res) => {
  const { role } = req.user;

  if (role === "admin") {
    res.json({ isAdmin: true });
  } else {
    res
      .status(403)
      .json({ isAdmin: false, message: "Access denied. Admins only." });
  }
});

router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route" });
});

module.exports = router;
