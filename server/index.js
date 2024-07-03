require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const {
  handleServerError,
  handleNotFoundError,
} = require("./middleware/errorMiddleware");
const { createTables } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Middleware to log incoming requests
// app.use((req, res, next) => {
//   req.rawBody = "";
//   req.on("data", (chunk) => {
//     req.rawBody += chunk.toString();
//   });
//   req.on("end", () => {
//     console.log("Incoming Raw Body:", req.rawBody);
//     next();
//   });
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`Middleware check - Method: ${req.method}, URL: ${req.url}`);
  next();
});

app.use((req, res, next) => {
  console.log(`Body after JSON parsing middleware:`, req.body);
  next();
});

app.post("/test", (req, res) => {
  console.log("Test Route Body:", req.body);
  res.status(200).json(req.body);
});

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Welcome to the whiskey site");
});

app.use(handleNotFoundError);
app.use(handleServerError);

const startServer = async () => {
  try {
    await createTables();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
};

startServer();
