"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Blog = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export default function HomePage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(data.blogs);
    };
    fetchBlogs();
  });

  return (
    <div>
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50">
        {/* ////TODO: ADD HOVER ANIMATION & REDIRECT  ///// */}
        <h1 className="text-xl font-bold text-teal-600">My Blog Web</h1>
        <div className="space-x-4">
          <Link href="/" className="text-teal-700 hover:underline">
            Home
          </Link>
          <Link href="/create" className="text-teal-700 hover:underline">
            Create
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center bg-teal-100 text-center px-4">
        <h2 className="text-4xl font-bold text-teal-800 mb-4">My Blog Web</h2>
        <p className="text-lg text-gray-700 mb-6">
          Your Digital Diary — Capture Your Thoughts.
        </p>
        <Link href="/create">
          <button className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition">
            + Create a Blog
          </button>
        </Link>
      </section>

      {/* Blog List Section */}
      <section className="p-6 bg-gray-50 min-h-screen">
        <h3 className="text-2xl font-bold text-teal-700 mb-6 text-center">
          Recent Blogs
        </h3>
        {blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs available.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div key={blog.id} className="p-4 bg-white rounded-lg shadow">
                <h4 className="text-lg font-bold text-teal-600">
                  {blog.title}
                </h4>
                <p className="text-sm text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
