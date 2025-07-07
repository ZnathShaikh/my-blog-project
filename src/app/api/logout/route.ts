import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // ✅ Clear the 'token' cookie
  cookies().set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0), // Expire immediately
  });

  return NextResponse.json({ message: "Logged out" });
}
