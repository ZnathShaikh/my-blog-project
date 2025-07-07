"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // ✅ NEW: fetch user from JWT cookie session
        const res = await fetch("/api/me", {
          credentials: "include", // ✅ IMPORTANT: allows sending cookies
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user); // ✅ set user data from cookie
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("User fetch failed", err);
        setUser(null); // fallback
      }
    };

    fetchUser(); // ✅ call on component mount
  }, []);

  const handleLogout = async () => {
    try {
      // ✅ NEW: call logout endpoint to clear JWT cookie
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // ✅ ensure cookie is sent
      });

      if (res.ok) {
        toast.success("Logged out!");
        router.replace("/auth"); // or "/auth"
      } else {
        toast.error("Logout failed");
      }
    } catch (err) {
      toast.error("Logout error");
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50">
      <h1 className="text-xl font-bold text-teal-600">My Blog Web</h1>

      <div className="space-x-6 flex items-center">
        <Link href="/" className="text-teal-700 hover:underline font-medium">
          Home
        </Link>
        <Link
          href="/create"
          className="text-teal-700 hover:underline font-medium"
        >
          Create
        </Link>

        {/* ✅ CONDITIONAL RENDERING BASED ON JWT COOKIE SESSION */}
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-teal-600 text-white px-4 py-1 rounded hover:bg-teal-700 transition"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login" // or "/auth" if you have a combined page
            className="bg-teal-600 text-white px-4 py-1 rounded hover:bg-teal-700 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
