const { Client } = require("pg");

const client = new Client({
  user: "daniel",
  host: "localhost",
  database: "ecommerce",
  password: "d_pw",
  port: 5432,
});

module.exports = client;
