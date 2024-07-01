const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const transactionRoutes = require("./transactionRoutes");
const productRoutes = require("./productRoutes");
const userRoutes = require("./usersRoutes");
const cartRoutes = require("./cartRoutes");

router.use("/cart", cartRoutes);
router.use("/auth", authRoutes);
router.use("/transactions", transactionRoutes);
router.use("/products", productRoutes);
router.use("/users", userRoutes);

module.exports = router;
