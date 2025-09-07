import { NextResponse } from "next/server"; // Removed NextRequest import
import { auth } from "@clerk/nextjs/server";
import prisma from "../../../lib/client";

export async function GET() {
  // Removed unused request parameter
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch follow requests where current user is the receiver
    const followRequests = await prisma.followRequest.findMany({
      where: {
        receiverId: userId,
      },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(followRequests);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch friend requests" },
      { status: 500 }
    );
  }
}
