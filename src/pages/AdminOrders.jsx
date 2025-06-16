import React from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

function AdminOrders() {
  const orders = useSelector((state) => state.order.orders);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  const exportAllOrders = () => {
    const flatData = orders.flatMap((order) =>
      order.items.map((item) => ({
        Client: order.user,
        PlacedBy: order.placedBy || order.user,
        Date: new Date(order.date).toLocaleString(),
        Product: item.Name,
        Quantity: item.quantity,
        Subtotal: (item.Price * item.quantity).toFixed(2),
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Order History");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, "OrderHistory.xlsx");
  };

  return (
    <div className="bg-dark text-white min-h-screen p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-primary">All Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-400">No orders have been placed yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={index}
              className="border border-gray-700 rounded-lg p-4 shadow-md bg-gray-900"
            >
              <div className="mb-3 text-sm text-gray-400">
                <strong>Client:</strong> {order.user}{" "}
                {order.placedBy && order.placedBy !== order.user && (
                  <>| <strong>Placed By:</strong> {order.placedBy}</>
                )}
                {" | "}
                <strong>Date:</strong>{" "}
                {new Date(order.date).toLocaleString()}
              </div>

              <div className="text-sm text-gray-200">
                <div className="grid grid-cols-3 font-semibold text-xs uppercase border-b border-gray-700 pb-1 mb-2 text-gray-500">
                  <div>Product</div>
                  <div className="text-center">Qty</div>
                  <div className="text-right">Subtotal</div>
                </div>
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-3 text-sm py-1 border-b border-gray-800"
                  >
                    <div className="truncate">{item.Name}</div>
                    <div className="text-center">x{item.quantity}</div>
                    <div className="text-right text-primary font-semibold">
                      ₹{(item.Price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <button
              onClick={exportAllOrders}
              className="mt-4 bg-primary text-black px-5 py-2 rounded font-semibold hover:bg-yellow-400 transition-all"
            >
              Export All Orders
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
