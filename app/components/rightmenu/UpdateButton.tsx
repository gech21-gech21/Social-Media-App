"use client";
import React from "react";
import { useFormStatus } from "react-dom";

const UpdateButton = () => {
  const { pending } = useFormStatus();
  
  return (
    <button
      className="bg-blue-500 p-2 mt-2 rounded-md text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
      type="submit"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? "Updating..." : "Update"}
    </button>
  );
};

export default UpdateButton;