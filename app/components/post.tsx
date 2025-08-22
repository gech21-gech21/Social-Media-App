"use client"
import React from "react";

import Image from "next/image";

const Post = () => {
  return (
    <div className="w-full">
      {/* User */}
      <div className="  flex justify-between items-center ">
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
      {/* description */}
      <div className="flex flex-col gap-4 ">
        <div className="w-full min-h-96 relative mt-4">
          <Image
            src="/icons/background.png"
            width={700}
            height={200}
            alt="more options"
            className="background image"
          />
          <p>this is the description text or message </p>
        </div>
      </div>
      {/* interaction */}
      <div className="flex items-center justify-between text-sm"></div>
      <div className="flex gap-8 ">
        <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-xl">
          <Image
            src="/icons/like.png"
            width={20}
            height={20}
            alt="like image"
            className=""
          />
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Post;
