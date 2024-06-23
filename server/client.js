const { Client } = require("pg");
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database");
  } catch (err) {
    console.error("Error connecting to PostgreSQL database", err);
    throw err;
  }
}

async function disconnectDB() {
  try {
    await client.end();
    console.log("Disconnected from PostgreSQL database");
  } catch (err) {
    console.error("Error disconnecting from PostgreSQL database", err);
    throw err;
  }
}

connectDB();

module.exports = {
  connectDB,
  disconnectDB,
  client,
  pool,
};
