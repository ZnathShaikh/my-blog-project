import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }
  try {
    const blogs = await prisma.blog.findMany({
      where: { authorId: Number(userId) },
      orderBy: { createdAt: "desc" },
      include: { author: true },
    });

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("failed to fetch blogs:", error);
    return NextResponse.json(
      { error: "failed to load blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, userId } = await request.json();

    const newBlog = await prisma.blog.create({
      data: {
        title,
        content,
        author: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error("Failed to create blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
