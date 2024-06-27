const { client } = require("../db");

const startServer = async (app, port) => {
  try {
    await client.connect();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
};

module.exports = startServer;
