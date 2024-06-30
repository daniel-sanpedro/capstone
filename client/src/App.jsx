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

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get("/api/cart");
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (productId) => {
    try {
      const response = await axios.post("/api/cart/add", {
        productId,
      });
      setCart(response.data);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await axios.post("/api/checkout", { cartItems: cart });
      console.log("Checkout successful", response.data);
      setCart([]);
      navigate("/");
    } catch (error) {
      console.error("Checkout failed", error);
    }
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
          element={
            <ProductList
              products={products}
              setProducts={setProducts}
              addToCart={addToCart}
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/cart"
          element={<Cart cart={cart} handleCheckout={handleCheckout} />}
        />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
