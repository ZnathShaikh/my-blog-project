import { notFound } from "next/navigation";

interface BlogPageProps {
  params: {
    id: string;
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${params.id}`
  );

  if (!res.ok) return notFound();

  const blog = await res.json();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded">
        <h1 className="text-3xl font-bold text-teal-700 mb-4">{blog.title}</h1>
        <p className="text-sm text-gray-500 italic mb-2">
          By {blog.author?.username || "Unknown"} on{" "}
          {new Date(blog.createdAt).toLocaleDateString()}
        </p>
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
}
