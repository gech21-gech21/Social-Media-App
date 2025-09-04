import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ data: "Protected content" });

  } catch {
    console.error("Authentication error:", Error);

    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}
