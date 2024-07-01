const express = require("express");
const router = express.Router();
const client = require("../client");

const createOrder = async (userId, totalAmount) => {
  const SQL = `
    INSERT INTO orders (user_id, total_amount)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [userId, totalAmount];

  const res = await client.query(SQL, values);
  return res.rows[0];
};

const createPayment = async (orderId, amount, paymentMethod) => {
  const SQL = `
    INSERT INTO payments (order_id, amount, payment_method)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [orderId, amount, paymentMethod];

  const res = await client.query(SQL, values);
  return res.rows[0];
};

router.post("/checkout", async (req, res, next) => {
  const { totalAmount, paymentMethod } = req.body;

  try {
    const order = await createOrder(req.user.user_id, totalAmount);
    const payment = await createPayment(
      order.order_id,
      totalAmount,
      paymentMethod
    );

    res.status(201).json({ order, payment });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
