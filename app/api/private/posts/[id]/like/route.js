import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function POST(_req, { params }) {
  try {
    const userId = getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: postId } = params;

    // Ensure the post exists
    const postExists = await prisma.post.findUnique({ where: { id: postId } });
    if (!postExists) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    // Toggle like
    const existing = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existing) {
      await prisma.like.delete({ where: { postId_userId: { postId, userId } } });
      const likeCount = await prisma.like.count({ where: { postId } });
      return NextResponse.json({ liked: false, likeCount });
    } else {
      await prisma.like.create({ data: { postId, userId } });
      const likeCount = await prisma.like.count({ where: { postId } });
      return NextResponse.json({ liked: true, likeCount });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
