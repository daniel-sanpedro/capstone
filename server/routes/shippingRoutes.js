const express = require("express");
const router = express.Router();
const { client } = require("../db");
const { v4: uuidv4 } = require("uuid");

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
      return res.status(404).json({ message: "Shipping info not found" });
    }
    res.json(shippingInfo);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
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

router.put("/:shipping_id", async (req, res, next) => {
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

router.delete("/:shipping_id", async (req, res, next) => {
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
