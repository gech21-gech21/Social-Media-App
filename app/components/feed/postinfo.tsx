"use client";
import Image from "next/image";
import React, { useState } from "react";
import { deletePost, getPost, updatePost } from "../../../lib/action";
import { useRouter } from "next/navigation";

const PostInfo = ({ postId }: { postId: number }) => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDesc, setEditDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deletePost(postId);
      setOpen(false);
      // Refresh the page to see changes
      router.refresh();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      const post = await getPost(postId);
      setEditDesc(post.desc);
      setIsEditing(true);
    } catch (error) {
      console.error("Error loading post for edit:", error);
      alert("Failed to load post for editing");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editDesc.trim()) {
      alert("Description cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await updatePost(postId, editDesc);
      setIsEditing(false);
      setOpen(false);
      // Refresh to see updated post
      router.refresh();
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditDesc("");
  };

  return (
    <div className="relative">
      <Image
        src="/icons/more.png"
        width={20}
        height={20}
        alt="more options"
        className="cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      />

      {open && !isEditing && (
        <div className="absolute top-4 right-0 bg-white p-4 rounded-lg flex flex-col w-32 gap-2 text-xs shadow-lg z-30">
          <button
            type="button"
            className="text-left cursor-pointer hover:text-green-600"
            onClick={handleEdit}
            disabled={loading}
          >
            {loading ? "Loading..." : "Edit"}
          </button>

          <button
            type="button"
            className="text-left text-red-500 hover:text-red-700"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}

      {isEditing && (
        <div className="absolute top-4 right-0 bg-white p-4 rounded-lg flex flex-col w-64 gap-3 text-xs shadow-lg z-30">
          <h3 className="font-semibold">Edit Post</h3>

          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="Edit your post description..."
            className="border border-gray-300 rounded-md p-2 resize-none h-20"
            disabled={loading}
          />

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostInfo;
