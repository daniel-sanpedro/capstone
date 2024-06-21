const express = require("express");
const router = express.Router();
const { client } = require("../db");
const { v4: uuidv4 } = require("uuid");

const getAllProducts = async () => {
  try {
    const result = await client.query("SELECT * FROM products");
    return result.rows;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const getProductById = async (product_id) => {
  try {
    const result = await client.query(
      "SELECT * FROM products WHERE product_id = $1",
      [product_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error(
      `Error fetching product with product_id ${product_id}:`,
      error
    );
    throw error;
  }
};

const addProduct = async (name, description, price, category_id) => {
  const product_id = uuidv4();
  try {
    const result = await client.query(
      "INSERT INTO products (product_id, name, description, price, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [product_id, name, description, price, category_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

const updateProduct = async (
  product_id,
  name,
  description,
  price,
  category_id
) => {
  try {
    const result = await client.query(
      "UPDATE products SET name = $2, description = $3, price = $4, category_id = $5 WHERE product_id = $1 RETURNING *",
      [product_id, name, description, price, category_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

const deleteProduct = async (product_id) => {
  try {
    const result = await client.query(
      "DELETE FROM products WHERE product_id = $1 RETURNING *",
      [product_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

router.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get("/:product_id", async (req, res, next) => {
  const { product_id } = req.params;
  try {
    const product = await getProductById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { name, description, price, category_id } = req.body;
  try {
    const newProduct = await addProduct(name, description, price, category_id);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

router.put("/:product_id", async (req, res, next) => {
  const { product_id } = req.params;
  const { name, description, price, category_id } = req.body;
  try {
    const updatedProduct = await updateProduct(
      product_id,
      name,
      description,
      price,
      category_id
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

router.delete("/:product_id", async (req, res, next) => {
  const { product_id } = req.params;
  try {
    const deletedProduct = await deleteProduct(product_id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(deletedProduct);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
