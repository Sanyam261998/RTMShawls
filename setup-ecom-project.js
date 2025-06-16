const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Helper to escape ${} for JSX strings
const jsx = (str) => str.replace(/\$\{/g, "\\${");

// Base structure for root files
const baseFiles = {
  "package.json": `{
  "name": "darkshop",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.2",
    "react-router-dom": "^6.15.0",
    "xlsx": "^0.18.5",
    "file-saver": "^2.0.5"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.3.2",
    "vite": "^5.0.10"
  }
}`,

  "index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DarkShop</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>`,

  "postcss.config.js": `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,

  "tailwind.config.js": `module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};`
};

// Write base files
for (const [file, content] of Object.entries(baseFiles)) {
  fs.writeFileSync(file, content);
}

console.log("✅ Base files created (package.json, index.html, tailwind/postcss config)");

const srcStructure = {
  src: {
    'index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`,

    'index.jsx': jsx(`import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);`),

    'App.jsx': jsx(`import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;`),

    components: {
      'Navbar.jsx': jsx(`import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice.js";

function Navbar() {
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <div className="text-lg font-bold">DarkShop</div>
      <div className="flex gap-4 items-center">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart (\${cartItems.length})</Link>
        {user ? (
          <>
            <span>Welcome, \${user.username}</span>
            <button
              onClick={() => dispatch(logout())}
              className="bg-red-600 px-2 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;`),

      'ProductCard.jsx': jsx(`import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice.js";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
  };

  return (
    <div className="bg-white shadow rounded p-4 flex flex-col">
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-2" />
      <h2 className="font-bold text-lg">{product.name}</h2>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="mb-2 font-semibold">\${product.price}</p>

      <div className="flex items-center gap-2 mb-2">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-16 border text-center p-1 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;`)
    },

    pages: {}, // Will be added in Part 3
    features: {}, // Will be added in Part 4
    app: {}, // Will be added in Part 4
    data: {} // Will be added in Part 3
  }
};

// Recursive writer
const writeStructure = (base, tree) => {
  for (const name in tree) {
    const target = path.join(base, name);
    if (typeof tree[name] === "string") {
      fs.writeFileSync(target, tree[name]);
    } else {
      fs.mkdirSync(target, { recursive: true });
      writeStructure(target, tree[name]);
    }
  }
};

writeStructure(".", srcStructure);
console.log("✅ Part 2 complete: /src base structure, Navbar, ProductCard, App");

// Add pages
Object.assign(srcStructure.src.pages = {
  'Login.jsx': jsx(`import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice.js";
import { useNavigate } from "react-router-dom";

const DEFAULT_USERS = [
  { username: "admin", password: "admin123" },
  { username: "client", password: "client123" },
];

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = DEFAULT_USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      dispatch(login({ username }));
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="border p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;`),

  'Home.jsx': jsx(`import React from "react";
import products from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";

function Home() {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default Home;`),

  'Cart.jsx': jsx(`import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart, updateQuantity } from "../features/cart/cartSlice.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Cart() {
  const items = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const exportToExcel = () => {
    if (!user || user.username !== "admin") {
      alert("Only admin can export orders.");
      return;
    }

    const data = items.map((item) => ({
      Product: item.name,
      Price: item.price,
      Quantity: item.quantity,
      Subtotal: (item.price * item.quantity).toFixed(2),
    }));

    data.push({
      Product: "TOTAL",
      Price: "",
      Quantity: "",
      Subtotal: total.toFixed(2),
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Order");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Order.xlsx");
  };

  const handleQuantityChange = (id, qty) => {
    const quantity = Math.max(1, parseInt(qty) || 1);
    dispatch(updateQuantity({ id, quantity }));
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">\${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  className="w-16 p-1 border rounded text-center"
                />
                <p className="w-24 text-right">\${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="text-red-600 font-bold text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="pt-4 mt-4 border-t text-right">
            <p className="text-xl font-bold">Total: \${total.toFixed(2)}</p>
            <div className="mt-2 flex justify-end gap-3">
              <button
                onClick={() => dispatch(clearCart())}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Clear Cart
              </button>
              {user?.username === "admin" && (
                <button
                  onClick={exportToExcel}
                  className="bg-green-700 text-white px-4 py-2 rounded"
                >
                  Export to Excel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;`)
});

// Add product data
Object.assign(srcStructure.src.data = {
  'products.js': `const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 149.99,
    description: "High-quality noise-cancelling over-ear headphones.",
    image: "https://via.placeholder.com/150"
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    price: 89.99,
    description: "RGB backlit mechanical keyboard with tactile switches.",
    image: "https://via.placeholder.com/150"
  },
  {
    id: 3,
    name: "4K UHD Monitor",
    price: 399.99,
    description: "27-inch ultra HD monitor for productivity and gaming.",
    image: "https://via.placeholder.com/150"
  }
];

export default products;`
});

// Now write everything to disk
writeStructure(".", srcStructure);
console.log("✅ Pages (Login, Cart, Home) and product data generated.");

// Add pages
Object.assign(srcStructure.src.pages = {
  'Login.jsx': jsx(`import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice.js";
import { useNavigate } from "react-router-dom";

const DEFAULT_USERS = [
  { username: "admin", password: "admin123" },
  { username: "client", password: "client123" },
];

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = DEFAULT_USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      dispatch(login({ username }));
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="border p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;`),

  'Home.jsx': jsx(`import React from "react";
import products from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";

function Home() {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default Home;`),

  'Cart.jsx': jsx(`import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart, updateQuantity } from "../features/cart/cartSlice.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Cart() {
  const items = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const exportToExcel = () => {
    if (!user || user.username !== "admin") {
      alert("Only admin can export orders.");
      return;
    }

    const data = items.map((item) => ({
      Product: item.name,
      Price: item.price,
      Quantity: item.quantity,
      Subtotal: (item.price * item.quantity).toFixed(2),
    }));

    data.push({
      Product: "TOTAL",
      Price: "",
      Quantity: "",
      Subtotal: total.toFixed(2),
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Order");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Order.xlsx");
  };

  const handleQuantityChange = (id, qty) => {
    const quantity = Math.max(1, parseInt(qty) || 1);
    dispatch(updateQuantity({ id, quantity }));
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">\${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  className="w-16 p-1 border rounded text-center"
                />
                <p className="w-24 text-right">\${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="text-red-600 font-bold text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="pt-4 mt-4 border-t text-right">
            <p className="text-xl font-bold">Total: \${total.toFixed(2)}</p>
            <div className="mt-2 flex justify-end gap-3">
              <button
                onClick={() => dispatch(clearCart())}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Clear Cart
              </button>
              {user?.username === "admin" && (
                <button
                  onClick={exportToExcel}
                  className="bg-green-700 text-white px-4 py-2 rounded"
                >
                  Export to Excel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;`)
});

// Add product data
Object.assign(srcStructure.src.data = {
  'products.js': `const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 149.99,
    description: "High-quality noise-cancelling over-ear headphones.",
    image: "https://via.placeholder.com/150"
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    price: 89.99,
    description: "RGB backlit mechanical keyboard with tactile switches.",
    image: "https://via.placeholder.com/150"
  },
  {
    id: 3,
    name: "4K UHD Monitor",
    price: 399.99,
    description: "27-inch ultra HD monitor for productivity and gaming.",
    image: "https://via.placeholder.com/150"
  }
];

export default products;`
});

// Now write everything to disk
writeStructure(".", srcStructure);
console.log("✅ Pages (Login, Cart, Home) and product data generated.");

// Redux Feature: Cart
Object.assign(srcStructure.src.features = {
  cart: {
    'cartSlice.js': `import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: JSON.parse(localStorage.getItem("cart")) || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;`
  },

  auth: {
    'authSlice.js': `import { createSlice } from "@reduxjs/toolkit";

const userFromStorage = JSON.parse(localStorage.getItem("user"));

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage || null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;`
  }
});

// Store config
Object.assign(srcStructure.src.app = {
  'store.js': `import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice.js";
import authReducer from "../features/auth/authSlice.js";

export default configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
});`
});

// Write Redux features to disk
writeStructure(".", srcStructure);
console.log("✅ Redux slices and store created.");

console.log("📦 Installing dependencies... This may take a moment.\n");

try {
  execSync("npm install", { stdio: "inherit" });
  console.log("\n✅ All dependencies installed.");
  console.log("🚀 Setup complete.");
  console.log("🔓 Admin Login -> username: admin | password: admin123");
  console.log("🧑 Client Login -> username: client | password: client123");
  console.log("\n👉 Run the project:");
  console.log("   npm run dev");
} catch (error) {
  console.error("❌ Dependency installation failed. Run 'npm install' manually.");
  process.exit(1);
}



