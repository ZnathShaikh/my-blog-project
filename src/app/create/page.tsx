"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components /Navbar";
import { getLoggedInUser } from "../utils/storage";
import "react-quill-new/dist/quill.snow.css";
import dynamic from "next/dynamic";

// SSR disabled for ReactQuill (needed for Next.js)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const user = getLoggedInUser(); // ✅ Get from localStorage
    if (user) {
      setUserId(user.id);
    } else {
      alert("You must be logged in to create a blog.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("User not logged in.");
      return;
    }

    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, userId }),
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

          <ReactQuill value={content} onChange={setContent} theme="snow" />

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
