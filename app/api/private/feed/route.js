import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function GET(req) {
  try {
    const me = getUserId();
    if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 10)));
    const skip = (page - 1) * limit;

    // Get IDs of users to include in feed
    const following = await prisma.follow.findMany({
      where: { followerId: me },
      select: { followingId: true },
    });
    const ids = [me, ...following.map(f => f.followingId)];

    // Fetch posts + total count
    const [items, total] = await prisma.$transaction([
      prisma.post.findMany({
        where: { authorId: { in: ids } },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, username: true, name: true, image: true } },
          _count: { select: { likes: true, comments: true } },
          likes: { where: { userId: me }, select: { id: true } }, // to show likedByMe
        },
      }),
      prisma.post.count({ where: { authorId: { in: ids } } }),
    ]);

    // Add likedByMe boolean
    const formattedItems = items.map(post => ({
      ...post,
      likedByMe: post.likes.length > 0,
      likes: undefined, // remove likes array, only keep likedByMe
    }));

    return NextResponse.json({ page, limit, total, items: formattedItems }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
