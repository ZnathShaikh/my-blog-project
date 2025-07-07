// src/app/api/me/route.ts
import { NextResponse } from "next/server";
import { getUserFromServerCookie } from "../../../../lib/jwt";

export async function GET() {
  const user = getUserFromServerCookie(); // ✅ Extract user from cookie

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ user }); // ✅ Return valid user info
}
