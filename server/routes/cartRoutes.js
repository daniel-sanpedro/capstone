const express = require("express");
const router = express.Router();
const client = require("../client"); // Assuming your PostgreSQL client setup
const { authenticateToken } = require("../middleware/authMiddleware"); // Middleware for checking the token

/**
 * Add a product to the cart
 */
router.post("/add", authenticateToken, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.user_id; // Assuming you have user info in token

  try {
    // SQL to add or update cart item
    const addCartSQL = `
            INSERT INTO cart_items (user_id, product_id, quantity) 
            VALUES ($1, $2, $3) 
            ON CONFLICT (user_id, product_id) 
            DO UPDATE SET quantity = cart_items.quantity + $3
            RETURNING *;
        `;
    const result = await client.query(addCartSQL, [
      userId,
      productId,
      quantity,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

/**
 * Get all cart items for a user
 */
router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.user_id;

  try {
    const getCartSQL = "SELECT * FROM cart_items WHERE user_id = $1";
    const result = await client.query(getCartSQL, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Failed to fetch cart items" });
  }
});

/**
 * Remove a product from the cart
 */
router.delete("/remove", authenticateToken, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.user_id;

  try {
    const removeCartSQL =
      "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING *";
    const result = await client.query(removeCartSQL, [userId, productId]);
    if (result.rows.length > 0) {
      res.json({
        message: "Item removed successfully",
        removedItem: result.rows[0],
      });
    } else {
      res.status(404).json({ message: "Item not found in the cart" });
    }
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
});

module.exports = router;
