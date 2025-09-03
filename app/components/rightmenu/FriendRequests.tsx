import Link from "next/link";
import React from "react";
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import FriendRequestList from "./FriendRequestList";
import { User, FollowRequest } from "@prisma/client";

// Define the type for requests with sender
type RequestWithUser = FollowRequest & {
  sender: User;
};

const FriendRequests = async () => {
  const { userId } = await auth();
  
  if (!userId) return null;

  // Note: Prisma model names are case-sensitive
  // Make sure your model is named FollowRequest (singular)
  const requests = await prisma.followRequest.findMany({
    where: {
      receiverId: userId,
    },
    include: {
      sender: true
    }
  });

  if (requests.length === 0) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-full text-sm flex flex-col gap-4">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">Friend Requests</span>
        <Link className="text-blue-500 text-sm" href="/requests">
          see all
        </Link>
      </div>
      
      <FriendRequestList requests={requests} />
    </div>
  );
};

export default FriendRequests;