import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';


const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // ✅ 1. Validate input
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // ✅ 2. Find user in DB by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // TODO: Use hashed password comparison (e.g., bcrypt.compare) for secure login

    if (user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' } // valid for 7 days
    );

    // ✅ 4. Set cookie
    cookies().set('token', token, {
      httpOnly: true,
      secure: false, // ⛔ force to false on localhost
      sameSite: 'lax', // ✅ lax works better on localhost
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    


    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
