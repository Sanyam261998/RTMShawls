import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import fullLogo from "../assets/Full.jpg"

function Login() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(login({ username, password }));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-dark text-white px-4">
      <div className="w-full max-w-md bg-[#1a1a1a] p-6 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <img
            src={fullLogo}
            alt="RTM Shawls"
            className="h-20 mx-auto mb-2"
          />
          <h1 className="text-2xl font-elegant tracking-wide text-primary">
            Login to RTM Shawls
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => setRole("client")}
              className={`px-4 py-1 border rounded-full ${
                role === "client"
                  ? "bg-primary text-black font-semibold"
                  : "bg-transparent border-gray-500 text-white"
              }`}
            >
              Client
            </button>
            <button
              type="button"
              onClick={() => setRole("agent")}
              className={`px-4 py-1 border rounded-full ${
                role === "agent"
                  ? "bg-primary text-black font-semibold"
                  : "bg-transparent border-gray-500 text-white"
              }`}
            >
              Agent
            </button>
          </div>

          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 bg-[#111] border border-gray-600 rounded outline-none focus:ring-2 focus:ring-primary"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 bg-[#111] border border-gray-600 rounded outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-primary text-black font-semibold py-2 rounded hover:bg-accent transition"
          >
            {status === "loading" ? "Logging in..." : `Login as ${role}`}
          </button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;