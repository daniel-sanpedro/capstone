import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductList = ({ addToCart }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [sortBy, setSortBy] = useState("product_id");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    fetchProducts(sortBy, order);
  }, [sortBy, order]);

  const fetchProducts = async (sortBy = "product_id", order = "asc") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://capstone-7etx.onrender.com/api/products?sortBy=${sortBy}&order=${order}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error fetching products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const addToCartLocal = (productId) => {
    const selectedProduct = products.find(
      (product) => product.product_id === productId
    );
    if (!selectedProduct) {
      console.error(`Product with ID ${productId} not found.`);
      return;
    }

    const updatedCart = [...cartItems, selectedProduct];
    setCartItems(updatedCart);
    addToCart(productId);
    console.log(`Added ${selectedProduct.name} to cart.`);
  };

  return (
    <div className="product-list">
      <h2>Product List</h2>
      <div className="sort-options">
        <label>Sort By: </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="product_id">Default</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      {loading && <p>Loading products...</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="products-container">
        {products.map((product) => (
          <div key={product.product_id} className="product-card">
            <img
              src={product.img_url}
              alt={product.name}
              className="product-image"
            />
            <div className="product-details">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p>${product.price}</p>
              <button
                className="add-to-cart-btn"
                onClick={() => addToCartLocal(product.product_id)}
              >
                Add to Cart
              </button>
              <p>Quantity: {product.quantity}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="cart">
        <h3>Cart</h3>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.product_id}>
                {item.name} - ${item.price} x {item.quantity}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductList;
