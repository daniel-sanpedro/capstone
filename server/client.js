const { Client } = require("pg");
require("dotenv").config(); // Load environment variables at the top

// Debugging to check if environment variables are loaded correctly
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DATABASE_URL:", process.env.DATABASE_URL);

// Create a new PostgreSQL client instance
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client
  .connect()
  .then(() => console.log("Connected to the database successfully"))
  .catch((err) => console.error("Failed to connect to the database", err));

module.exports = client;
