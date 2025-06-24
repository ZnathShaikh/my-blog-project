"use client";

import { useState } from "react";
import Navbar from "@/components /Navbar";

export default function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: {
        "content-Type": "pplication/json",
      },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      alert("Blog Created!");
      setTitle("");
      setContent("");
    } else {
      alert("Failed to create post");
    }
  };

  return (
    <div className="min-h-screen bg-teal-50">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6 mt-12">
        <h1 className="text-3xl font-bold mb-6 text-center text-teal-700">
          Create a New Blog
        </h1>

        <form
          className="space-y-4 bg-white p-6 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          <textarea
            placeholder="Blog Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full border border-gray-300 p-3 h-48 rounded resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          <button
            type="submit"
            className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition"
          >
            Submit Blog
          </button>
        </form>
      </div>
    </div>
  );
}
