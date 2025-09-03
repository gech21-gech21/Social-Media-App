"use client";

import Image from "next/image";
import React from "react";
import CommentList from "./CommentList";
import prisma from "@/lib/client";
import { Comment, User } from "@prisma/client";

type CommentWithUser = Comment & { user: User }; // Define type for comments with user info

const CommentWrapper = async ({ postId }: { postId: string }) => {
  // Convert postId to number
  const postIdNumber = parseInt(postId, 10);

  // Fetch comments from Prisma
  const comments: CommentWithUser[] = await prisma.comment.findMany({
    where: {
      postId: postIdNumber, // Use postId as a number
    },
    include: { user: true }, // Ensure user info is included
  });

  return (
    <div>
      <CommentList comments={comments} postId={postId} /> {/* Pass comments prop */}
    </div>
  );
};

export default CommentWrapper;