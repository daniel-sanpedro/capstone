import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductList = ({ addToCart }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/products");
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
      (product) => product.id === productId
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
      {/* Existing content... */}
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
              <p>Quantity: {product.quantity}</p>
              <button
                className="add-to-cart-btn"
                onClick={() => addToCart(product.product_id)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Existing content... */}
    </div>
  );
};

export default ProductList;
