import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function POST(_req, { params }) {
  try {
    const me = getUserId();
    const target = String(params.id);

    if (me === target) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    const userExists = await prisma.user.findUnique({ where: { id: target } });
    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
