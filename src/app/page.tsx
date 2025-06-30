"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components /Navbar";
import { getLoggedInUser } from "./utils/storage";

export default function HomePage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      // ✅ STEP 1: Get logged-in user
      const user = getLoggedInUser();

      // ✅ STEP 2: Stop if not logged in
      if (!user?.id) {
        console.warn("User not logged in, cannot fetch blogs.");
        return;
      }

      try {
        // ✅ STEP 3: Fetch only blogs for this user
        const res = await fetch(`/api/blogs?userId=${user.id}`);
        const data = await res.json();
        setBlogs(data.blogs);
      } catch (err) {
        console.error("Failed to load blogs", err);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div>
      <Navbar />

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

        {/* ✅ Updated No Blogs Message */}
        {blogs.length === 0 ? (
          <p className="text-center text-gray-500">
            You haven’t written any blogs yet.
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Link href={`/blog/${blog.id}`} key={blog.id}>
                <div key={blog.id} className="p-4 bg-white rounded-lg shadow">
                  <h4 className="text-lg font-bold text-teal-600">
                    {blog.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    By {blog.author?.username || "Unknown"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
