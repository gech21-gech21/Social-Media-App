"use client";

import Image from "next/image";
import { useState, ChangeEvent } from "react";

// Simple Story + User shape (no Prisma, no backend)
interface UserType {
  id: string;
  username: string;
  avatar: string;
  name?: string;
}

interface StoryType {
  id: string | number;
  img: string;
  createdAt: Date;
  expiresAt: Date;
  userId: string;
  user: UserType;
}

const StoryList = ({
  stories,
  userId,
}: {
  stories: StoryType[];
  userId: string;
}) => {
  const [storyList, setStoryList] = useState<StoryType[]>(stories);
  const [img, setImg] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImg(url);
    }
  };

  const add = () => {
    if (!img) return;

    const newStory: StoryType = {
      id: Math.random(),
      img: img,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hrs
      userId,
      user: {
        id: userId,
        username: "You",
        avatar: "/noAvatar.png",
      },
    };

    setStoryList((prev) => [newStory, ...prev]);
    setImg(null);
  };

  return (
    <>
      {/* Upload input */}
      <div className="flex flex-col items-center gap-2 cursor-pointer relative">
        <label htmlFor="story-upload">
          <Image
            src={img || "/noAvatar.png"}
            alt="preview"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full ring-2 object-cover cursor-pointer"
          />
        </label>
        <input
          id="story-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {img ? (
          <button
            onClick={add}
            className="text-xs bg-blue-500 p-1 rounded-md text-white"
          >
            Send
          </button>
        ) : (
          <span className="font-medium">Add a Story</span>
        )}
        <div className="absolute text-6xl text-gray-200 top-1">+</div>
      </div>

      {/* STORY LIST */}
      {storyList.map((story) => (
        <div
          className="flex flex-col items-center gap-2 cursor-pointer"
          key={story.id}
        >
          <Image
            src={story.img || story.user.avatar || "/noAvatar.png"}
            alt=""
            width={80}
            height={80}
            className="w-20 h-20 rounded-full ring-2 object-cover"
          />
          <span className="font-medium">{story.user.username}</span>
        </div>
      ))}
    </>
  );
};

export default StoryList;
