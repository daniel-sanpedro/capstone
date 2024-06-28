const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./config");

const generateToken = (user) => {
  console.log("JWT Secret:", jwtSecret);
  return jwt.sign(
    {
      user_id: user.user_id,
      username: user.username,
      is_admin: user.is_admin,
    },
    jwtSecret,
    { expiresIn: "1h" }
  );
};

module.exports = { generateToken };
