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
      <h2>Product List</h2>
      {loading && <p>Loading products...</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="products">
        {products.map((product) => (
          <div key={product.product_id} className="product">
            <div className="product-item">
              <h3>{product.name}</h3>
              <img src={product.img_url} alt={product.name} />
              <p className="product-description">{product.description}</p>{" "}
              {/* Added description */}
              <p>${product.price}</p>
              <p>Quantity: {product.quantity}</p>
              <button onClick={() => addToCartLocal(product.product_id)}>
                Add to Cart
              </button>
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
                {item.name} - ${item.price} x {item.quantity}{" "}
                {/* Added quantity display */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductList;
