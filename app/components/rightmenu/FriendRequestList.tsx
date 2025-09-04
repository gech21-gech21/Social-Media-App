"use client";

import { User, FollowRequest } from "@prisma/client";
import Image from "next/image";
import React, { useOptimistic } from "react";
import { acceptFollowRequest, declineFollowRequest } from "@/lib/action";

type RequestWithUser = FollowRequest & {
  sender: User;
};

const FriendRequestList = ({ requests }: { requests: RequestWithUser[] }) => {
  const [optimisticRequests, removeOptimisticRequest] = useOptimistic(
    requests,
    (state, requestId: number) => state.filter((req) => req.id !== requestId)
  );

  const accept = async (requestId: number, senderId: string) => {
    removeOptimisticRequest(requestId);
    try {
      await acceptFollowRequest(senderId);
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const decline = async (requestId: number, senderId: string) => {
    removeOptimisticRequest(requestId);
    try {
      await declineFollowRequest(senderId);
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  return (
    <div>
      {optimisticRequests.map((request) => (
        <div
          className="flex items-center justify-between p-4 border-b"
          key={request.id}
        >
          <div className="flex items-center gap-3">
            <Image
              src={request.sender.avatar || "/icons/profile.png"}
              alt="Profile image"
              width={32}
              height={32}
              className="rounded-full object-cover h-8 w-8"
            />
            <span className="text-sm font-medium">
              {request.sender.name && request.sender.surname
                ? `${request.sender.name} ${request.sender.surname}`
                : request.sender.username}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => accept(request.id, request.sender.id)}
              className="p-2 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
            >
              <Image
                src="/icons/accept.png"
                alt="Accept request"
                width={16}
                height={16}
              />
            </button>
            <button
              onClick={() => decline(request.id, request.sender.id)}
              className="p-2 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
            >
              <Image
                src="/icons/reject.png"
                alt="Reject request"
                width={16}
                height={16}
              />
            </button>
          </div>
        </div>
      ))}
      {optimisticRequests.length === 0 && (
        <div className="p-4 text-center text-gray-500">No friend requests</div>
      )}
    </div>
  );
};

export default FriendRequestList;
