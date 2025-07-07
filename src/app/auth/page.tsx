"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRedirectIfLoggedIn } from "../utils/Auth";

export default function AuthPage() {
  useRedirectIfLoggedIn();

  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ required to send/receive cookie
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || "Login failed");
        return;
      }

      // ✅ Removed: localStorage user setting
      // ❌ const data = await res.json();
      // ❌ setLoggedInUser({ id: data.user.id, name: data.user.username });

      toast.success("Login successful!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || "Signup failed");
        return;
      }

      toast.success("Signup successful!");
      setIsLogin(true); // ✅ switch to login form after signup
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-200">
      <form
        onSubmit={isLogin ? handleLogin : handleSignup}
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
          required
        />
        <input
          className="w-full p-2 border rounded mb-4"
          type="password"
          name="password"
          placeholder="Please enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
