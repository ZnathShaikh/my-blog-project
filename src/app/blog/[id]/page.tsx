"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components /Navbar";
import { getLoggedInUser } from "@/app/utils/storage";
import Link from "next/link";

export default function BlogPage() {
  const params = useParams();
  const blogId = params?.id;
  const [blog, setBlog] = useState<any>(null);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    if (!blogId) return;

    const fetchBlog = async () => {
      const res = await fetch(`/api/blogs/${blogId}`);
      if (!res.ok) return;

      const data = await res.json();
      setBlog(data);

      const user = getLoggedInUser();
      if (user?.id === data.author?.id) {
        setIsAuthor(true);
      }
    };

    fetchBlog();
  }, [blogId]);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded mt-10">
        <h1 className="text-3xl font-bold text-teal-700 mb-4">{blog.title}</h1>
        <p className="text-sm text-gray-500 italic mb-2">
          By {blog.author?.username || "Unknown"} on{" "}
          {new Date(blog.createdAt).toLocaleDateString()}
        </p>
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* ✅ Show edit button if user is author */}
        {isAuthor && (
          <div className="mt-6 text-right">
            <Link
              href={`/blog/${blog.id}/edit`}
              className="text-sm bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition"
            >
              ✏️ Edit Blog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
