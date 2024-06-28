const client = require("./client");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const findUserByUsername = async (username) => {
  const res = await client.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return res.rows[0];
};

const createUser = async (userDetails) => {
  const { username, password, email, fullName, address, phoneNumber, isAdmin } =
    userDetails;
  const userId = uuidv4();
  const passwordHash = await bcrypt.hash(password, 10);

  const res = await client.query(
    `
    INSERT INTO users (user_id, username, email, password_hash, full_name, address, phone_number, is_admin)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `,
    [
      userId,
      username,
      email,
      passwordHash,
      fullName,
      address,
      phoneNumber,
      isAdmin || false,
    ]
  );
  return res.rows[0];
};

module.exports = { findUserByUsername, createUser };
