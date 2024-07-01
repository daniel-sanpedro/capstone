import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  axios.defaults.baseURL = "http://localhost:3000/api";

  useEffect(() => {
    fetchProducts();
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addToCart = (productId) => {
    const productToAdd = products.find(
      (product) => product.product_id === productId
    );
    if (!productToAdd) {
      console.error("Product not found!");
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = [...existingCart, productToAdd];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/cart">Cart</Link>
        </div>
        <div className="navbar-right">
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      </nav>

      <Routes>
        <Route
          exact
          path="/"
          element={<ProductList products={products} addToCart={addToCart} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
