const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const client = require("../client");
const { generateToken } = require("../generateToken"); // Update this line
const { signupUser, updateUserToAdmin } = require("../utils/userUtils");
const {
  authenticateToken,
  verifyAdmin,
} = require("../middleware/authMiddleware");

router.post("/signup", async (req, res, next) => {
  console.log("Request Headers:", req.headers);
  console.log("Request Body:", req.body);
  const {
    username,
    email,
    password,
    full_name,
    address,
    phone_number,
    is_admin,
  } = req.body;

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

    const newUser = await signupUser(
      username,
      email,
      password,
      full_name,
      address,
      phone_number,
      is_admin || false
    );

    const token = generateToken(newUser);
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error("Error signing up:", error);
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
