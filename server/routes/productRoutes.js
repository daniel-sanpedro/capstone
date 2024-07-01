const express = require("express");
const router = express.Router();
const client = require("../client");

const getAllProducts = async () => {
  try {
    console.log("Executing query to fetch all products...");
    const res = await client.query("SELECT * FROM products");
    console.log("Query executed successfully. Products found:", res.rows);
    return res.rows;
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
};

const getProductById = async (product_id) => {
  const res = await client.query(
    "SELECT * FROM products WHERE product_id = $1",
    [parseInt(product_id)] // Make sure product_id is treated as an integer
  );
  return res.rows[0];
};

const addProduct = async (name, description, price, imgUrl) => {
  const SQL = `INSERT INTO products (name, description, price, img_url, created_at, updated_at)
               VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
               RETURNING *;`;
  const values = [name, description, price, imgUrl];

  try {
    const res = await client.query(SQL, values);
    return res.rows[0];
  } catch (err) {
    console.error("Error adding product", err);
    throw err;
  }
};

const updateProduct = async (product_id, name, description, price) => {
  const res = await client.query(
    "UPDATE products SET name = $1, description = $2, price = $3, updated_at = CURRENT_TIMESTAMP WHERE product_id = $4 RETURNING *",
    [name, description, price, product_id]
  );
  return res.rows[0];
};

const deleteProduct = async (product_id) => {
  const res = await client.query(
    "DELETE FROM products WHERE product_id = $1 RETURNING *",
    [product_id]
  );
  return res.rows[0];
};

router.get("/", async (req, res, next) => {
  try {
    console.log("Received request to fetch all products.");
    const products = await getAllProducts();
    console.log("Products retrieved in API route /api/products:", products);
    res.json(products);
  } catch (error) {
    console.error("Error in /api/products route:", error);
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
  const { name, description, price, imgUrl } = req.body;
  try {
    if (!name || !price || !imgUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newProduct = await addProduct(name, description, price, imgUrl);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

router.put("/:product_id", async (req, res, next) => {
  const { product_id } = req.params;
  const { name, description, price } = req.body;
  try {
    const updatedProduct = await updateProduct(
      product_id,
      name,
      description,
      price
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
