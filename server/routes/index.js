const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const productRoutes = require("./productRoutes");
const transactionRoutes = require("./transactionRoutes");
const userRoutes = require("./usersRoutes");

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/transactions", transactionRoutes);
router.use("/users", userRoutes);

module.exports = router;
