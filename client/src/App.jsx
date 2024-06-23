import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Signup from "./components/Signup";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/cart");
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (productId) => {
    try {
      const response = await axios.post("http://localhost:5000/api/cart/add", {
        productId,
      });
      setCart(response.data);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/products"
          element={<ProductList products={products} addToCart={addToCart} />}
        />
        <Route path="/cart" element={<Cart cart={cart} />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
