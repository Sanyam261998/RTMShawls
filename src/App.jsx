import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import AdminOrders from "./pages/AdminOrders";
import AdminUserManagement from "./pages/AdminUserManagement";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    // Not logged in: force login screen ONLY
    return <Login />;
  }

  // Logged in: show full app
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
           <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/users" element={<AdminUserManagement />} />
      </Routes>
    </>
  );
}

export default App;

