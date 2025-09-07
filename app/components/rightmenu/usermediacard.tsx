"use client";

import React from "react";
import { User } from "@prisma/client";
import Image from "next/image";

interface UserMediaCardProps {
  user: User;
}

const UserMediaCard: React.FC<UserMediaCardProps> = ({ user }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center font-medium mb-4">
        <span className="text-gray-500">User Media</span>
        <button className="text-blue-500 text-sm">See all</button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        {user.avatar && (
          <Image
            src={user.avatar}
            alt="User avatar"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-medium text-sm">
            {user.name && user.surname
              ? `${user.name} ${user.surname}`
              : user.username}
          </p>
          <p className="text-xs text-gray-500">@{user.username}</p>
        </div>
      </div>

      {/* Placeholder for user media content */}
      <div className="grid grid-cols-3 gap-2">
        {/* Example media items - replace with actual user media */}
        <div className="aspect-square bg-gray-200 rounded"></div>
        <div className="aspect-square bg-gray-200 rounded"></div>
        <div className="aspect-square bg-gray-200 rounded"></div>
        <div className="aspect-square bg-gray-200 rounded"></div>
        <div className="aspect-square bg-gray-200 rounded"></div>
        <div className="aspect-square bg-gray-200 rounded"></div>
      </div>

      <div className="mt-4 text-center">
        <button className="text-blue-500 text-sm hover:underline">
          View all media
        </button>
      </div>
    </div>
  );
};

export default UserMediaCard;
