import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  const token = headers().get("authorization")?.replace("Bearer ", "");
  const { sub } = verifyToken(token || "");

  const me = await prisma.user.findUnique({
    where: { id: String(sub) },
    select: { id: true, email: true, username: true, name: true, bio: true, image: true },
  });

  return NextResponse.json(me);
}
