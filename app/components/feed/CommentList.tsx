"use client";

import { addComment } from "@/lib/action";
import { useUser } from "@clerk/nextjs";
import { Comment, User } from "@prisma/client";
import Image from "next/image";
import React, { useOptimistic, useState } from "react";

type CommentWithUser = Comment & { user: User };

const CommentList = ({
  comments,
  postId,
}: {
  comments: CommentWithUser[];
  postId: string; // Ensure postId is a string
}) => {
  const { user } = useUser();
  const [commentState, setCommentState] = useState(comments);
  const [desc, setDesc] = useState("");

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    commentState,
    (state, value: CommentWithUser) => [value, ...state]
  );

  const add = async () => {
    if (!user || !desc) return;

    const optimisticComment: CommentWithUser = {
      id: Math.floor(Math.random() * 1000000), // Generate a random number for the ID
      desc,
      img: null, // Add img property (adjust this according to your needs)
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      userId: user.id,
      postId: parseInt(postId), // Convert postId to number if needed
      user: {
        id: user.id,
        avatar: user.imageUrl || "/icons/noavatar.png",
        username: user.username || "",
        email: "",
        name: user.firstName || "",
        surname: user.lastName || "",
      } as User,
    };

    addOptimisticComment(optimisticComment);

    try {
      const createdComment = await addComment(postId, desc);
      setCommentState((prev) => [createdComment, ...prev]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    add();
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
            <form
              onSubmit={handleSubmit}
              className="flex-1 flex justify-between bg-gray-200 rounded-xl shadow-md items-center px-4 py-2 w-full"
            >
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Write a comment..."
                className="bg-transparent outline-none flex-1"
              />
              <button type="submit" className="text-blue-500 font-medium">
                Post
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Comments list */}
      {optimisticComments.map((comment) => (
        <div key={comment.id} className="mt-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Image
                src={comment.user.avatar || "/icons/profile.png"}
                width={40}
                height={40}
                alt="profile image"
                className="w-10 h-10 rounded-full object-cover bg-gray-200"
              />
              <span className="font-medium">
                {comment.user.name && comment.user.surname
                  ? comment.user.name + " " + comment.user.surname
                  : comment.user.username}
              </span>
            </div>
            <div>
              <Image
                src="/icons/more.png"
                width={20}
                height={20}
                alt="more options"
                className="cursor-pointer"
              />
            </div>
          </div>
          <div>
            <p className="mt-6">{comment.desc}</p>
            <div className="flex gap-8 mt-4">
              <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-xl cursor-pointer">
                <Image
                  src="/icons/like.png"
                  width={20}
                  height={20}
                  alt="like image"
                />
                <span className="text-gray-500">
                  0 <span className="hidden md:inline">Likes</span>
                </span>
              </div>
              <div>
                <span className="text-gray-500 cursor-pointer">Reply</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;