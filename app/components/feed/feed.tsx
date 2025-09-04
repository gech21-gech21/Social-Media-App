"use client";

import React, { useEffect, useState } from "react";
import Post from "../feed/post"; 
import { useUser } from "@clerk/nextjs";
import { PostType } from "@/lib/type"; 


type FeedPostType = PostType & {
  user: {
    id: string;
    username: string;
    name?: string;
    surname?: string;
    avatar?: string;
  };
  likes: Array<{ userId: string }>;
  _count: {
    comments: number;
    likes: number;
  };
};

const Feed = ({ username }: { username?: string }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const [posts, setPosts] = useState<FeedPostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const url = username 
          ? `/api/posts?username=${username}&include=user,likes,counts`
          : '/api/posts?include=user,likes,counts';
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok) {
          setPosts(data);
        } else {
          console.error("Failed to fetch posts:", data.error);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchPosts();
    }
  }, [username, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center w-full py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full">
      <div className="w-full bg-white shadow-md rounded-lg p-4">
        {username && (
          <h2 className="text-xl font-bold mb-4">Posts from {username}</h2>
        )}
        
        {posts.length > 0 ? (
          posts.map((post) => <Post key={post.id} post={post} />)
        ) : (
          <div className="text-center py-8 text-gray-500">
            {username ? `${username} hasn't posted anything yet` : "No posts found. Follow more users to see more content."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;