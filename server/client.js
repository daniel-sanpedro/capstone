const client = require("./db");

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database");
  } catch (err) {
    console.error("Error connecting to PostgreSQL database", err);
  }
}

async function disconnectDB() {
  try {
    await client.end();
    console.log("Disconnected from PostgreSQL database");
  } catch (err) {
    console.error("Error disconnecting from PostgreSQL database", err);
  }
}

connectDB();

module.exports = {
  connectDB,
  disconnectDB,
  client,
};
