import Link from "next/link";
import React from "react";
import Image from "next/image";
const FriendRequests = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-full text-sm flex flex-col gap-4  ">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500 ">Friend Requests</span>
        <Link className="text-blue-500 text-sm " href="/">
          see all
        </Link>
      </div>
      {/* user */}
      <div className="flex items-center justify-center gap-12">
        <div className=" flex">
          <Image
            src="/icons/background.png"
            alt="background image"
            width={20}
            height={15}
            className="rounded-full object-center h-8 w-8"
          ></Image>
          <span>Teshome Brihanu</span>
        </div>

        <div className="flex gap-2">
          <Image
            src="/icons/accept.png"
            className="cursor-pointer"
            alt="background image"
            width={10}
            height={10}
          ></Image>{" "}
          <Image
            src="/icons/rejects.png"
            alt="background image"
            width={10}
            className="cursor-pointer"
            height={10}
          ></Image>
        </div>
      </div>
      <div className="flex gap-12 items-center justify-center">
        <div className=" flex">
          <Image
            src="/icons/background.png"
            alt="background image"
            width={20}
            height={15}
            className="rounded-full object-center h-8 w-8"
          ></Image>
          <span>Teshome Brihanu</span>
        </div>

        <div className="flex gap-2">
          <Image
            src="/icons/accept.png"
            className="cursor-pointer"
            alt="background image"
            width={10}
            height={10}
          ></Image>{" "}
          <Image
            src="/icons/rejects.png"
            className="cursor-pointer"
            alt="background image"
            width={10}
            height={10}
          ></Image>
        </div>
      </div>
      <div className="flex gap-12 items-center justify-center">
        <div className=" flex">
          <Image
            src="/icons/background.png"
            alt="background image"
            width={20}
            height={15}
            className="rounded-full object-center h-8 w-8"
          ></Image>
          <span>Teshome Brihanu</span>
        </div>

        <div className="flex gap-2">
          <Image
            src="/icons/accept.png"
            alt="background image"
            width={10}
            className="cursor-pointer"
            height={10}
          ></Image>{" "}
          <Image
            src="/icons/rejects.png"
            alt="background image"
            width={10}
            height={10}
            className="cursor-pointer"
          ></Image>
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default FriendRequests;
