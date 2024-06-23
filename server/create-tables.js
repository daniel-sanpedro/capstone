const { createTables } = require("./db");

const run = async () => {
  try {
    await createTables();
  } catch (err) {
    console.error("Error running table creation script:", err);
  }
};

run();
