import Image from "next/image";
import React from "react";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
const addpost = () => {
  const {userId}=auth()
  console.log(userId)
  const testaction=async (FormData:FormData)=>{
   "use server"
   if (!userId)return;
    const desc=FormData.get(desc)as string
    try{
      prisma.post.create({
        data:{
          userId:userId,
          desc:desc}})
    }catch(err){console.log(err)}
  }
  return (
    <div className="  bg-white rounded-lg flex gap-4 justify-between pt-4 text-sm">
      <Image
        alt=""
        src="/icons/background.png"
        height={17}
        width={15}
        className="w-12 h-12 object-cover rounded-full"
      ></Image>

      {/* text input */}
      <div className="flex-1 cursor-pointer ">
        <form action={testaction} className="flex gap-4  ">
          <textarea
            placeholder="What is on mind"
            name="desc"
            id=""
            className="bg-gray-300 w-[95%] rounded-2xl pl-3 pt-5 focus:outline-none focus:border-none"
          ></textarea>

<button>post</button>
        </form>


        <div className="flex items-center justify-between mt-4 text-gray-400 flex-wrap">
          <div className="flex cursor-pointer gap-1">
            <Image
              alt=""
              src="/icons/photoicone.png"
              height={17}
              width={15}
              className=""
            ></Image>
            <span>Photo</span>
          </div>
          <div className="flex  cursor-pointer gap-1">
            <Image
              alt=""
              src="/icons/vedio.png"
              height={17}
              width={15}
              className=" "
            ></Image>{" "}
            <span>Vedio</span>
          </div>
          <div className="flex cursor-pointer  gap-1">
            <Image
              alt=""
              src="/icons/poll.png"
              height={17}
              width={15}
              className=""
            ></Image>{" "}
            <span>Poll</span>
          </div>
          <div className="flex  gap-1 cursor-pointer">
            <Image
              alt=""
              src="/icons/event.png"
              height={17}
              width={15}
              className=""
            ></Image>{" "}
            <span>Event</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default addpost;
