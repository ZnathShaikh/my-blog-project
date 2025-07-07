// lib/jwt.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // 🔐 Replace with env later

export function signJwt(payload: object, expiresIn = "7d") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// ✅ New function
export function getUserFromServerCookie() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  const decoded = verifyJwt(token);
  return decoded as { id: number; username: string } | null;
}
