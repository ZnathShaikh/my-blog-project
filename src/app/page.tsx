"use client";

import { useState } from "react";

export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { username, password }; /// NAMING CONVENTION TO SEND DATA - PAYLOAD/////
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const datareceived = await res.json();

    console.log(datareceived);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-teal-800 text-center">
          Sign Up OR Login
        </h2>
        <input
          className="w-full p-2 border rounded mb-4"
          type="text"
          name="username"
          placeholder="Please enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded mb-4"
          type="password"
          name="password"
          placeholder="Please enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-teal-400 text-white py-2 rounded"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
