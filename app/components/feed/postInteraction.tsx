"use client";
import React, { useOptimistic, useState } from "react";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

const PostInteraction = ({
  likes,
  commentNumber,
}: {
  likes: string[];
  commentNumber: number;
}) => {
  const { userId } = useAuth(); // Removed isLoaded since not used
  const [likeState, setLikeState] = useState({
    likeCount: likes.length,
    isLiked: userId ? likes.includes(userId) : false,
  });

  const [optimisticLike, switchOptimisticLike] = useOptimistic(
    likeState,
    (state) => ({
      likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
      isLiked: !state.isLiked,
    })
  );

  const likeAction = async () => {
    if (!userId) return;

    switchOptimisticLike(undefined);
    try {
      // TODO: Implement switchLike function when ready
      // await switchLike();
      setLikeState((state) => ({
        likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
        isLiked: !state.isLiked,
      }));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between text-sm mt-6">
        <div className="flex gap-4 md:gap-8">
          {/* Like */}
          <div className="flex items-center gap-2 md:gap-4 bg-slate-100 p-2 rounded-xl cursor-pointer">
            <form action={likeAction}>
              <button type="submit">
                <Image
                  src={
                    optimisticLike.isLiked
                      ? "/icons/liked.png"
                      : "/icons/like.png"
                  }
                  width={20}
                  height={20}
                  alt="like image"
                />
              </button>
            </form>
            <span className="text-gray-500">
              {optimisticLike.likeCount}{" "}
              <span className="hidden md:inline">Likes</span>
            </span>
          </div>
          {/* Comment */}
          <div className="flex items-center gap-2 md:gap-4 bg-slate-100 p-2 rounded-xl cursor-pointer">
            <Image
              src="/icons/comment.png"
              width={20}
              height={20}
              alt="comment image"
            />
            <span className="text-gray-500">
              {commentNumber} <span className="hidden md:inline">Comments</span>
            </span>
          </div>
        </div>
        {/* Share - Consider making this functional or removing */}
        <div className="flex items-center gap-2 md:gap-4 bg-slate-100 p-2 rounded-xl cursor-pointer">
          <Image
            src="/icons/share.png"
            width={20}
            height={20}
            alt="share image"
          />
          <span className="text-gray-500">
            Share {/* Removed hardcoded number */}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostInteraction;
