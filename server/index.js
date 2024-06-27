const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { port } = require("./config/backendConfig");
const {
  handleServerError,
  handleNotFoundError,
} = require("./middleware/errorMiddleware");
const startServer = require("./utils/serverSetup");

const app = express();
const PORT = process.env.PORT || port;

app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Welcome to the whiskey site");
});

app.use(handleNotFoundError);
app.use(handleServerError);

startServer(app, PORT);
