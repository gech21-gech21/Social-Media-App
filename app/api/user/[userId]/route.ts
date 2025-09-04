import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } } // Correctly typed params
) {
  try {
    const { userId: currentUserId } = getAuth(request);

    // Check if the user is authenticated
    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = params.userId; // Access params directly

    // Fetch user data from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Handle case where user is not found
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if current user is following this user
    const isFollowing = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId,
      },
    });

    // Check if current user has blocked this user
    const isUserBlocked = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: userId,
      },
    });

    // Check if there's a pending follow request
    const isFollowingSent = await prisma.followRequest.findFirst({
      where: {
        senderId: currentUserId,
        receiverId: userId,
      },
    });

    // Return the user data and status information
    return NextResponse.json({
      user,
      currentUserId,
      isFollowing: !!isFollowing,
      isUserBlocked: !!isUserBlocked,
      isFollowingSent: !!isFollowingSent,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
