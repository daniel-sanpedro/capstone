const express = require("express");
const router = express.Router();
const client = require("../client");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const {
  authenticateToken,
  verifyAdmin,
} = require("../middleware/authMiddleware");

const getAllUsers = async () => {
  const result = await client.query("SELECT * FROM users");
  return result.rows;
};

const getUserById = async (user_id) => {
  const result = await client.query("SELECT * FROM users WHERE user_id = $1", [
    user_id,
  ]);
  return result.rows[0];
};

const addUser = async (
  username,
  email,
  password,
  full_name,
  address,
  phone_number
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user_id = uuidv4();
  const result = await client.query(
    "INSERT INTO users (user_id, username, email, password_hash, full_name, address, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [user_id, username, email, hashedPassword, full_name, address, phone_number]
  );
  return result.rows[0];
};

const updateUser = async (
  user_id,
  username,
  email,
  full_name,
  address,
  phone_number
) => {
  const result = await client.query(
    "UPDATE users SET username = $1, email = $2, full_name = $3, address = $4, phone_number = $5 WHERE user_id = $6 RETURNING *",
    [username, email, full_name, address, phone_number, user_id]
  );
  return result.rows[0];
};

const deleteUser = async (user_id) => {
  const result = await client.query(
    "DELETE FROM users WHERE user_id = $1 RETURNING *",
    [user_id]
  );
  return result.rows[0];
};

// Routes
router.get("/", authenticateToken, verifyAdmin, async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:user_id",
  authenticateToken,
  verifyAdmin,
  async (req, res, next) => {
    try {
      const user = await getUserById(req.params.user_id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/", authenticateToken, verifyAdmin, async (req, res, next) => {
  try {
    const newUser = await addUser(
      req.body.username,
      req.body.email,
      req.body.password,
      req.body.full_name,
      req.body.address,
      req.body.phone_number
    );
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:user_id",
  authenticateToken,
  verifyAdmin,
  async (req, res, next) => {
    try {
      const updatedUser = await updateUser(
        req.params.user_id,
        req.body.username,
        req.body.email,
        req.body.full_name,
        req.body.address,
        req.body.phone_number
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:user_id",
  authenticateToken,
  verifyAdmin,
  async (req, res, next) => {
    try {
      const deletedUser = await deleteUser(req.params.user_id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(deletedUser);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
