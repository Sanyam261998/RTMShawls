import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  clearCart,
  updateQuantity,
} from "../features/cart/cartSlice.js";
import { placeOrder } from "../features/order/orderSlice.js";
import generateInvoice from "../utils/generateInvoice.js";

function Cart() {
  const items = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [selectedClient, setSelectedClient] = useState("");

  const total = items.reduce((acc, item) => {
    const price = typeof item.Price === "number" ? item.Price : 0;
    return acc + price * item.quantity;
  }, 0);

  const handlePlaceOrder = async () => {
    if (!user) return alert("You must be logged in to place an order.");
    if (items.length === 0) return alert("Your cart is empty.");
    if (user.role === "agent" && !selectedClient) {
      return alert("Please select a client.");
    }

    const orderFor = user.role === "agent" ? selectedClient : user.username;

    await generateInvoice({
      order: {
        user: orderFor,
        placedBy: user.username,
        items,
        date: new Date().toISOString(),
        total,
      },
      user,
    });

    dispatch(placeOrder({ user: orderFor, placedBy: user.displayName, items }));
    dispatch(clearCart());
    alert(`Order placed for ${orderFor}`);
  };

  if (!user || user.role === "admin") {
    return (
      <div className="bg-dark text-white p-6 text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Unauthorized</h2>
        <p className="text-gray-400">Admins do not have access to the cart.</p>
      </div>
    );
  }

  return (
    <div className="bg-dark text-white p-6 max-w-4xl mx-auto min-h-screen">
      <h2 className="text-3xl font-bold text-primary mb-6">Your Cart</h2>

      {user.role === "agent" && user.clients?.length > 0 && (
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-300">
            Order for Client:
          </label>
          <select
            className="border border-gray-700 bg-gray-900 text-white p-2 rounded w-full"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="">-- Select Client --</option>
            {user.clients.map((client) => (
              <option key={client} value={client}>
                {client}
              </option>
            ))}
          </select>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {items.map((item) => {
            const price = typeof item.Price === "number" ? item.Price : 0;
            return (
              <div
                key={item.ID}
                className="flex justify-between items-center border-b border-gray-700 pb-3"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.Image}
                    alt={item.Name}
                    className="w-14 h-14 object-cover rounded shadow"
                  />
                  <div>
                    <p className="font-semibold text-white">{item.Name}</p>
                    <p className="text-sm text-gray-400">₹{price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const qty = Math.max(1, parseInt(e.target.value) || 1);
                      dispatch(updateQuantity({ id: item.ID, quantity: qty }));
                    }}
                    className="w-16 p-1 bg-gray-900 text-white border border-gray-700 rounded text-center"
                  />
                  <p className="w-24 text-right font-semibold text-primary">
                    ₹{(price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => dispatch(removeFromCart(item.ID))}
                    className="text-red-500 font-bold text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-6 mt-6 border-t border-gray-800 text-right">
            <p className="text-xl font-bold text-white">
              Total: <span className="text-primary">₹{total.toFixed(2)}</span>
            </p>

            <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={handlePlaceOrder}
                className="bg-primary text-black px-5 py-2 rounded font-semibold hover:bg-yellow-400 transition"
              >
                Place Order
              </button>
              <button
                onClick={() => dispatch(clearCart())}
                className="bg-gray-700 text-white px-5 py-2 rounded hover:bg-gray-600 transition"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
