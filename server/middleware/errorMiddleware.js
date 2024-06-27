const { NODE_ENV } = process.env;

const handleServerError = (err, req, res, next) => {
  console.error("Server Error:", err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  if (NODE_ENV === "production") {
    res.json({
      message: "Internal Server Error",
    });
  } else {
    res.json({
      message: err.message,
      stack: err.stack,
    });
  }
};

const handleNotFoundError = (req, res) => {
  res.status(404).json({
    message: "Not Found",
  });
};

module.exports = {
  handleServerError,
  handleNotFoundError,
};
