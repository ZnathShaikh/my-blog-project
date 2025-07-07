import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getUserFromServerCookie } from "../../../../../lib/jwt";

const prisma = new PrismaClient();

///// ✅ GET BLOG BY ID (Public) /////
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

///// ✅ PUT (Update Blog) with Auth /////
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const blogId = Number(params.id);
  const user = getUserFromServerCookie(); // ✅ Get user from JWT

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content } = await request.json();

  if (isNaN(blogId)) {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  try {
    // ✅ Check blog ownership
    const existing = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!existing || existing.authorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.blog.update({
      where: { id: blogId },
      data: { title, content },
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

///// ✅ DELETE with Auth /////
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const blogId = Number(params.id);
  const user = getUserFromServerCookie(); // ✅ Get user from JWT

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isNaN(blogId)) {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  try {
    // ✅ Check blog ownership
    const existing = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!existing || existing.authorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.blog.delete({ where: { id: blogId } });

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("❌ Failed to delete blog:", err);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
