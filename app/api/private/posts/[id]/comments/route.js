import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { z } from "zod";

// Zod schema for comment creation
const createSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

// GET /api/posts/:id/comments?page=1&limit=10
export async function GET(req, { params }) {
  try {
    const { id: postId } = params;
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 10)));
    const skip = (page - 1) * limit;

    // Check if post exists
    const postExists = await prisma.post.findUnique({ where: { id: postId } });
    if (!postExists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Fetch comments with pagination
    const [items, total] = await prisma.$transaction([
      prisma.comment.findMany({
        where: { postId },
        orderBy: { createdAt: "desc" }, // newest first
        skip,
        take: limit,
        include: {
          author: { select: { id: true, username: true, name: true, image: true } },
        },
      }),
      prisma.comment.count({ where: { postId } }),
    ]);

    return NextResponse.json({ page, limit, total, items }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/posts/:id/comments
export async function POST(req, { params }) {
  try {
    // Get token from header
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id: postId } = params;
    const { content } = createSchema.parse(await req.json());

    // Ensure post exists
    const postExists = await prisma.post.findUnique({ where: { id: postId } });
    if (!postExists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: { content: content.trim(), postId, authorId: payload.id },
      include: {
        author: { select: { id: true, username: true, name: true, image: true } },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
