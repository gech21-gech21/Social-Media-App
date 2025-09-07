// components/feed/Stories.tsx
import React from "react";
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import StoryList from "./StoryList";

const Stories = async () => {
  const { userId: currentUserId } = await auth();
  if (!currentUserId) return null;

  try {
    const stories = await prisma.story.findMany({
      where: {
        expiresAt: {
          gt: new Date(),
        },
        OR: [
          {
            user: {
              followers: {
                some: {
                  followerId: currentUserId,
                },
              },
            },
          },
          {
            userId: currentUserId,
          },
        ],
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return (
      <div className="p-4 bg-white rounded-lg shadow-md overflow-x-auto text-xs scrollbar-hide">
        <div className="flex gap-6 min-w-max">
          <StoryList stories={stories} userId={currentUserId} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching stories:", error);
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="text-gray-500 text-center">Error loading stories</div>
      </div>
    );
  }
};

export default Stories;
