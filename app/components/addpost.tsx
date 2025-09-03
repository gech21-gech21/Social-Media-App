"use client"

import Image from "next/image";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { CldUploadWidget } from "next-cloudinary";
import AddpostButton from "../components/AddpostButton";
import { addPost } from "@/lib/action";

const AddPost = () => {
  const { isLoaded, user } = useUser();
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState<any>();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (formData: FormData) => {
    addPost(formData, img?.secure_url || "");
  };

  return (
    <div className="bg-white rounded-lg flex gap-4 justify-between pt-4 text-sm p-4 mb-4 shadow-sm">
      <Image
        alt="User avatar"
        src={user?.imageUrl || "/icons/background.png"}
        height={48}
        width={48}
        className="w-12 h-12 object-cover rounded-full"
      />

      <div className="flex-1">
        <form action={handleSubmit} className="flex flex-col gap-4">
          <textarea
            placeholder="What is on your mind?"
            name="desc"
            required
            className="bg-gray-100 w-full rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            rows={3}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
          <AddpostButton />
        </form>
        
        <div className="flex items-center justify-between mt-2 text-gray-500 flex-wrap">
          <CldUploadWidget 
            uploadPreset="newsocialmedia"
            onSuccess={(result: any, widget: any) => {
              setImg(result.info);
              widget.close();
            }}
          >
            {({ open }) => (
              <div 
                className="flex cursor-pointer gap-1 hover:text-blue-500 transition-colors" 
                onClick={() => open()}
              >
                <Image
                  alt="Photo icon"
                  src="/icons/photoicone.png"
                  height={17}
                  width={15}
                />
                <span>Photo</span>
              </div>
            )}
          </CldUploadWidget>
          
          <div className="flex cursor-pointer gap-1 hover:text-blue-500 transition-colors">
            <Image
              alt="Video icon"
              src="/icons/vedio.png"
              height={17}
              width={15}
            />
            <span>Video</span>
          </div>
          <div className="flex cursor-pointer gap-1 hover:text-blue-500 transition-colors">
            <Image
              alt="Poll icon"
              src="/icons/poll.png"
              height={17}
              width={15}
            />
            <span>Poll</span>
          </div>
          <div className="flex gap-1 cursor-pointer hover:text-blue-500 transition-colors">
            <Image
              alt="Event icon"
              src="/icons/event.png"
              height={17}
              width={15}
            />
            <span>Event</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;