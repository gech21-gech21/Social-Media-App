import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    const token = headers().get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = String(payload.sub);

    const me = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true, name: true, bio: true, image: true },
    });

    if (!me) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(me, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
