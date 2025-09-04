"use client";
import React, { useOptimistic, useState, useTransition } from "react";
import { switchFollow, switchBlock } from "@/lib/action";

const UserinfocardInteraction = ({
  userId,
  isUserBlocked,
  isFollowing,
  isFollowingSent,
}: {
  userId: string;
  isUserBlocked: boolean;
  isFollowing: boolean;
  isFollowingSent: boolean;
}) => {
  const [userstate, setUserstate] = useState({
    following: isFollowing,
    blocked: isUserBlocked,
    followingRequestsent: isFollowingSent,
  });

  const [isPending, startTransition] = useTransition();

  const [optimisticState, switchOptimisticState] = useOptimistic(
    userstate,
    (state, value: "follow" | "block") =>
      value === "follow"
        ? {
            ...state,
            following: !state.following,
            followingRequestsent:
              !state.following && !state.followingRequestsent,
          }
        : {
            ...state,
            blocked: !state.blocked,
          }
  );

  const follow = async () => {
    startTransition(async () => {
      switchOptimisticState("follow");

      try {
        await switchFollow(userId);
        setUserstate((prev) => ({
          ...prev,
          following: !prev.following,
          followingRequestsent: !prev.following && !prev.followingRequestsent,
        }));
      } catch (error) {
        console.error("Follow error:", error);
        switchOptimisticState("follow");
      }
    });
  };

  const block = async () => {
    startTransition(async () => {
      switchOptimisticState("block");

      try {
        await switchBlock(userId);
        setUserstate((prev) => ({
          ...prev,
          blocked: !prev.blocked,
        }));
      } catch (error) {
        console.error("Block error:", error);
        switchOptimisticState("block");
      }
    });
  };

  const handleBlockClick = (e: React.MouseEvent) => {
    e.preventDefault();
    block();
  };

  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    follow();
  };

  return (
    <div className="flex flex-col gap-2">
      <form>
        <button
          onClick={handleFollowClick}
          disabled={isPending}
          className="bg-blue-700 text-white cursor-pointer text-sm rounded-md p-2 w-full disabled:opacity-50"
        >
          {isPending
            ? "Processing..."
            : optimisticState.following
            ? "Following"
            : optimisticState.followingRequestsent
            ? "Friend request sent"
            : "Follow"}
        </button>
      </form>

      <form>
        <button
          onClick={handleBlockClick}
          disabled={isPending}
          className="text-red-400 text-sm cursor-pointer self-end disabled:opacity-50"
        >
          {optimisticState.blocked ? "Unblock User" : "Block User"}
        </button>
      </form>
    </div>
  );
};

export default UserinfocardInteraction;
