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