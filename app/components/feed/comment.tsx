import React from "react";
import CommentList from "./CommentList";

const CommentWrapper = ({ postId }: { postId: string }) => {
  return (
    <div>
      <CommentList postId={postId} />
    </div>
  );
};

export default CommentWrapper;
