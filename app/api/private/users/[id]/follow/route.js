import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function POST(_req, { params }) {
  const me = getUserId();
  const { id: target } = params;

  if (me === target) return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: me, followingId: target } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { followerId_followingId: { followerId: me, followingId: target } } });
    return NextResponse.json({ following: false });
  } else {
    await prisma.follow.create({ data: { followerId: me, followingId: target } });
    return NextResponse.json({ following: true });
  }
}
