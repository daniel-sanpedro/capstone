const { Client } = require("pg");

const client = new Client({
  user: "daniel",
  host: "localhost",
  database: "ecommerce",
  password: "d_pw",
  port: 5432,
});

client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
    return client.end();
  })
  .catch((err) =>
    console.error("Error connecting to PostgreSQL database", err)
  );
