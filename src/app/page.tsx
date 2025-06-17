"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = { username, password };
    const whichApi = isLogin ? "/api/login" : "/api/signup";

    try {
      const res = await fetch(whichApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = { error: "Something went wrong" };
      }

      if (!res.ok) {
        if (!isLogin && data.error === "User already exists") {
          toast.error("User already exists. Please log in instead.");
        } else {
          toast.error(data.error || "Something went wrong");
          setError(data.error || "Something went wrong");
        }
        return;
      }

      if (!isLogin && res.status === 201) {
        toast.success("Signup successful! Please log in.");
        setIsLogin(true);
        return;
      }

      if (isLogin) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", data.user.username);
        toast.success("Login successful!");
        window.location.href = "/";
      } else {
        setIsLogin(true);
        l;
      }

      console.log(data);
    } catch (err) {
      console.error("API error:", err);
      toast.error("Something went wrong. Please try again.");
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-teal-800 text-center">
          {isLogin ? "Login" : "Sign Up"}
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
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded transition duration-200"
          type="submit"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p className="text-center mt-4 text-sm">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-teal-700 underline ml-1"
          >
            {isLogin ? "Sign up" : "Login"} instead
          </button>
        </p>
      </form>
    </div>
  );
}
