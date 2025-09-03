"use client";
import React from "react";
import Image from "next/image";
import Comment from "./comment";

const Post = () => {
  return (
    <div className="w-full p-4">
      {/* User */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image
            src="/icons/profile.png"
            width={40}
            height={40}
            alt="profile image"
            className="w-10 h-10 rounded-full object-cover bg-gray-200"
          />
          <span className="font-medium">getahun</span>
        </div>
        <div>
          <Image
            src="/icons/more.png"
            width={20}
            height={20}
            alt="more options"
            className="cursor-pointer"
          />
        </div>
      </div>
      {/* Description */}
      <div className="flex flex-col gap-4">
        <div className="w-full min-h-96 relative mt-4">
          <div className="w-full h-64 md:h-96 relative">
            <Image
              src="/icons/background.png"
              fill
              alt="background"
              className="object-cover rounded-lg"
            />
          </div>
          <p className="mt-4 text-gray-700">this is the description text or message</p>
          {/* Interaction */}
          <div className="flex items-center justify-between text-sm mt-6">
            <div className="flex gap-4 md:gap-8">
              {/* Like */}
              <div className="flex items-center gap-2 md:gap-4 bg-slate-100 p-2 rounded-xl cursor-pointer">
                <Image
                  src="/icons/like.png"
                  width={20}
                  height={20}
                  alt="like image"
                />
                <span className="text-gray-500">
                  300 <span className="hidden md:inline">Likes</span>
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
                  150 <span className="hidden md:inline">Comments</span>
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
          <div className="mt-6">
            <Comment />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;