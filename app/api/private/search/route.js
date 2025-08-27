import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) return NextResponse.json({ users: [], posts: [] });

  const [users, posts] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: { id: true, username: true, name: true, image: true },
    }),
    prisma.post.findMany({
      where: { content: { contains: q, mode: "insensitive" } },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { id: true, username: true, name: true, image: true } } },
    }),
  ]);

  return NextResponse.json({ users, posts });
}
