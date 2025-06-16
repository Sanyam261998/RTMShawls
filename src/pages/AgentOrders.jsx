import React from "react";
import { useSelector } from "react-redux";

function AgentOrders() {
  const orders = useSelector((state) => state.order.orders);
  const user = useSelector((state) => state.auth.user);

  const agentOrders = orders.filter((order) => order.placedBy === user.username);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Orders Placed by You</h2>
      {agentOrders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <div className="space-y-4">
          {agentOrders.map((order, index) => (
            <div key={index} className="border p-4 shadow rounded">
              <div className="text-sm text-gray-500 mb-2">
                <strong>Client:</strong> {order.orderedFor} |{" "}
                <strong>Date:</strong> {new Date(order.timestamp).toLocaleString()}
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between border-b py-1">
                  <span>{item.name}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AgentOrders;
