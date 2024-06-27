const express = require("express");
const router = express.Router();
const { client } = require("../db");
const { authenticateToken } = require("../middleware/authMiddleware");
const { v4: uuidv4 } = require("uuid");

const getCartItems = async (user_id) => {
  const res = await client.query(
    "SELECT * FROM cart_items WHERE user_id = $1",
    [user_id]
  );
  return res.rows;
};

const addCartItem = async (user_id, product_id, quantity) => {
  const res = await client.query(
    "INSERT INTO cart_items (cart_item_id, user_id, product_id, quantity) VALUES ($1, $2, $3, $4) RETURNING *",
    [uuidv4(), user_id, product_id, quantity]
  );
  return res.rows[0];
};

const updateCartItem = async (cart_item_id, quantity) => {
  const res = await client.query(
    "UPDATE cart_items SET quantity = $1 WHERE cart_item_id = $2 RETURNING *",
    [quantity, cart_item_id]
  );
  return res.rows[0];
};

const deleteCartItem = async (cart_item_id) => {
  const res = await client.query(
    "DELETE FROM cart_items WHERE cart_item_id = $1 RETURNING *",
    [cart_item_id]
  );
  return res.rows[0];
};

router.get("/", authenticateToken, async (req, res, next) => {
  const user_id = req.user.user_id;
  try {
    const cartItems = await getCartItems(user_id);
    res.json(cartItems);
  } catch (error) {
    next(error);
  }
});

router.post("/", authenticateToken, async (req, res, next) => {
  const user_id = req.user.user_id;
  const { product_id, quantity } = req.body;
  try {
    const newCartItem = await addCartItem(user_id, product_id, quantity);
    res.status(201).json(newCartItem);
  } catch (error) {
    next(error);
  }
});

router.put("/:cart_item_id", authenticateToken, async (req, res, next) => {
  const { cart_item_id } = req.params;
  const { quantity } = req.body;
  try {
    const updatedCartItem = await updateCartItem(cart_item_id, quantity);
    if (!updatedCartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.json(updatedCartItem);
  } catch (error) {
    next(error);
  }
});

router.delete("/:cart_item_id", authenticateToken, async (req, res, next) => {
  const { cart_item_id } = req.params;
  try {
    const deletedCartItem = await deleteCartItem(cart_item_id);
    if (!deletedCartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.json(deletedCartItem);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
