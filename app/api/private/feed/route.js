import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function GET(req) {
  const me = getUserId();
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 10)));
  const skip = (page - 1) * limit;

  const following = await prisma.follow.findMany({
    where: { followerId: me },
    select: { followingId: true },
  });
  const ids = [me, ...following.map(f => f.followingId)];

  const [items, total] = await prisma.$transaction([
    prisma.post.findMany({
      where: { authorId: { in: ids } },
      skip, take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, username: true, name: true, image: true } },
        _count: { select: { likes: true, comments: true } },
      },
    }),
    prisma.post.count({ where: { authorId: { in: ids } } }),
  ]);

  return NextResponse.json({ page, limit, total, items });
}
