"use client";

import { addComment, switchCommentLike } from "@/lib/action"; // Adjust the path as necessary
import { useUser } from "@clerk/nextjs";
import { Comment, User, Like } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type CommentWithUser = Comment & {
  user: User;
  likes: Like[];
};

const CommentList: React.FC<{ postId: string }> = ({ postId }) => {
  const { user } = useUser();
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingLikes, setLoadingLikes] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/comments?postId=${postId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch comments: ${response.status}`);
        }

        const data: CommentWithUser[] = await response.json();
        setComments(data);
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

  const add = async () => {
    if (!user || !desc) return;

    try {
      const createdComment = await addComment(postId, desc);
      setComments((prev) => [createdComment as CommentWithUser, ...prev]);
      setDesc(""); // Clear input after successful comment
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    add();
  };

  const handleCommentLike = async (commentId: number) => {
    if (!user) return;

    setLoadingLikes((prev) => ({ ...prev, [commentId]: true }));

    try {
      const result = await switchCommentLike(commentId);

      // Update local state with the new like count
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: result.liked
                ? [
                    ...comment.likes,
                    {
                      id: Math.random(), // Temporary ID for UI
                      userId: user.id,
                      commentId: commentId,
                      postId: null,
                      createdAt: new Date(),
                    } as Like,
                  ]
                : comment.likes.filter((like) => like.userId !== user.id),
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error("Error liking comment:", error);
    } finally {
      setLoadingLikes((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  // Check if current user liked a comment
  const hasUserLiked = (comment: CommentWithUser) => {
    if (!user) return false;
    return comment.likes.some((like) => like.userId === user.id);
  };

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
    <div className="mt-6">
      {user && (
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div>
              <Image
                src={user.imageUrl || "/icons/noavatar.png"}
                alt="user image"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2"
            >
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Write a comment..."
                className="bg-transparent outline-none flex-1 text-sm"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    add();
                  }
                }}
              />
              <button
                type="submit"
                className="text-blue-500 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
                disabled={!desc.trim()}
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Image
                src={comment.user.avatar || "/icons/profile.png"}
                width={40}
                height={40}
                alt="profile image"
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">
                      {comment.user.name && comment.user.surname
                        ? `${comment.user.name} ${comment.user.surname}`
                        : comment.user.username}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm">{comment.desc}</p>
                </div>
                <div className="flex items-center gap-4 mt-2 ml-2">
                  <button
                    onClick={() => handleCommentLike(comment.id)}
                    disabled={loadingLikes[comment.id]}
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-500 text-xs disabled:opacity-50"
                  >
                    <Image
                      src={
                        hasUserLiked(comment)
                          ? "/icons/liked.png"
                          : "/icons/like.png"
                      }
                      width={14}
                      height={14}
                      alt="like"
                      className={loadingLikes[comment.id] ? "opacity-50" : ""}
                    />
                    <span>{comment.likes.length}</span>
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 text-xs">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;
