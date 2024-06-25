require("dotenv").config();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports = {
  db: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  },
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3000,
};
