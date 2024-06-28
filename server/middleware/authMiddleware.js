const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return res
      .status(403)
      .json({ message: "Access denied. Admin rights required." });
  }
  next();
};

module.exports = { authenticateToken, verifyAdmin };
