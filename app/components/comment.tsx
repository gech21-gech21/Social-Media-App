"use client";
import Image from "next/image";
import React from "react";
const comment = () => {
  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Write a comments..."
          className="bg-gray-200 rounded-3xl shadow-md flex items-center p-2 w-[100%] "
        />
      </div>
      {/* description */}
      <div className="mt-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image
              src="/icons/profile.png"
              width={40}
              height={40}
              alt="profile image"
              className="w-10 h-10 rounded-full object-cover bg-gray-200"
            />
            <span className="font-medium">Abebe</span>
          </div>
          <div>
            <Image
              src="/icons/more.png"
              width={20}
              height={20}
              alt="more options"
              className="cursor-pointer"
            />
          </div>{" "}
        </div>{" "}
        <div>
          {" "}
          <p className="mt-6">
            Absolutely loving this vibe! 🌟 Your creativity shines through every
            detail! This is such an inspiring message and a great reminder to
            stay positive and keep pushing forward. Wow, this content is so
            relatable; I can not wait to see more posts like this!
          </p>
          <div className="flex gap-8 mt-4  ">
            <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-xl cursor-pointer">
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
            <div>
              <span className="text-gray-500 cursor-pointer">Replay</span>
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default comment;
