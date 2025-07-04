"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLoggedInUser, clearLoggedInUser } from "@/app/utils/storage";
import toast from "react-hot-toast";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loggedInUser = getLoggedInUser();
    setUser(loggedInUser);
  }, []);

  const handleLogout = () => {
    clearLoggedInUser();
    toast.success("Logged out!");
    router.replace("/auth");
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

        {user ? (
          <button
            onClick={handleLogout}
            className="bg-teal-600 text-white px-4 py-1 rounded hover:bg-teal-700 transition"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
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
