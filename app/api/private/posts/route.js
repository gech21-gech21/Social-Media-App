import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { z } from "zod";

const createSchema = z.object({
  content: z.string().min(1, "content required"),
  image: z.string().url().optional(),
});

// GET /api/private/posts?page=1&limit=10
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 10)));
  const skip = (page - 1) * limit;

  const [items, total] = await prisma.$transaction([
    prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, username: true, name: true, image: true } },
        _count: { select: { likes: true, comments: true } },
      },
    }),
    prisma.post.count(),
  ]);

  return NextResponse.json({ page, limit, total, items });
}

// POST /api/private/posts
export async function POST(req) {
  const userId = getUserId();
  const body = await req.json();
  const { content, image } = createSchema.parse(body);

  const post = await prisma.post.create({
    data: { content, image, authorId: userId },
    include: {
      author: { select: { id: true, username: true, name: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return NextResponse.json(post, { status: 201 });
}
