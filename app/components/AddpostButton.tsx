"use Client";
import React from "react";
import { useFormStatus } from "react-dom";

const AddpostButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      className="bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed p-2 mt-2 text-white"
      disabled={pending}
    >
      {pending ? (
        <div className="flex items-center gap-2">
          {" "}
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          Sending
        </div>
      ) : (
        "send"
      )}
    </button>
  );
};

export default AddpostButton;
