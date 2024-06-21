const express = require("express");
const router = express.Router();
const { client } = require("../db");
const { v4: uuidv4 } = require("uuid");

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

router.get("/", async (req, res, next) => {
  try {
    const payments = await getAllPayments();
    res.json(payments);
  } catch (error) {
    next(error);
  }
});

router.get("/:payment_id", async (req, res, next) => {
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

router.post("/", async (req, res, next) => {
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

router.put("/:payment_id", async (req, res, next) => {
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

router.delete("/:payment_id", async (req, res, next) => {
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

module.exports = router;
