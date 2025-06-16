import React from "react";
import { useSelector } from "react-redux";

function ClientOrders() {
  const orders = useSelector((state) => state.order.orders);
  const user = useSelector((state) => state.auth.user);

  const clientOrders = orders.filter((order) => order.orderedFor === user.username);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {clientOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {clientOrders.map((order, index) => (
            <div key={index} className="border p-4 shadow rounded">
              <div className="text-sm text-gray-500 mb-2">
                <strong>Order Date:</strong>{" "}
                {new Date(order.timestamp).toLocaleString()}
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between border-b py-1">
                  <span>{item.name}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>₹{(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientOrders;
