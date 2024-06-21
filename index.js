const express = require("express");
const client = require("./db");

const app = express();
const PORT = 3000;

const init = async () => {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Define a simple route to test the server
    app.get("/", (req, res) => {
      res.send("Hello, World!");
    });
  } catch (err) {
    console.error("Error connecting to PostgreSQL database", err);
  }
};

init();
