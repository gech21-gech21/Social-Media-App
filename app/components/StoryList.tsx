"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { addStory } from "../../lib/action";


type StoryWithUser = {
  id: number;
  img: string;
  createdAt: Date;
  expiresAt: Date;
  userId: string;
  user: {
    id: string;
    email: string;
    password: string;
    username: string;
    name: string | null;
    surname: string | null;
    avatar: string | null;
    description: string | null;
    work: string | null;
    school: string | null;
    website: string | null;
    city: string | null;
    country: string | null;
    cover: string | null;
    createdAt: Date;
  };
};

const StoryList = ({
  stories,
  userId,
}: {
  stories: StoryWithUser[];
  userId: string;
}) => {
  const [img, setImg] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const { user: clerkUser } = useUser();
  const router = useRouter();

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!img) return;

    setIsPosting(true);

    try {
      await addStory(img);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.log("Failed to post story:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleUploadSuccess = (results: CloudinaryUploadWidgetResults) => {
    if (typeof results.info === "string") {
      setImg(results.info);
    } else if (
      results.info &&
      typeof results.info === "object" &&
      "secure_url" in results.info
    ) {
      setImg(results.info.secure_url || null);
    }
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex space-x-4 p-4 min-w-max">
        <CldUploadWidget uploadPreset="social" onSuccess={handleUploadSuccess}>
          {({ open }) => (
            <div
              className="flex flex-col items-center cursor-pointer relative shrink-0"
              onClick={() => open()}
            >
              <div className="relative">
                <Image
                  src={clerkUser?.imageUrl || "/icons/profile.png"}
                  alt="image of the profile"
                  width={60}
                  height={60}
                  className="w-16 h-16 rounded-full ring-2 ring-white object-cover"
                />
                <div className="absolute bottom-0 right-0  mt-0 flex items-center justify-center w-8 h-8">
                  <span className="text-white text-lg font-bold">+</span>
                </div>
              </div>
              {img ? (
                <form onSubmit={add} className="mt-2">
                  <button
                    type="submit"
                    className="text-sm bg-blue-500 rounded-md px-2 py-1 text-white disabled:bg-gray-400"
                    disabled={isPosting}
                  >
                    {isPosting ? "Posting..." : "Post"}
                  </button>
                </form>
              ) : (
                <span className="text-xs mt-1 text-gray-600">Add story</span>
              )}
            </div>
          )}
        </CldUploadWidget>

      
        {stories.map((story) => (
          <div
            key={story.id}
            className="flex flex-col items-center shrink-0 cursor-pointer"
          >
            <div className="relative">
              <Image
                src={story.img || "/icons/profile.png"}
                alt={`${
                  story.user.name || story.user.username || "User"
                }'s story`}
                width={60}
                height={60}
                className="w-16 h-16 rounded-full ring-2 ring-blue-500 object-cover"
              />
            </div>
            <span className="text-xs mt-1 text-gray-600 truncate max-w-[80px]">
              {story.user.name || story.user.username || "User"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryList;
