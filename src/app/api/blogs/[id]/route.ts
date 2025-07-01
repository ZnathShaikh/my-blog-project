import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const blogId = Number(params.id);

  if (isNaN(blogId)) {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  try {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      include: { author: true },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (err) {
    console.error("❌ Failed to fetch blog:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

///////// PUT API//////////

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const blogId = Number(params.id);
  const { title, content, userId } = await request.json();

  if (isNaN(blogId)) {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  try {
    const updated = await prisma.blog.update({
      where: {
        id: blogId,
        authorId: userId, // ✅ Ensure only author can edit
      },
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("❌ Failed to update blog:", err);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

/////// DELETE API///////

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const blogId = Number(params.id);

  if (isNaN(blogId)) {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  try {
    await prisma.blog.delete({
      where: { id: blogId },
    });

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("❌ Failed to delete blog:", err);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
