// components/feed/StoryList.tsx
"use client";

import React, { useOptimistic, useState, startTransition, useId } from "react";
import { Story, User } from "@prisma/client";
import Image from "next/image";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { useUser } from "@clerk/nextjs";
import { addStory } from "@/lib/action";

type StoryWithUser = Story & {
  user: User;
};

const StoryList = ({
  stories,
  userId,
}: {
  stories: StoryWithUser[];
  userId: string;
}) => {
  const { user: clerkUser } = useUser();
  const [storyList, setStoryList] = useState(stories);
  const [img, setImg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const uniqueId = useId(); // Generate a unique ID prefix

  const [optimisticStories, addOptimisticStory] = useOptimistic(
    storyList,
    (currentStories, newStory: StoryWithUser) => [newStory, ...currentStories]
  );

  const add = async () => {
    if (!img) return;

    setIsUploading(true);

    // Create a unique ID for the optimistic story
    const tempId = `${uniqueId}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Create optimistic story
    const optimisticStory: StoryWithUser = {
      id: parseInt(tempId.replace(/[^0-9]/g, "").substr(0, 8)) || 99999999, // Ensure it's a number
      img: img,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      userId: userId,
      user: {
        id: userId,
        username: clerkUser?.username || "User",
        name: clerkUser?.firstName || null,
        surname: clerkUser?.lastName || null,
        avatar: clerkUser?.imageUrl || null,
        email: clerkUser?.emailAddresses[0]?.emailAddress || "",
        password: "",
        description: null,
        work: null,
        school: null,
        website: null,
        city: null,
        country: null,
        cover: null,
        createdAt: new Date(),
      },
    };

    // Wrap the optimistic update in startTransition
    startTransition(() => {
      addOptimisticStory(optimisticStory);
    });

    try {
      const result = await addStory(img);

      // Replace the optimistic story with the real one from the server
      if (result) {
        setStoryList((prev) => [
          result as StoryWithUser,
          ...prev.filter((s) => s.id !== optimisticStory.id),
        ]);
      }

      setImg(null);
    } catch (error) {
      console.error("Error adding story:", error);
      // Remove the optimistic story on error
      setStoryList((prev) => prev.filter((s) => s.id !== optimisticStory.id));
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (result.info && typeof result.info !== "string") {
      setImg(result.info.secure_url);
    }
  };

  return (
    <div className="flex gap-4 items-center">
      {/* Add Story Button */}
      <CldUploadWidget uploadPreset="social" onSuccess={handleUploadSuccess}>
        {({ open }) => (
          <div className="flex flex-col items-center gap-2">
            <div className="relative cursor-pointer" onClick={() => open()}>
              <Image
                src={clerkUser?.imageUrl || "/icons/profile.png"}
                alt="Your profile"
                width={60}
                height={60}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500"
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                <span className="text-white text-lg">+</span>
              </div>
            </div>

            {img && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  add();
                }}
              >
                <button
                  type="submit"
                  disabled={isUploading}
                  className="text-sm bg-blue-500 rounded-md px-2 py-1 text-white disabled:opacity-50"
                >
                  {isUploading ? "Posting..." : "Post Story"}
                </button>
              </form>
            )}
            <span className="text-xs text-gray-600">Your story</span>
          </div>
        )}
      </CldUploadWidget>

      {/* Other users' stories */}
      {optimisticStories.map((story) => (
        <div
          key={`story-${story.id}-${story.createdAt.getTime()}`}
          className="flex flex-col items-center gap-1"
        >
          <div className="relative">
            <Image
              src={story.user.avatar || "/icons/profile.png"}
              alt={`${story.user.name || story.user.username}'s story`}
              width={60}
              height={60}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-500"
            />
            <div className="absolute inset-0 rounded-full border-2 border-transparent animate-pulse" />
          </div>
          <span className="text-xs text-gray-600 max-w-[60px] truncate">
            {story.user.name || story.user.username}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StoryList;
