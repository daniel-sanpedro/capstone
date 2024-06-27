const express = require("express");
const router = express.Router();
const { client } = require("../db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  authenticateToken,
  verifyAdmin,
} = require("../middleware/authMiddleware");

const secretKey = "BC5V3DyZ9eWoAQ4jZAucpMbaCM5neMHW";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

router.use(verifyToken);

const getAllUsers = async () => {
  try {
    const result = await client.query("SELECT * FROM users");
    return result.rows;
  } catch (error) {
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
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user_id = uuidv4();

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
      "UPDATE users SET username = $1, email = $2, full_name = $3, address = $4, phone_number = $5 WHERE user_id = $6 RETURNING *",
      [username, email, full_name, address, phone_number, user_id]
    );
    return result.rows[0];
  } catch (error) {
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

router.post(
  "/add-product",
  authenticateToken,
  verifyAdmin,
  async (req, res) => {
    const { name, description, price, category } = req.body;

    try {
      const result = await client.query(
        "INSERT INTO products (name, description, price, category) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, description, price, category]
      );
      const newProduct = result.rows[0];
      res
        .status(201)
        .json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ message: "Failed to add product" });
    }
  }
);

router.put(
  "/edit-product/:id",
  authenticateToken,
  verifyAdmin,
  async (req, res) => {
    const productId = req.params.id;
    const { name, description, price, category } = req.body;

    try {
      const result = await client.query(
        "UPDATE products SET name = $1, description = $2, price = $3, category = $4 WHERE id = $5 RETURNING *",
        [name, description, price, category, productId]
      );
      const updatedProduct = result.rows[0];
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  }
);

router.delete(
  "/delete-product/:id",
  authenticateToken,
  verifyAdmin,
  async (req, res) => {
    const productId = req.params.id;

    try {
      const result = await client.query(
        "DELETE FROM products WHERE id = $1 RETURNING *",
        [productId]
      );
      const deletedProduct = result.rows[0];
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({
        message: "Product deleted successfully",
        product: deletedProduct,
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  }
);

router.get("/users", authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
});

module.exports = router;
