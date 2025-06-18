import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  clearCart,
  updateQuantity,
  updateDiscount,
} from "../features/cart/cartSlice.js";
import { placeOrder } from "../features/order/orderSlice.js";
import generateInvoice from "../utils/generateInvoice.js";

function Cart() {
  const items = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [selectedClient, setSelectedClient] = useState("");
  const [agentNote, setAgentNote] = useState("");

  const totalOriginal = items.reduce(
    (acc, item) => acc + (item.Price || 0) * item.quantity,
    0
  );

  const totalDiscounted = items.reduce(
    (acc, item) =>
      acc +
      (item.discountedPrice !== undefined ? item.discountedPrice : item.Price || 0) *
        item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!user) return alert("You must be logged in to place an order.");
    if (items.length === 0) return alert("Your cart is empty.");
    if (user.role === "agent" && !selectedClient)
      return alert("Please select a client.");

    const orderFor = user.role === "agent" ? selectedClient : user.username;

    await generateInvoice({
      order: {
        user: orderFor,
        placedBy: user.username,
        items,
        note: agentNote,
        date: new Date().toISOString(),
        totalOriginal,
        totalDiscounted,
      },
      user,
    });

    dispatch(placeOrder({ user: orderFor, placedBy: user.displayName, items, note: agentNote, totalOriginal, totalDiscounted }));
    dispatch(clearCart());
    alert(`Order placed for ${orderFor}`);
  };

  if (!user || user.role === "admin") {
    return (
      <div className="p-6 text-center bg-black min-h-screen text-primary">
        <h2 className="text-2xl font-bold mb-2">Unauthorized</h2>
        <p className="text-gray-400">Admins do not have access to the cart.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-black min-h-screen text-primary">
      <h2 className="text-3xl font-bold mb-6 text-primary">Your Cart</h2>

      {/* Agent: Select Client */}
      {user.role === "agent" && user.clients?.length > 0 && (
        <div className="mb-6">
          <label className="block mb-1 font-semibold">Order for Client:</label>
          <select
            className="w-full p-2 border bg-black text-primary rounded"
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

      {/* Cart Items */}
      {items.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {items.map((item) => {
            const price = typeof item.Price === "number" ? item.Price : 0;
            const discounted = item.discountedPrice ?? price;

            return (
              <div
                key={item.ID}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-700 pb-4 gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.Name}
                    className="w-14 h-14 object-cover rounded border"
                  />
                  <div>
                    <p className="font-semibold text-primary">{item.Name}</p>
                    <p className="text-sm text-gray-500">Price: ₹{price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                  <input
                    type="number"
                   value={item.quantity === 0 ? "" : item.quantity}
onChange={(e) => {
  const val = e.target.value;
  if (val === "") {
    dispatch(updateQuantity({ id: item.ID, quantity: 0 }));
  } else if (/^\d+$/.test(val)) {
    dispatch(updateQuantity({ id: item.ID, quantity: parseInt(val) }));
  }
}}
                    className="w-20 p-1 border border-yellow-400 rounded text-center text-black"
                  />

                  {user.role === "agent" && (
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={
                        item.discountedPrice !== undefined
                          ? item.discountedPrice
                          : ""
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        dispatch(
                          updateDiscount({
                            id: item.ID,
                            discountedPrice:
                              val === "" ? undefined : parseFloat(val),
                          })
                        );
                      }}
                      className="w-28 p-1 border border-yellow-400 rounded text-center text-black"
                      placeholder="Discounted Price"
                    />
                  )}

                  <div className="text-right w-32 text-sm">
                    <p className="font-semibold text-primary">
                      ₹{(discounted * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => dispatch(removeFromCart(item.ID))}
                    className="text-red-400 text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          {/* Agent Note */}
          {user.role === "agent" && (
            <div className="mt-4">
              <label className="block font-medium mb-1">Agent Note:</label>
              <textarea
                value={agentNote}
                onChange={(e) => setAgentNote(e.target.value)}
                placeholder="Enter any client-specific note..."
                className="w-full border border-yellow-400 p-2 rounded text-black"
                rows={3}
              />
            </div>
          )}

          {/* Totals & Actions */}
          <div className="pt-4 mt-6 border-t border-gray-600 text-right space-y-2">
            {user.role === "agent" && (
              <p className="text-md font-semibold text-primary">
                Original Total: ₹{totalOriginal.toFixed(2)}
              </p>
            )}
            <p className="text-xl font-bold text-primary">
              Final Total: ₹{totalDiscounted.toFixed(2)}
            </p>

            <div className="mt-4 flex flex-col sm:flex-row justify-end gap-4">
              <button
                onClick={handlePlaceOrder}
                className="bg-primary text-black font-semibold px-4 py-2 rounded hover:opacity-90"
              >
                Place Order
              </button>
              <button
                onClick={() => dispatch(clearCart())}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
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
