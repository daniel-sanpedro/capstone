const express = require("express");
const { client } = require("./db");
const usersRouter = require("./users");
const productsRouter = require("./products");
const shippingInfoRouter = require("./shipping_info");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/shipping-info", shippingInfoRouter);

app.get("/", (req, res) => {
  res.send("whiskey site");
});

app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).send("Something broke!");
});

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
