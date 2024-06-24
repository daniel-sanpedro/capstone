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
  {
    id: 1,
    name: "Lagavulin 16 Year Old",
    price: 89.99,
    imageUrl:
      "https://cdn.shopify.com/s/files/1/1862/8545/products/lagavulin-16-scotch-whiskey-750ml_5000x.jpg?v=1613085574",
  },
  {
    id: 2,
    name: "Macallan 18 Year Old Sherry Oak",
    price: 259.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-16972/macallan-18-year-old-sherry-oak-whisky.jpg?ss=2.0",
  },
  {
    id: 3,
    name: "Hibiki Japanese Harmony",
    price: 89.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-37355/hibiki-japanese-harmony.jpg?ss=2.0",
  },
  {
    id: 4,
    name: "Balvenie DoubleWood 12 Year Old",
    price: 64.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-37313/balvenie-doublewood-12-year-old.jpg?ss=2.0",
  },
  {
    id: 5,
    name: "Jameson Irish Whiskey",
    price: 29.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-1705/jameson.jpg?ss=2.0",
  },
  {
    id: 6,
    name: "Yamazaki 12 Year Old",
    price: 199.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-4680/yamazaki-12-year-old.jpg?ss=2.0",
  },
  {
    id: 7,
    name: "Ardbeg 10 Year Old",
    price: 49.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-2997/ardbeg-10-year-old-whisky.jpg?ss=2.0",
  },
  {
    id: 8,
    name: "Glenfiddich 18 Year Old",
    price: 109.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-214/glenfiddich-18-year-old-single-malt-whisky.jpg?ss=2.0",
  },
  {
    id: 9,
    name: "Highland Park 12 Year Old Viking Honour",
    price: 54.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-1609/highland-park-12-year-old-viking-honour.jpg?ss=2.0",
  },
  {
    id: 10,
    name: "Redbreast 12 Year Old",
    price: 69.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-4528/redbreast-12-year-old.jpg?ss=2.0",
  },
  {
    id: 11,
    name: "Glenlivet 18 Year Old",
    price: 119.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-203/glenlivet-18-year-old-single-malt-whisky.jpg?ss=2.0",
  },
  {
    id: 12,
    name: "Nikka From The Barrel",
    price: 74.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-37516/nikka-from-the-barrel.jpg?ss=2.0",
  },
  {
    id: 13,
    name: "Bulleit Bourbon",
    price: 29.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-39254/bulleit-bourbon.jpg?ss=2.0",
  },
  {
    id: 14,
    name: "Oban 14 Year Old",
    price: 74.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-1511/oban-14-year-old.jpg?ss=2.0",
  },
  {
    id: 15,
    name: "Blanton's Original Single Barrel Bourbon",
    price: 69.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-45189/blantons-original-single-barrel-bourbon-whiskey.jpg?ss=2.0",
  },
  {
    id: 16,
    name: "Talisker 10 Year Old",
    price: 59.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-2192/talisker-10-year-old.jpg?ss=2.0",
  },
  {
    id: 17,
    name: "Woodford Reserve Bourbon",
    price: 34.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-1539/woodford-reserve-distillers-select.jpg?ss=2.0",
  },
  {
    id: 18,
    name: "Glenmorangie 10 Year Old Original",
    price: 34.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-153/glenmorangie-original-10-year-old.jpg?ss=2.0",
  },
  {
    id: 19,
    name: "Buffalo Trace Bourbon",
    price: 29.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-1730/buffalo-trace.jpg?ss=2.0",
  },
  {
    id: 20,
    name: "GlenDronach 12 Year Old",
    price: 59.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-37438/glendronach-12-year-old.jpg?ss=2.0",
  },
  {
    id: 21,
    name: "Jack Daniel's Old No. 7",
    price: 27.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-1521/jack-daniels-old-no7-tennessee-whiskey.jpg?ss=2.0",
  },
  {
    id: 22,
    name: "Eagle Rare 10 Year Old",
    price: 49.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-15223/eagle-rare-10-year-old-bourbon.jpg?ss=2.0",
  },
  {
    id: 23,
    name: "Old Pulteney 12 Year Old",
    price: 39.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-4907/old-pulteney-12-year-old.jpg?ss=2.0",
  },
  {
    id: 24,
    name: "Aberlour 12 Year Old Double Cask Matured",
    price: 44.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-1882/aberlour-12-year-old-double-cask.jpg?ss=2.0",
  },
  {
    id: 25,
    name: "Glenfarclas 105 Cask Strength",
    price: 69.99,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-1702/glenfarclas-105-cask-strength.jpg?ss=2.0",
  },
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
