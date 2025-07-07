import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// ✅ NEW: import helper to read JWT cookie
import { getUserFromServerCookie } from "../../../../lib/jwt";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // ✅ CHANGE: Get user from JWT cookie instead of query param
  const user = getUserFromServerCookie();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const blogs = await prisma.blog.findMany({
      where: { authorId: user.id }, // ✅ use user.id from JWT
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
  // ✅ NEW: get logged-in user from cookie
  const user = getUserFromServerCookie();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content } = await request.json(); // ✅ REMOVE userId

    const newBlog = await prisma.blog.create({
      data: {
        title,
        content,
        author: {
          connect: { id: user.id }, // ✅ Use user.id from JWT
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
