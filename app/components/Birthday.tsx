import React from "react";
import Image from "next/image";
import Link from "next/link";
const Birthday = () => {
  return (
    <div className="p-4 bg-white shadow-lg rounded-lg text-sm  flex flex-col gap-4">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-400 ">Birthdays</span>
      </div>
      {/* user */}
      <div className="flex items-center justify-center gap-5">
        <div className=" flex">
          <Image
            src="/icons/background.png"
            alt="background image"
            width={20}
            height={15}
            className="rounded-full object-center h-8 w-8"
          ></Image>
          <span>Teshome Brihanu</span>
        </div>{" "}
        <div className="flex gap-3 justify-end ">
          <button className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md ">
            celebrate
          </button>
        </div>
      </div>
      {/* up coming */}
      <div className="p-4 bg-slate-100 rounded-lg flex  items-center gap-4">
        <Image
          src="/icons/gift.png"
          alt="gift image"
          width={24}
          height={15}
          className=""
        />
        <Link href="/" className="flex flex-col  gap-1  text-xs">
          <span className="text-gray-700 font-semibold">
            upcoming birthdays
          </span>
          <span className="text-gray-500">
            see other 20 have upcoming birthdays
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Birthday;
