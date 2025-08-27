import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function POST(_req, { params }) {
  const userId = getUserId();
  const { id: postId } = params;

  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { postId_userId: { postId, userId } } });
    return NextResponse.json({ liked: false });
  } else {
    await prisma.like.create({ data: { postId, userId } });
    return NextResponse.json({ liked: true });
  }
}
