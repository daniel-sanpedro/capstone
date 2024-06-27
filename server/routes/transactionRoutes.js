// index.js

const express = require("express");
const router = express.Router();
const { client } = require("../db");
const { authenticateToken } = require("../middleware/authMiddleware");
const { v4: uuidv4 } = require("uuid");

// Cart Routes
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

router.get("/cart", authenticateToken, async (req, res, next) => {
  const user_id = req.user.user_id;
  try {
    const cartItems = await getCartItems(user_id);
    res.json(cartItems);
  } catch (error) {
    next(error);
  }
});

router.post("/cart", authenticateToken, async (req, res, next) => {
  const user_id = req.user.user_id;
  const { product_id, quantity } = req.body;
  try {
    const newCartItem = await addCartItem(user_id, product_id, quantity);
    res.status(201).json(newCartItem);
  } catch (error) {
    next(error);
  }
});

router.put("/cart/:cart_item_id", authenticateToken, async (req, res, next) => {
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

router.delete(
  "/cart/:cart_item_id",
  authenticateToken,
  async (req, res, next) => {
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
  }
);

// Order Routes
const getAllOrders = async () => {
  try {
    const result = await client.query("SELECT * FROM orders");
    return result.rows;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

const getOrderById = async (order_id) => {
  try {
    const result = await client.query(
      "SELECT * FROM orders WHERE order_id = $1",
      [order_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching order with order_id ${order_id}:`, error);
    throw error;
  }
};

const addOrder = async (
  user_id,
  product_ids,
  total_price,
  order_date,
  status
) => {
  const order_id = uuidv4();
  try {
    const result = await client.query(
      "INSERT INTO orders (order_id, user_id, product_ids, total_price, order_date, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [order_id, user_id, product_ids, total_price, order_date, status]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error adding order:", error);
    throw error;
  }
};

const updateOrder = async (
  order_id,
  user_id,
  product_ids,
  total_price,
  order_date,
  status
) => {
  try {
    const result = await client.query(
      "UPDATE orders SET user_id = $2, product_ids = $3, total_price = $4, order_date = $5, status = $6 WHERE order_id = $1 RETURNING *",
      [order_id, user_id, product_ids, total_price, order_date, status]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

const deleteOrder = async (order_id) => {
  try {
    const result = await client.query(
      "DELETE FROM orders WHERE order_id = $1 RETURNING *",
      [order_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

router.get("/orders", async (req, res, next) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.get("/orders/:order_id", async (req, res, next) => {
  const { order_id } = req.params;
  try {
    const order = await getOrderById(order_id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
});

router.post("/orders", async (req, res, next) => {
  const { user_id, product_ids, total_price, order_date, status } = req.body;
  try {
    const newOrder = await addOrder(
      user_id,
      product_ids,
      total_price,
      order_date,
      status
    );
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

router.put("/orders/:order_id", async (req, res, next) => {
  const { order_id } = req.params;
  const { user_id, product_ids, total_price, order_date, status } = req.body;
  try {
    const updatedOrder = await updateOrder(
      order_id,
      user_id,
      product_ids,
      total_price,
      order_date,
      status
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
});

router.delete("/orders/:order_id", async (req, res, next) => {
  const { order_id } = req.params;
  try {
    const deletedOrder = await deleteOrder(order_id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(deletedOrder);
  } catch (error) {
    next(error);
  }
});

// Payment Routes
const getAllPayments = async () => {
  try {
    const result = await client.query("SELECT * FROM payments");
    return result.rows;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

const getPaymentById = async (payment_id) => {
  try {
    const result = await client.query(
      "SELECT * FROM payments WHERE payment_id = $1",
      [payment_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error(
      `Error fetching payment with payment_id ${payment_id}:`,
      error
    );
    throw error;
  }
};

const addPayment = async (
  order_id,
  amount,
  payment_method,
  payment_date,
  status
) => {
  const payment_id = uuidv4();
  try {
    const result = await client.query(
      "INSERT INTO payments (payment_id, order_id, amount, payment_method, payment_date, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [payment_id, order_id, amount, payment_method, payment_date, status]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error adding payment:", error);
    throw error;
  }
};

const updatePayment = async (
  payment_id,
  order_id,
  amount,
  payment_method,
  payment_date,
  status
) => {
  try {
    const result = await client.query(
      "UPDATE payments SET order_id = $2, amount = $3, payment_method = $4, payment_date = $5, status = $6 WHERE payment_id = $1 RETURNING *",
      [payment_id, order_id, amount, payment_method, payment_date, status]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
};

const deletePayment = async (payment_id) => {
  try {
    const result = await client.query(
      "DELETE FROM payments WHERE payment_id = $1 RETURNING *",
      [payment_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw error;
  }
};

router.get("/payments", async (req, res, next) => {
  try {
    const payments = await getAllPayments();
    res.json(payments);
  } catch (error) {
    next(error);
  }
});

router.get("/payments/:payment_id", async (req, res, next) => {
  const { payment_id } = req.params;
  try {
    const payment = await getPaymentById(payment_id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

router.post("/payments", async (req, res, next) => {
  const { order_id, amount, payment_method, payment_date, status } = req.body;
  try {
    const newPayment = await addPayment(
      order_id,
      amount,
      payment_method,
      payment_date,
      status
    );
    res.status(201).json(newPayment);
  } catch (error) {
    next(error);
  }
});

router.put("/payments/:payment_id", async (req, res, next) => {
  const { payment_id } = req.params;
  const { order_id, amount, payment_method, payment_date, status } = req.body;
  try {
    const updatedPayment = await updatePayment(
      payment_id,
      order_id,
      amount,
      payment_method,
      payment_date,
      status
    );
    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(updatedPayment);
  } catch (error) {
    next(error);
  }
});

router.delete("/payments/:payment_id", async (req, res, next) => {
  const { payment_id } = req.params;
  try {
    const deletedPayment = await deletePayment(payment_id);
    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(deletedPayment);
  } catch (error) {
    next(error);
  }
});

// Shipping Routes
const getAllShippingInfo = async () => {
  try {
    const result = await client.query("SELECT * FROM shipping_info");
    return result.rows;
  } catch (error) {
    console.error("Error fetching shipping info:", error);
    throw error;
  }
};

const getShippingInfoById = async (shipping_id) => {
  try {
    const result = await client.query(
      "SELECT * FROM shipping_info WHERE shipping_id = $1",
      [shipping_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error(
      `Error fetching shipping info with shipping_id ${shipping_id}:`,
      error
    );
    throw error;
  }
};

const addShippingInfo = async (
  order_id,
  address,
  city,
  state,
  postal_code,
  country
) => {
  const shipping_id = uuidv4();
  try {
    const result = await client.query(
      "INSERT INTO shipping_info (shipping_id, order_id, address, city, state, postal_code, country) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [shipping_id, order_id, address, city, state, postal_code, country]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error adding shipping info:", error);
    throw error;
  }
};

const updateShippingInfo = async (
  shipping_id,
  order_id,
  address,
  city,
  state,
  postal_code,
  country
) => {
  try {
    const result = await client.query(
      "UPDATE shipping_info SET order_id = $2, address = $3, city = $4, state = $5, postal_code = $6, country = $7 WHERE shipping_id = $1 RETURNING *",
      [shipping_id, order_id, address, city, state, postal_code, country]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating shipping info:", error);
    throw error;
  }
};

const deleteShippingInfo = async (shipping_id) => {
  try {
    const result = await client.query(
      "DELETE FROM shipping_info WHERE shipping_id = $1 RETURNING *",
      [shipping_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting shipping info:", error);
    throw error;
  }
};

router.get("/shipping", async (req, res, next) => {
  try {
    const shippingInfo = await getAllShippingInfo();
    res.json(shippingInfo);
  } catch (error) {
    next(error);
  }
});

router.get("/shipping/:shipping_id", async (req, res, next) => {
  const { shipping_id } = req.params;
  try {
    const shippingInfo = await getShippingInfoById(shipping_id);
    if (!shippingInfo) {
      return res.status(404).json({ message: "Shipping info not found" });
    }
    res.json(shippingInfo);
  } catch (error) {
    next(error);
  }
});

router.post("/shipping", async (req, res, next) => {
  const { order_id, address, city, state, postal_code, country } = req.body;
  try {
    const newShippingInfo = await addShippingInfo(
      order_id,
      address,
      city,
      state,
      postal_code,
      country
    );
    res.status(201).json(newShippingInfo);
  } catch (error) {
    next(error);
  }
});

router.put("/shipping/:shipping_id", async (req, res, next) => {
  const { shipping_id } = req.params;
  const { order_id, address, city, state, postal_code, country } = req.body;
  try {
    const updatedShippingInfo = await updateShippingInfo(
      shipping_id,
      order_id,
      address,
      city,
      state,
      postal_code,
      country
    );
    if (!updatedShippingInfo) {
      return res.status(404).json({ message: "Shipping info not found" });
    }
    res.json(updatedShippingInfo);
  } catch (error) {
    next(error);
  }
});

router.delete("/shipping/:shipping_id", async (req, res, next) => {
  const { shipping_id } = req.params;
  try {
    const deletedShippingInfo = await deleteShippingInfo(shipping_id);
    if (!deletedShippingInfo) {
      return res.status(404).json({ message: "Shipping info not found" });
    }
    res.json(deletedShippingInfo);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
