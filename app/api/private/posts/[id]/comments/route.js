import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { z } from "zod";

const createSchema = z.object({ content: z.string().min(1) });

// GET /api/private/posts/:id/comments
export async function GET(_req, { params }) {
  const { id: postId } = params;
  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    include: { author: { select: { id: true, username: true, name: true, image: true } } },
  });
  return NextResponse.json(comments);
}

// POST /api/private/posts/:id/comments
export async function POST(req, { params }) {
  const userId = getUserId();
  const { id: postId } = params;
  const { content } = createSchema.parse(await req.json());

  const created = await prisma.comment.create({
    data: { content, postId, authorId: userId },
    include: { author: { select: { id: true, username: true, name: true, image: true } } },
  });

  return NextResponse.json(created, { status: 201 });
}
