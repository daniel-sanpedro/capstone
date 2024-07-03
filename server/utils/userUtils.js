const client = require("../client");
const bcrypt = require("bcryptjs");

const updateUserToAdmin = async (user_id) => {
  try {
    const result = await client.query(
      "UPDATE users SET is_admin = true WHERE user_id = $1 RETURNING *",
      [user_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating user to admin:", error);
    throw error;
  }
};

const signupUser = async (
  username,
  email,
  password,
  full_name,
  address,
  phone_number,
  is_admin
) => {
  try {
    const password_hash = await bcrypt.hash(password, 10);

    const result = await client.query(
      "INSERT INTO users (username, email, password_hash, full_name, address, phone_number, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        username,
        email,
        password_hash,
        full_name,
        address,
        phone_number,
        is_admin,
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error signing up user:", error);
    throw error;
  }
};

module.exports = {
  updateUserToAdmin,
  signupUser,
};
