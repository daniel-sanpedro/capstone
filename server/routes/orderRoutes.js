const express = require("express");
const router = express.Router();
const { client } = require("../db");
const { v4: uuidv4 } = require("uuid");

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

router.get("/", async (req, res, next) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.get("/:order_id", async (req, res, next) => {
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

router.post("/", async (req, res, next) => {
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

router.put("/:order_id", async (req, res, next) => {
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

router.delete("/:order_id", async (req, res, next) => {
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

module.exports = router;
