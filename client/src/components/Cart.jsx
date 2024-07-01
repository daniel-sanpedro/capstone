import React from "react";

const Cart = ({ cart, setCart }) => {
  const handleRemoveItem = (productId) => {
    const updatedCart = cart.filter((item) => item.product_id !== productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const handleCheckout = () => {
    // Here you can add logic to handle actual payment processes
    alert("Checkout successful. Thank you for your purchase!");
    // Clear the cart after checkout
    localStorage.removeItem("cart");
    setCart([]);
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul>
            {cart.map((item) => (
              <li key={item.product_id}>
                <div>{item.name}</div>
                <div>Quantity: {item.quantity || 1}</div>{" "}
                {/* Handle quantity display */}
                <div>Price: ${item.price}</div>
                <button onClick={() => handleRemoveItem(item.product_id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleCheckout}
            style={{ marginTop: "20px", fontSize: "16px" }}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
