"use client";

import React, { useOptimistic, useState } from 'react';
import { Story, User } from "@prisma/client";
import Image from 'next/image';
import { CldUploadWidget } from "next-cloudinary"; // Make sure this is imported correctly
import { useUser } from "@clerk/nextjs"; // Import useUser if you're using Clerk

type StoryWithUser = Story & {
  user: User;
};

const StoryList = ({ stories, userId }: { stories: StoryWithUser[], userId: string }) => {
  const [storyList, setStoryList] = useState(stories);
  const [img, setImg] = useState<any>();
  const user = useUser();
  
  const add = async () => {
    if (!img?.secure_url) return;

    // Use optimistic updates
    addOptimisticStory();
    
    try {
      await addStory(img.secure_url); // Make sure to define this function
    } catch (error) {
      console.log(error);
    }
  };

  const [optimisticStories, addOptimistic] = useOptimistic(storyList, {
    state: (value: StoryWithUser[]) => [value, ...optimisticStories], // Adjust this line as necessary
  });

  return (
    <div>
      <CldUploadWidget 
        uploadPreset="newsocialmedia"
        onSuccess={(result) => {
          setImg(result.info);
        }}
      >
        {({ open }) => (
          <div className="flex items-center gap-2 cursor-pointer relative" onClick={() => open()}>
            <Image
              src={user.user?.avatar || "/icons/profile.png"}
              alt="image of the profile"
              width={50}
              height={60}
              className="w-20 rounded-full ring-2 object-cover"
            />
            {img ? (
              <form onSubmit={add}>
                <button type="submit" className='text-xl bg-blue-500 rounded-md p-1 text-white'>Post</button>
              </form>
            ) : (
              <span className="font-medium">Add a story</span>
            )}
            <div className='text-5xl absolute text-gray-100 top-1'>+</div>
          </div>
        )}
      </CldUploadWidget>

      {optimisticStories.map(story => (
        <div className="flex items-center gap-2 cursor-pointer" key={story.id}>
          <Image
            src={story.user.avatar || "/icons/profile.png"}
            alt="image of the profile"
            width={50}
            height={60}
            className="w-20 rounded-full ring-2"
          />
          <span className="font-medium">{story.user.name || story.user.username}</span>
        </div>
      ))}
    </div>
  );
};

export default StoryList;