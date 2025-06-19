import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  const { username, password } = await request.json();

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return new Response(JSON.stringify({ error: "Username already exists" }), {
      status: 400,
    });
  }

// TODO: Hash password before storing in DB (e.g., using bcrypt.hash)
  const newUser = await prisma.user.create({
    data: {
      username,
      password,
    },
  });

  return new Response(JSON.stringify({ success: true, user: newUser }), {
    status: 201,
  });
}