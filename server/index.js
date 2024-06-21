const express = require("express");
const cors = require("cors");
const { client } = require("./db");
const {
  handleServerError,
  handleNotFoundError,
} = require("./middleware/errorMiddleware");
const usersRouter = require("./routes/usersRoutes");
const productsRouter = require("./routes/productRoutes");
const ordersRouter = require("./routes/orderRoutes");
const paymentsRouter = require("./routes/paymentRoutes");
const shippingInfoRouter = require("./routes/shippingRoutes");
const authRouter = require("./routes/authRoutes");

const { port } = require("./config");

const app = express();
const PORT = process.env.PORT || 3000;

const products = [
  { id: 1, name: "Product A", price: 10 },
  { id: 2, name: "Product B", price: 20 },
  { id: 3, name: "Product C", price: 15 },
];

const cart = [];

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/payments", paymentsRouter);
app.use("/shipping-info", shippingInfoRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the whiskey site");
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/cart", (req, res) => {
  res.json(cart);
});

app.post("/api/cart/add", (req, res) => {
  const productId = req.body.productId;
  const product = products.find((p) => p.id === productId);
  if (product) {
    cart.push({ ...product, quantity: 1 });
    res.status(201).json(cart);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

app.use(handleNotFoundError);
app.use(handleServerError);

const startServer = async () => {
  try {
    await client.connect();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
};

startServer();
