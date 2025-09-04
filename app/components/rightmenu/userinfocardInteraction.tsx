"use client";
import React, { useState, useTransition } from "react";
import { switchFollow, switchBlock } from "@/lib/action";

const UserinfocardInteraction = ({
  userId,
  currentUserId,
  isUserBlocked,
  isFollowing,
}: {
  userId: string;
  currentUserId: string;
  isUserBlocked: boolean;
  isFollowing: boolean;
}) => {
  const [userState, setUserState] = useState({
    following: isFollowing,
    blocked: isUserBlocked,
  });

  const [isPending, startTransition] = useTransition();

  const follow = async () => {
    startTransition(async () => {
      try {
        await switchFollow(userId);
        setUserState((prev) => ({ ...prev, following: !prev.following }));
      } catch (error) {
        console.error("Follow error:", error);
      }
    });
  };

  const block = async () => {
    startTransition(async () => {
      try {
        await switchBlock(userId);
        setUserState((prev) => ({ ...prev, blocked: !prev.blocked }));
      } catch (error) {
        console.error("Block error:", error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {!userState.following && !userState.blocked && (
        <button
          onClick={follow}
          disabled={isPending}
          className="bg-blue-700 text-white rounded-md p-2"
        >
          Follow
        </button>
      )}
      {userState.blocked ? (
        <button onClick={block} disabled={isPending} className="text-red-400">
          Unblock User
        </button>
      ) : (
        <button onClick={block} disabled={isPending} className="text-red-400">
          Block User
        </button>
      )}
    </div>
  );
};

export default UserinfocardInteraction;
