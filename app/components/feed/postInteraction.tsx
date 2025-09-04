"use client";

import React, { useState } from "react";
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
  const { userId } = useAuth();
  const [likeCount, setLikeCount] = useState(likes.length);
  const [isLiked, setIsLiked] = useState(
    userId ? likes.includes(userId) : false
  );

  const likeAction = async () => {
    if (!userId) return;

    // Optimistically update the like state
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      // Call the API to toggle the like status
      // await switchLike(postId);
    } catch (error) {
      console.error("Error toggling like:", error);
      // If there's an error, revert the optimistic update
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
    }
  };

  return (
    <div className="flex items-center justify-between text-sm mt-6">
      <div className="flex gap-4 md:gap-8">
        {/* Like */}
        <div className="flex items-center gap-2 md:gap-4 bg-slate-100 p-2 rounded-xl cursor-pointer">
          <button onClick={likeAction}>
            <Image
              src={isLiked ? "/icons/liked.png" : "/icons/like.png"}
              width={20}
              height={20}
              alt="like icon"
            />
          </button>
          <span className="text-gray-500">
            {likeCount} <span className="hidden md:inline">Likes</span>
          </span>
        </div>
        {/* Comment */}
        <div className="flex items-center gap-2 md:gap-4 bg-slate-100 p-2 rounded-xl cursor-pointer">
          <Image
            src="/icons/comment.png"
            width={20}
            height={20}
            alt="comment icon"
          />
          <span className="text-gray-500">
            {commentNumber} <span className="hidden md:inline">Comments</span>
          </span>
        </div>
      </div>
      {/* Share */}
      <div className="flex items-center gap-2 md:gap-4 bg-slate-100 p-2 rounded-xl cursor-pointer">
        <Image src="/icons/share.png" width={20} height={20} alt="share icon" />
        <span className="text-gray-500">
          50 <span className="hidden md:inline">Shares</span>
        </span>
      </div>
    </div>
  );
};

export default PostInteraction;
