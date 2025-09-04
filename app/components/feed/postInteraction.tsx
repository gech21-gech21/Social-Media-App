"use client";
import React, { useOptimistic, useState } from "react";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

const PostInteraction = ({
  postId,
  likes,
  commentNumber,
}: {
  postId: number;
  likes: string[];
  commentNumber: number;
}) => {
  const { isLoaded, userId } = useAuth();
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
      // Assuming you have a switchLike function imported
      // await switchLike(postId);
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
        {/* Share */}
        <div className="flex items-center gap-2 md:gap-4 bg-slate-100 p-2 rounded-xl cursor-pointer">
          <Image
            src="/icons/share.png"
            width={20}
            height={20}
            alt="share image"
          />
          <span className="text-gray-500">
            50 <span className="hidden md:inline">Shares</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostInteraction;
