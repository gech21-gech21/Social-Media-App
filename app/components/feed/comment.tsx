"use client";

import Image from "next/image";
import React from "react";
import CommentList from "./CommentList";
import prisma from "@/lib/client";
import { Comment, User } from "@prisma/client";

type CommentWithUser = Comment & { user: User }; 

const CommentWrapper = async ({ postId }: { postId: string }) => {

  const postIdNumber = parseInt(postId, 10);

 
  const comments: CommentWithUser[] = await prisma.comment.findMany({
    where: {
      postId: postIdNumber, 
    },
    include: { user: true }, 
  });

  return (
    <div>
      <CommentList comments={comments} postId={postId} /> 
    </div>
  );
};

export default CommentWrapper;