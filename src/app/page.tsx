"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components /Navbar";
// ❌ Removed localStorage import (not used anymore)
// import { getLoggedInUser } from "./utils/storage";
import toast from "react-hot-toast";
import DeleteButton from "@/components/DeleteButton";
import { useAuthRedirect } from "./utils/Auth";
// ❌ Removed clearLoggedInUser (we'll call API logout now)
// import { clearLoggedInUser } from "./utils/storage";

interface Blog {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: number;
    username: string;
  };
}

export default function HomePage() {
  useAuthRedirect();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [user, setUser] = useState<any>(null); // ✅ added user state
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndBlogs = async () => {
      try {
        // ✅ Get logged-in user from API (not localStorage)
        const userRes = await fetch("/api/me", {
          credentials: "include", // ✅ send cookie
        });

        if (!userRes.ok) {
          console.warn("User not logged in, cannot fetch blogs.");
          return;
        }

        const userData = await userRes.json();
        setUser(userData.user); // ✅ set user

        // ✅ Fetch blogs (secured by server token)
        const blogsRes = await fetch("/api/blogs", {
          credentials: "include", // ✅ send cookie
        });

        const blogData = await blogsRes.json();
        setBlogs(blogData.blogs);
      } catch (err) {
        console.error("Failed to load blogs", err);
      }
    };

    fetchUserAndBlogs();
  }, []);

  const handleDelete = async (blogId: number) => {
    try {
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: "DELETE",
        credentials: "include", // ✅ send cookie for secure delete
      });

      if (res.ok) {
        setBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
        toast.success("Blog deleted!");
      } else {
        toast.error("Failed to delete blog.");
      }
    } catch (err) {
      toast.error("Error deleting blog.");
    }
  };

  const handleLogout = async () => {
    // ✅ Call server to clear token cookie
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      toast.success("Logged out!");
      router.replace("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <div>
      <Navbar onLogout={handleLogout} />{" "}
      {/* ✅ pass logout handler if needed */}
      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center bg-teal-100 text-center px-4">
        <h2 className="text-4xl font-bold text-teal-800 mb-4">My Blog Web</h2>
        <p className="text-lg text-gray-700 mb-6">
          Your Digital Diary — Capture Your Thoughts.
        </p>
        <Link
          href="/create"
          className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition"
        >
          + Create a Blog
        </Link>
      </section>
      {/* Blog List Section */}
      <section className="p-6 bg-gray-50 min-h-screen">
        <h3 className="text-2xl font-bold text-teal-700 mb-6 text-center">
          Your Blogs
        </h3>

        {blogs.length === 0 ? (
          <p className="text-center text-gray-500">
            You haven’t written any blogs yet.
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                onClick={() => router.push(`/blog/${blog.id}`)}
                className="relative p-4 bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition"
              >
                <h4 className="text-lg font-bold text-teal-600">
                  {blog.title}
                </h4>
                <p className="text-sm text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 italic">
                  By {blog.author?.username || "Unknown"}
                </p>

                {user?.id === blog.author?.id && (
                  <div
                    className="absolute top-2 right-2 flex gap-2"
                    onClick={(e) => e.stopPropagation()} // ✅ prevent parent click
                  >
                    {/* ✏️ Edit */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        router.push(`/blog/${blog.id}/edit`);
                      }}
                      className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center text-xs shadow hover:bg-gray-100"
                      title="Edit blog"
                    >
                      ✏️
                    </button>

                    {/* 🗑️ Delete */}
                    <DeleteButton
                      onConfirm={() => handleDelete(blog.id)}
                      message={`Are you sure you want to delete "${blog.title}"?`}
                      label="🗑️"
                      className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center text-xs shadow hover:bg-red-100"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
