const client = require("../client");
const bcrypt = require("bcryptjs");
const users = require("./userSeed");
const products = require("./productSeed");

const seedDatabase = async () => {
  try {
    await client.connect();
    await client.query("BEGIN");

    for (const user of users) {
      const passwordHash = await bcrypt.hash(user.password, 10);
      await client.query(
        `
        INSERT INTO users (username, email, password_hash, full_name, address, phone_number, is_admin)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
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

    for (const product of products) {
      await client.query(
        `
        INSERT INTO products (name, description, price, category_id, quantity, img_url)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [
          product.name,
          product.description,
          product.price,
          product.category_id,
          product.quantity,
          product.imgUrl,
        ]
      );
    }

    await client.query("COMMIT");
    console.log("Database seeded successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
};

seedDatabase();
