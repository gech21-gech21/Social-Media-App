import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/api/private")) return NextResponse.next();

  const auth = req.headers.get("authorization");
  const token = auth?.replace("Bearer ", "") || "";

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/private/:path*"],
};