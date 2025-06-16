import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { setQuery } from "../features/search/searchSlice";
import logo from "../assets/small_logo.png"
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const query = useSelector((state) => state.search.query);

  const [mobileMenu, setMobileMenu] = useState(false);

  const toggleMobileMenu = () => setMobileMenu(!mobileMenu);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    if (location.pathname !== "/") {
      navigate(`/?q=${encodeURIComponent(q)}`);
    } else {
      const url = new URL(window.location);
      url.searchParams.set("q", q);
      window.history.replaceState(null, "", url.toString());
      window.dispatchEvent(new Event("popstate"));
    }

    setMobileMenu(false);
  };

  const quantity =
    user && user.role !== "admin"
      ? cartItems.reduce((acc, item) => acc + item.quantity, 0)
      : 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  

  return (
    <nav className="bg-[#0d0d0d] text-white p-4 sticky top-0 z-50 shadow flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img src={logo} alt="RTM" className="h-8 w-8" />
        <span className="text-lg font-semibold tracking-wide hidden sm:block">
          RTM Shawls
        </span>
      </div>

      {/* Desktop Search Bar */}
      <form onSubmit={handleSearch} className="hidden sm:block w-1/3 mx-4">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          className="w-full p-2 bg-[#1a1a1a] border border-gray-600 rounded text-sm focus:outline-none"
        />
      </form>

      {/* Hamburger */}
      <button
        onClick={toggleMobileMenu}
        className="sm:hidden text-white focus:outline-none"
      >
        {mobileMenu ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Desktop Links */}
      <div className="hidden sm:flex gap-4 items-center">
        <Link to="/">Home</Link>

        {user?.role !== "admin" && (
          <Link to="/cart" className="relative">
            <FaShoppingCart />
            {quantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {quantity}
              </span>
            )}
          </Link>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin/orders">Orders</Link>
            <Link to="/admin/users">Users</Link>
          </>
        )}

        {user ? (
          <>
            <span className="text-sm">Hi, {user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-2 py-1 rounded text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="absolute top-16 left-0 w-full bg-[#0d0d0d] p-4 flex flex-col gap-3 sm:hidden border-t border-gray-800 z-50">
          <form onSubmit={handleSearch} className="mb-2">
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => dispatch(setQuery(e.target.value))}
              className="w-full p-2 bg-[#1a1a1a] border border-gray-600 rounded text-sm focus:outline-none"
            />
          </form>

          <Link to="/" onClick={toggleMobileMenu}>Home</Link>

          {user?.role !== "admin" && user && (
            <Link to="/cart" onClick={toggleMobileMenu} className="flex items-center gap-2">
              <FaShoppingCart />
              <span>Cart ({quantity})</span>
            </Link>
          )}

          {user?.role === "admin" && (
            <>
              <Link to="/admin/orders" onClick={toggleMobileMenu}>Orders</Link>
              <Link to="/admin/users" onClick={toggleMobileMenu}>Users</Link>
            </>
          )}

          {user ? (
            <button
              onClick={() => {
                handleLogout();
                toggleMobileMenu();
              }}
              className="bg-red-600 px-3 py-1 rounded w-full text-left"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={toggleMobileMenu}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;