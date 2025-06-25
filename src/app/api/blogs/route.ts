import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
try {
    const blogs = await prisma.blog.findMany({
        orderBy: {createdAt: 'desc'},
    });

    return NextResponse.json({blogs});
}catch(error){
    console.error("failed to fetch blogs:", error);
    return NextResponse.json(
        {error: "failed to load blogs"},
        {status: 500}
    )
}
}

export async function POST(request: Request) {
    try {
      const { title, content } = await request.json();
  
      const newBlog = await prisma.blog.create({
        data: {
          title,
          content,
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