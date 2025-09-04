"use client";
import React, { Suspense } from "react";
import Image from "next/image";
import PostInteraction from "../feed/postInteraction";
import PostInfo from "./postinfo";
import { useUser } from "@clerk/nextjs";
import CommentWrapper from "../feed/CommentWrapper";

import  {ApiPostType} from "../../../lib/types/index"
 

const Post = ({ post }: { post: ApiPostType }) => {
  const { user: currentUser } = useUser();
  const userId = currentUser?.id;

  return (
    <div className="w-full p-4">
      {/* User */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image
            src={post.user.avatar || "/icons/profile.png"}
            width={40}
            height={40}
            alt="profile image"
            className="w-10 h-10 rounded-full object-cover bg-gray-200"
          />
          <span className="font-medium">
            {post.user.name && post.user.surname
              ? `${post.user.name} ${post.user.surname}`
              : post.user.username}
          </span>
        </div>
        <div>{userId === post.user.id && <PostInfo postId={post.id} />}</div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-4">
        {post.img && (
          <div className="w-full min-h-96 relative mt-4">
            <div className="w-full h-64 md:h-96 relative">
              <Image
                src={post.img}
                fill
                alt="background"
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        )}
        <p className="mt-4 text-gray-700">{post.desc}</p>

        {/* Interaction */}
        <Suspense fallback="Loading...">
          <PostInteraction
            likes={post.likes.map((like) => like.userId)}
            commentNumber={post._count.comments}
          />
          <div className="mt-6">
            <CommentWrapper postId={post.id} />
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default Post;