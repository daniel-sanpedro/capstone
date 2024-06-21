const express = require("express");
const router = express.Router();
const { client } = require("../db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const getAllUsers = async () => {
  try {
    const result = await client.query("SELECT * FROM users");
    return result.rows;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const getUserById = async (user_id) => {
  try {
    const result = await client.query(
      "SELECT * FROM users WHERE user_id = $1",
      [user_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching user with user_id ${user_id}:`, error);
    throw error;
  }
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
  try {
    const result = await client.query(
      "INSERT INTO users (user_id, username, email, password_hash, full_name, address, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        user_id,
        username,
        email,
        hashedPassword,
        full_name,
        address,
        phone_number,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

const updateUser = async (
  user_id,
  username,
  email,
  full_name,
  address,
  phone_number
) => {
  try {
    const result = await client.query(
      "UPDATE users SET username = $2, email = $3, full_name = $4, address = $5, phone_number = $6 WHERE user_id = $1 RETURNING *",
      [user_id, username, email, full_name, address, phone_number]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

const deleteUser = async (user_id) => {
  try {
    const result = await client.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING *",
      [user_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

router.get("/", async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/:user_id", async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const user = await getUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { username, email, password, full_name, address, phone_number } =
    req.body;
  try {
    const newUser = await addUser(
      username,
      email,
      password,
      full_name,
      address,
      phone_number
    );
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

router.put("/:user_id", async (req, res, next) => {
  const { user_id } = req.params;
  const { username, email, full_name, address, phone_number } = req.body;
  try {
    const updatedUser = await updateUser(
      user_id,
      username,
      email,
      full_name,
      address,
      phone_number
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.delete("/:user_id", async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const deletedUser = await deleteUser(user_id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(deletedUser);
  } catch (error) {
    next(error);
  }
});

const loginUser = async (username, password) => {
  try {
    const result = await client.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = result.rows[0];
    if (!user) {
      throw new Error("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      throw new Error("Incorrect password");
    }

    return user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

const signupUser = async (
  username,
  email,
  password,
  full_name,
  address,
  phone_number
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user_id = uuidv4();
  try {
    const result = await client.query(
      "INSERT INTO users (user_id, username, email, password_hash, full_name, address, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        user_id,
        username,
        email,
        hashedPassword,
        full_name,
        address,
        phone_number,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error signing up user:", error);
    throw error;
  }
};

const logoutUser = async () => {
  try {
    return { message: "Logged out successfully" };
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

module.exports = router;
