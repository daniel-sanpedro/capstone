require("dotenv").config();
const { Client } = require("pg");
const bcrypt = require("bcryptjs");
const users = require("./userSeed");
const products = require("./productSeed");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const seedDatabase = async () => {
  try {
    await client.connect();
    await client.query("BEGIN");
    console.log("Deleting existing data...");

    await client.query("DELETE FROM users");
    await client.query("DELETE FROM products");

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
      console.log(`Seeded user: ${user.username}`);
    }

    console.log("Users seeded successfully. Seeding products...");

    for (const product of products) {
      console.log("Seeding product:", product);
      const res = await client.query(
        `INSERT INTO products (name, description, price, quantity, img_url)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          product.name,
          product.description || "No description available",
          product.price,
          product.quantity,
          product.imageUrl,
        ]
      );
      console.log("Product seeded:", res.rows[0]);
    }

    console.log("Products seeded successfully.");
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
};

seedDatabase();
