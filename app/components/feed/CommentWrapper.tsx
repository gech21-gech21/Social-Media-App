"use client";
import React, { useEffect, useState } from "react";
import { addComment } from "@/lib/action";
import { useUser } from "@clerk/nextjs";
import { Comment, User } from "@prisma/client";
import Image from "next/image";

type CommentWithUser = Comment & { user: User };

const CommentWrapper = ({ postId }: { postId: string }) => {
  const { user } = useUser();
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(`/api/comments?postId=${postId}`);
      if (response.ok) {
        const fetchedComments: CommentWithUser[] = await response.json();
        setComments(fetchedComments);
      } else {
        console.error("Failed to fetch comments");
      }
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!user || !desc) return;

    const newComment: CommentWithUser = {
      id: Math.floor(Math.random() * 1000000),
      desc,
      img: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
      postId: parseInt(postId, 10),
      user: {
        id: user.id,
        avatar: user.imageUrl || "/icons/noavatar.png",
        username: user.username || "",
        email: "",
        name: user.firstName || "",
        surname: user.lastName || "",
      } as User,
    };

    setComments((prev) => [newComment, ...prev]); // Optimistically add the new comment

    try {
      const createdComment = await addComment(postId, desc);
      setComments((prev) => [createdComment, ...prev]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {user && (
        <div>
          <div className="flex items-center gap-4">
            <div>
              <Image
                src={user.imageUrl || "/icons/noavatar.png"}
                alt="user image"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
            </div>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Write a comment..."
              className="bg-transparent outline-none flex-1"
            />
            <button
              onClick={handleAddComment}
              className="text-blue-500 font-medium"
            >
              Post
            </button>
          </div>
        </div>
      )}

      {/* Comments list */}
      {comments.map((comment) => (
        <div key={comment.id} className="mt-8">
          <div className="flex items-center gap-4">
            <Image
              src={comment.user.avatar || "/icons/profile.png"}
              width={40}
              height={40}
              alt="profile image"
              className="w-10 h-10 rounded-full"
            />
            <span className="font-medium">
              {comment.user.name && comment.user.surname
                ? `${comment.user.name} ${comment.user.surname}`
                : comment.user.username}
            </span>
          </div>
          <p className="mt-6">{comment.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentWrapper;