const { Client } = require("pg");

const client = new Client({
  user: "daniel",
  host: "localhost",
  database: "ecommerce",
  password: "d_pw",
  port: 5432,
});

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS shipping_info, product_reviews, payments, order_items, orders, products, categories, users;

    CREATE TABLE users (
      user_id UUID PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(100),
      address TEXT,
      phone_number VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE categories (
      category_id UUID PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE products (
      product_id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      category_id UUID REFERENCES categories(category_id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE orders (
      order_id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(user_id),
      order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      total_amount DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE order_items (
      order_item_id UUID PRIMARY KEY,
      order_id UUID REFERENCES orders(order_id),
      product_id UUID REFERENCES products(product_id),
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE payments (
      payment_id UUID PRIMARY KEY,
      order_id UUID REFERENCES orders(order_id),
      amount DECIMAL(10, 2) NOT NULL,
      payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      payment_method VARCHAR(50),
      transaction_id VARCHAR(100),
      status VARCHAR(50) DEFAULT 'success',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE product_reviews (
      review_id UUID PRIMARY KEY,
      product_id UUID REFERENCES products(product_id),
      user_id UUID REFERENCES users(user_id),
      rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
      review_text TEXT,
      review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE shipping_info (
      shipping_id UUID PRIMARY KEY,
      order_id UUID REFERENCES orders(order_id),
      shipping_address TEXT,
      shipping_method VARCHAR(100),
      tracking_number VARCHAR(100),
      shipping_status VARCHAR(50) DEFAULT 'shipped',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await client.connect();
    await client.query(SQL);
    console.log("Tables created successfully");
  } catch (err) {
    console.error("Error creating tables", err);
    throw err;
  } finally {
    await client.end();
    console.log("Disconnected from PostgreSQL database");
  }
};

const connect = async () => {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database");
  } catch (err) {
    console.error("Error connecting to PostgreSQL database", err);
    throw err;
  }
};

module.exports = {
  client,
  connect,
  createTables,
};
