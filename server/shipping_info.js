const express = require("express");
const router = express.Router();
const { client } = require("./db");
const { v4: uuidv4 } = require("uuid");

const getAllShippingInfo = async () => {
  try {
    const result = await client.query("SELECT * FROM shipping_info");
    return result.rows;
  } catch (error) {
    console.error("Error fetching shipping information:", error);
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
      `Error fetching shipping information with shipping_id ${shipping_id}:`,
      error
    );
    throw error;
  }
};

const addShippingInfo = async (
  order_id,
  shipping_address,
  shipping_method,
  tracking_number,
  shipping_status
) => {
  const shipping_id = uuidv4();
  try {
    const result = await client.query(
      "INSERT INTO shipping_info (shipping_id, order_id, shipping_address, shipping_method, tracking_number, shipping_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        shipping_id,
        order_id,
        shipping_address,
        shipping_method,
        tracking_number,
        shipping_status,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error adding shipping information:", error);
    throw error;
  }
};

const updateShippingInfo = async (
  shipping_id,
  order_id,
  shipping_address,
  shipping_method,
  tracking_number,
  shipping_status
) => {
  try {
    const result = await client.query(
      "UPDATE shipping_info SET order_id = $2, shipping_address = $3, shipping_method = $4, tracking_number = $5, shipping_status = $6 WHERE shipping_id = $1 RETURNING *",
      [
        shipping_id,
        order_id,
        shipping_address,
        shipping_method,
        tracking_number,
        shipping_status,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating shipping information:", error);
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
    console.error("Error deleting shipping information:", error);
    throw error;
  }
};

router.get("/", async (req, res, next) => {
  try {
    const shippingInfo = await getAllShippingInfo();
    res.json(shippingInfo);
  } catch (error) {
    next(error);
  }
});

router.get("/:shipping_id", async (req, res, next) => {
  const { shipping_id } = req.params;
  try {
    const shippingInfo = await getShippingInfoById(shipping_id);
    if (!shippingInfo) {
      return res
        .status(404)
        .json({ message: "Shipping information not found" });
    }
    res.json(shippingInfo);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const {
    order_id,
    shipping_address,
    shipping_method,
    tracking_number,
    shipping_status,
  } = req.body;
  try {
    const newShippingInfo = await addShippingInfo(
      order_id,
      shipping_address,
      shipping_method,
      tracking_number,
      shipping_status
    );
    res.status(201).json(newShippingInfo);
  } catch (error) {
    next(error);
  }
});

router.put("/:shipping_id", async (req, res, next) => {
  const { shipping_id } = req.params;
  const {
    order_id,
    shipping_address,
    shipping_method,
    tracking_number,
    shipping_status,
  } = req.body;
  try {
    const updatedShippingInfo = await updateShippingInfo(
      shipping_id,
      order_id,
      shipping_address,
      shipping_method,
      tracking_number,
      shipping_status
    );
    if (!updatedShippingInfo) {
      return res
        .status(404)
        .json({ message: "Shipping information not found" });
    }
    res.json(updatedShippingInfo);
  } catch (error) {
    next(error);
  }
});

router.delete("/:shipping_id", async (req, res, next) => {
  const { shipping_id } = req.params;
  try {
    const deletedShippingInfo = await deleteShippingInfo(shipping_id);
    if (!deletedShippingInfo) {
      return res
        .status(404)
        .json({ message: "Shipping information not found" });
    }
    res.json(deletedShippingInfo);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
