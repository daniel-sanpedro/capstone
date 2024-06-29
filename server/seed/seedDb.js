const client = require("../client");
const bcrypt = require("bcryptjs");
const users = require("./userSeed");
const products = require("./productSeed");

const seedDatabase = async () => {
  try {
    await client.query("BEGIN");
    console.log("Seeding users...");

    for (const user of users) {
      const passwordHash = await bcrypt.hash(user.password, 10);
      await client.query(
        `INSERT INTO users (username, email, password_hash, full_name, address, phone_number, is_admin)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          user.username,
          user.email,
          passwordHash,
          user.full_name,
          user.address,
          user.phone_number,
          user.is_admin,
        ]
      );
    }

    console.log("Users seeded successfully. Seeding products...");

    for (const product of products) {
      await client.query(
        `INSERT INTO products (name, description, price, quantity, img_url)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          product.name,
          product.description || "No description available",
          product.price,
          product.quantity,
          product.imageUrl,
        ]
      );
    }

    console.log("Products seeded successfully.");
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error seeding database:", error);
  } finally {
    // Do not call client.end() here because we are using a shared client from client.js
  }
};

seedDatabase();
