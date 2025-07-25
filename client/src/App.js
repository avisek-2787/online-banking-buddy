// App.jsx with login, logout, and dashboard
import React, { useState, useEffect } from "react";
import ChatBox from "./ChatBox";
import "./index.css";

export default function App() {
    const [balance, setBalance] = useState(52430.75);
    const [transactions, setTransactions] = useState([
      { amount: -1500, label: "Amazon", date: "2025-07-21" },
      { amount: 2200, label: "UPI", date: "2025-07-20" },
      { amount: -300, label: "ATM Withdrawal", date: "2025-07-19" },
    ]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState([]);
  useEffect(() => {
    document.title = isLoggedIn ? `Dashboard - My Banking Assistant` : `Login - My Banking Assistant`;

    fetch('http://localhost:5000/api/user')
      .then(res => res.json())
      .then(setUser);
  }, [isLoggedIn, user]);

  const handleLogin = () => {
    if (username === "admin" && password === "1234") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials. Try 'admin' / '1234'");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">🔐 Login</h2>
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 px-4 py-2 border rounded-xl"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 px-4 py-2 border rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-xl"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold logo-color">🏦 My Net Banking Buddy</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-xl shadow hover:bg-red-600"
        >
          Logout
        </button>
      </div>

        <div className="bg-gradient-to-r to-indigo-600 text-white rounded-2xl shadow-md p-4 mb-4 animate-fade-in">
          <h2 className="text-xl font-semibold">👋 {user.welcomeMessage}</h2>
          
        </div>


      <ChatBox
      />
    </div>
  );
}
