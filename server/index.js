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
app.use(express.json());
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
