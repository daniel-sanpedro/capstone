const { client } = require("../db");
const users = require("./userSeed");
const products = require("./productSeed");

const seedDatabase = async () => {
  try {
    await client.connect();

    for (const user of users) {
      await client.query(
        `
        INSERT INTO users (username, email, password_hash, full_name, address, phone_number, is_admin)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [
          user.username,
          user.email,
          user.password,
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
        INSERT INTO products (name, description, price, category_id)
        VALUES ($1, $2, $3, $4)
      `,
        [product.name, product.description, product.price, product.category_id]
      );
    }

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
};

seedDatabase();
