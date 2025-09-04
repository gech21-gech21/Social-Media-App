// components/feed/CommentWrapper.tsx
"use client";

import React, { useEffect, useState } from "react";
import CommentList from "./CommentList";
import { Comment, User, Like } from "@prisma/client";

export type CommentWithUser = Comment & {
  user: User;
  likes?: Like[];
};

const CommentWrapper = ({ postId }: { postId: string }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/comments?postId=${postId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch comments: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Ensure all comments have a likes array
        const commentsWithLikes = data.map((comment: CommentWithUser) => ({
          ...comment,
          likes: comment.likes || []
        }));
        
        setError(null);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  if (loading) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-gray-500 text-center">Loading comments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-50 rounded-lg">
        <div className="text-red-500 text-center">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <CommentList postId={postId} />
    </div>
  );
};

export default CommentWrapper;