import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function GET(_req, { params }) {
  const { id } = params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, username: true, name: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function DELETE(_req, { params }) {
  const userId = getUserId();
  const { id } = params;

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (post.authorId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Clean dependents (since schema didn’t set onDelete: Cascade)
  await prisma.$transaction([
    prisma.like.deleteMany({ where: { postId: id } }),
    prisma.comment.deleteMany({ where: { postId: id } }),
    prisma.post.delete({ where: { id } }),
  ]);

  return NextResponse.json({ ok: true });
}
