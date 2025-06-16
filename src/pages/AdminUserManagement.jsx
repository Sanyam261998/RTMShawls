import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function AdminUserManagement() {
  const user = useSelector((state) => state.auth.user);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    role: "client",
    displayName: "",
    phone: "",
    agent: "",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3001/users");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAllUsers(data);
    } catch (err) {
      setError("Failed to load users.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchUsers();
  }, [user]);

  const handleRemove = async (username) => {
    const confirm = window.confirm(`Are you sure you want to delete ${username}?`);
    if (!confirm) return;

    try {
      const res = await fetch("http://localhost:3001/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const result = await res.json();
      if (result.success) {
        fetchUsers();
      } else {
        alert("Failed to remove user");
      }
    } catch (err) {
      console.error(err);
      alert("Error removing user.");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        action: "addUser",
        role: form.role,
        displayName: form.displayName.trim(),
        phone: form.phone.trim(),
        agent: form.role === "client" ? form.agent.trim() : "",
      };

      const res = await fetch("http://localhost:3001/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        alert("User added successfully");
        setForm({ role: "client", displayName: "", phone: "", agent: "" });
        fetchUsers();
      } else {
        alert(result.error || "Failed to add user");
      }
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Server error.");
    }
  };

  if (!user || user.role !== "admin") {
    return <p className="p-4 text-red-500">Unauthorized</p>;
  }

  const agents = allUsers.filter((u) => u.Role === "agent");
  const clients = allUsers.filter((u) => u.Role === "client");

  return (
    <div className="p-6 max-w-6xl mx-auto text-white bg-dark min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-primary">User Management</h2>

      {/* Add New User Form */}
      <form
        onSubmit={handleAddUser}
        className="mb-10 space-y-4 bg-gray-900 border border-gray-800 p-6 rounded"
      >
        <h3 className="text-xl font-semibold text-primary">Add New User</h3>

        <select
          className="bg-gray-800 text-white border border-gray-700 p-2 w-full rounded"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="client">Client</option>
          <option value="agent">Agent</option>
        </select>

        <input
          type="text"
          placeholder="Display Name"
          className="bg-gray-800 text-white border border-gray-700 p-2 w-full rounded"
          value={form.displayName}
          onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="bg-gray-800 text-white border border-gray-700 p-2 w-full rounded"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />

        {form.role === "client" && (
          <input
            type="text"
            placeholder="Agent Name (case-sensitive)"
            className="bg-gray-800 text-white border border-gray-700 p-2 w-full rounded"
            value={form.agent}
            onChange={(e) => setForm({ ...form, agent: e.target.value })}
            required
          />
        )}

        <button
          className="bg-primary text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400"
          type="submit"
        >
          Add User
        </button>
      </form>

      {/* Agents Table */}
      <h3 className="text-2xl font-semibold mb-3 text-primary">Agents</h3>
      <div className="overflow-x-auto mb-10">
        <table className="w-full border-collapse border border-gray-700 text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="border border-gray-700 p-2">Display Name</th>
              <th className="border border-gray-700 p-2">Username</th>
              <th className="border border-gray-700 p-2">Phone</th>
              <th className="border border-gray-700 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, i) => (
              <tr key={i} className="hover:bg-gray-800">
                <td className="border border-gray-700 p-2">{agent.DisplayName}</td>
                <td className="border border-gray-700 p-2">{agent.Username}</td>
                <td className="border border-gray-700 p-2">{agent.PhoneNumber}</td>
                <td className="border border-gray-700 p-2">
                  <button
                    className="text-red-400 hover:text-red-300 text-xs font-bold"
                    onClick={() => handleRemove(agent.Username)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Clients Table */}
      <h3 className="text-2xl font-semibold mb-3 text-primary">Clients</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700 text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="border border-gray-700 p-2">Display Name</th>
              <th className="border border-gray-700 p-2">Username</th>
              <th className="border border-gray-700 p-2">Phone</th>
              <th className="border border-gray-700 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, i) => (
              <tr key={i} className="hover:bg-gray-800">
                <td className="border border-gray-700 p-2">{client.DisplayName}</td>
                <td className="border border-gray-700 p-2">{client.Username}</td>
                <td className="border border-gray-700 p-2">{client.PhoneNumber}</td>
                <td className="border border-gray-700 p-2">
                  <button
                    className="text-red-400 hover:text-red-300 text-xs font-bold"
                    onClick={() => handleRemove(client.Username)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUserManagement;
