"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components /Navbar";
import { getLoggedInUser } from "@/app/utils/storage";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "react-hot-toast";

// ✅ Dynamically import ReactQuill
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface Props {
  params: { id: string };
}

export default function EditBlogPage({ params }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ✅ Fetch existing blog content
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${params.id}`);
        const blog = await res.json();
        setTitle(blog.title);
        setContent(blog.content);
      } catch (err) {
        console.error("Failed to fetch blog", err);
      }
    };
    fetchBlog();
  }, [params.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const user = getLoggedInUser();

    const res = await fetch(`/api/blogs/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        userId: user?.id,
      }),
    });

    if (res.ok) {
      toast.success("✅ Blog updated!"); // ✅ 2. Toast on success
      router.replace(`/blog/${params.id}`);
    } else {
      toast.error("❌ Failed to update blog.");
    }
  };

  return (
    <div className="min-h-screen bg-teal-50">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6 mt-12">
        <h1 className="text-3xl font-bold mb-6 text-center text-teal-700">
          Edit Blog
        </h1>

        <form
          className="space-y-4 bg-white p-6 rounded-lg shadow-md"
          onSubmit={handleUpdate}
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
            Update Blog
          </button>
        </form>
      </div>
    </div>
  );
}
