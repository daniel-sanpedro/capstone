import React from "react";

const Cart = ({ cart, setCart }) => {
  const handleRemoveItem = (productId) => {
    const updatedCart = cart.filter((item) => item.product_id !== productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.product_id}>
              <div>{item.name}</div>
              <div>Quantity: 1</div>{" "}
              {/* Assuming each cart item is added once */}
              <div>Price: ${item.price}</div>
              <button onClick={() => handleRemoveItem(item.product_id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
