const { client } = require("../db");

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

module.exports = {
  updateUserToAdmin,
};
