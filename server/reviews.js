const { client } = require("./db");

const createReview = async (review) => {
  const { product_id, user_id, rating, review_text } = review;
  const SQL = `
    INSERT INTO product_reviews (review_id, product_id, user_id, rating, review_text, review_date)
    VALUES (uuid_generate_v4(), $1, $2, $3, $4, CURRENT_TIMESTAMP)
    RETURNING *;
  `;
  try {
    const result = await client.query(SQL, [
      product_id,
      user_id,
      rating,
      review_text,
    ]);
    return result.rows[0];
  } catch (err) {
    console.error("Error creating review:", err);
    throw err;
  }
};

const getReviewsByProduct = async (product_id) => {
  const SQL = `
    SELECT * FROM product_reviews WHERE product_id = $1;
  `;
  try {
    const result = await client.query(SQL, [product_id]);
    return result.rows;
  } catch (err) {
    console.error("Error getting reviews:", err);
    throw err;
  }
};

const updateReview = async (review_id, updates) => {
  const { rating, review_text } = updates;
  const SQL = `
    UPDATE product_reviews 
    SET rating = $1, review_text = $2, updated_at = CURRENT_TIMESTAMP 
    WHERE review_id = $3
    RETURNING *;
  `;
  try {
    const result = await client.query(SQL, [rating, review_text, review_id]);
    return result.rows[0];
  } catch (err) {
    console.error("Error updating review:", err);
    throw err;
  }
};

const deleteReview = async (review_id) => {
  const SQL = `
    DELETE FROM product_reviews WHERE review_id = $1;
  `;
  try {
    await client.query(SQL, [review_id]);
    console.log(`Review with ID ${review_id} deleted successfully`);
  } catch (err) {
    console.error("Error deleting review:", err);
    throw err;
  }
};

module.exports = {
  createReview,
  getReviewsByProduct,
  updateReview,
  deleteReview,
};
