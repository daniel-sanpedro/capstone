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
    name: "Bulleit Bourbon",
    price: 29.99,
    quantity: 15,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-39254/bulleit-bourbon.jpg?ss=2.0",
  },
  {
    id: 2,
    name: "Blanton's Original Single Barrel Bourbon",
    price: 69.99,
    quantity: 6,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-45189/blantons-original-single-barrel-bourbon-whiskey.jpg?ss=2.0",
  },
  {
    id: 3,
    name: "Buffalo Trace Bourbon",
    price: 29.99,
    quantity: 14,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-1730/buffalo-trace.jpg?ss=2.0",
  },
  {
    id: 4,
    name: "Woodford Reserve Bourbon",
    price: 34.99,
    quantity: 12,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-1539/woodford-reserve-distillers-select.jpg?ss=2.0",
  },
  {
    id: 5,
    name: "Eagle Rare 10 Year Old",
    price: 49.99,
    quantity: 10,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-15223/eagle-rare-10-year-old-bourbon.jpg?ss=2.0",
  },
  {
    id: 6,
    name: "Elijah Craig Small Batch Bourbon",
    price: 39.99,
    quantity: 8,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-160/elijah-craig-small-batch-bourbon.jpg?ss=2.0",
  },
  {
    id: 7,
    name: "Four Roses Single Barrel Bourbon",
    price: 49.99,
    quantity: 7,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-1749/four-roses-single-barrel-bourbon.jpg?ss=2.0",
  },
  {
    id: 8,
    name: "Maker's Mark Bourbon",
    price: 24.99,
    quantity: 20,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-3932/makers-mark-bourbon.jpg?ss=2.0",
  },
  {
    id: 9,
    name: "Knob Creek 9 Year Old Bourbon",
    price: 39.99,
    quantity: 12,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-3928/knob-creek-9-year-old-bourbon.jpg?ss=2.0",
  },
  {
    id: 10,
    name: "Wild Turkey 101 Bourbon",
    price: 22.99,
    quantity: 18,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-3929/wild-turkey-101-bourbon.jpg?ss=2.0",
  },
  {
    id: 11,
    name: "Old Forester 1920 Prohibition Style Bourbon",
    price: 59.99,
    quantity: 8,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-43002/old-forester-1920-prohibition-style-bourbon.jpg?ss=2.0",
  },
  {
    id: 12,
    name: "1792 Small Batch Bourbon",
    price: 29.99,
    quantity: 10,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-3942/1792-small-batch-bourbon.jpg?ss=2.0",
  },
  {
    id: 13,
    name: "Henry McKenna 10 Year Old Single Barrel Bourbon",
    price: 49.99,
    quantity: 5,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-40449/henry-mckenna-10-year-old-single-barrel-bourbon.jpg?ss=2.0",
  },
  {
    id: 14,
    name: "Basil Hayden's Bourbon",
    price: 39.99,
    quantity: 9,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-1789/basil-haydens-bourbon.jpg?ss=2.0",
  },
  {
    id: 15,
    name: "Angel's Envy Bourbon",
    price: 49.99,
    quantity: 8,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-3921/angels-envy-bourbon.jpg?ss=2.0",
  },
  {
    id: 16,
    name: "Booker's Bourbon",
    price: 89.99,
    quantity: 4,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-4035/bookers-bourbon.jpg?ss=2.0",
  },
  {
    id: 17,
    name: "George T. Stagg Bourbon",
    price: 249.99,
    quantity: 3,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-40451/george-t-stagg-bourbon.jpg?ss=2.0",
  },
  {
    id: 18,
    name: "Pappy Van Winkle's Family Reserve 15 Year Old",
    price: 999.99,
    quantity: 1,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-15224/pappy-van-winkles-family-reserve-15-year-old.jpg?ss=2.0",
  },
  {
    id: 19,
    name: "Jefferson's Ocean Aged at Sea Bourbon",
    price: 79.99,
    quantity: 7,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-40310/jeffersons-ocean-aged-at-sea-bourbon.jpg?ss=2.0",
  },
  {
    id: 20,
    name: "W.L. Weller Special Reserve Bourbon",
    price: 29.99,
    quantity: 10,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-40439/w-l-weller-special-reserve-bourbon.jpg?ss=2.0",
  },
  {
    id: 21,
    name: "Evan Williams Black Label Bourbon",
    price: 17.99,
    quantity: 15,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-1743/evan-williams-black-label-bourbon.jpg?ss=2.0",
  },
  {
    id: 22,
    name: "Old Grand-Dad 114 Bourbon",
    price: 29.99,
    quantity: 8,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-40400/old-grand-dad-114-bourbon.jpg?ss=2.0",
  },
  {
    id: 23,
    name: "Rebel Yell 10 Year Old Single Barrel Bourbon",
    price: 59.99,
    quantity: 5,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-39299/rebel-yell-10-year-old-single-barrel-bourbon.jpg?ss=2.0",
  },
  {
    id: 24,
    name: "Wild Turkey Rare Breed Bourbon",
    price: 49.99,
    quantity: 10,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-3926/wild-turkey-rare-breed-bourbon.jpg?ss=2.0",
  },
  {
    id: 25,
    name: "Russell's Reserve 10 Year Old Bourbon",
    price: 39.99,
    quantity: 10,
    imageUrl:
      "https://cdn2.masterofmalt.com/whiskies/p-1747/russells-reserve-10-year-old-bourbon.jpg?ss=2.0",
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
