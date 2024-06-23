import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./Login";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/cart");
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleCheckout = () => {
    console.log("Checkout functionality");
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {isLoggedIn ? (
        <>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <li key={item.id}>
                  <div>{item.name}</div>
                  <div>Quantity: {item.quantity}</div>
                  <div>Price: ${item.price}</div>
                </li>
              ))}
            </ul>
          )}
          <button onClick={handleCheckout}>Checkout</button>
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default Cart;
