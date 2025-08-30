import Link from "next/link";
import React from "react";
import Image from "next/image";
import { User } from "@clerk/nextjs/server";
const UserInfoCard = ({ user }: { user: User }) => {
  return (
    <div className=" bg-white shadow-lg  rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500 ">user information</span>
        <Link className="text-blue-500 text-sm " href="/">
          see all
        </Link>
      </div>
      <div className="flex flex-col gap-4 text-gray-500">
        <div className="flex items-center gap-6 ">
          <span className="text-sm text-black ">Kebede Ayaliwu</span>
          <span className="text-sm">@ayliwukebede23</span>
        </div>
        <p>
          Absolutely loving this vibe! Your creativity shines through every
          detail!🌟
        </p>
      </div>

      <div className="flex gap-4 ">
        <Image
          src="/icons/location.png"
          width={20}
          height={15}
          alt="location icon"
        />
        <span>
          living in <i>Addis Ababa</i>
        </span>
      </div>
      <div className="flex gap-4 ">
        <Image
          src="/icons/location.png"
          width={20}
          height={15}
          alt="location icon"
        />
        <span>
          school at<i>Addis Ababa</i>
        </span>
      </div>
      <div className="flex gap-4  ">
        <Image
          src="/icons/location.png"
          width={20}
          height={15}
          alt="location icon"
        />
        <span>
          work at <i>Addis Ababa</i>
        </span>
      </div>
      <div>
        <div className="flex gap-1">
          <Image
            src="/icons/location.png"
            width={10}
            height={15}
            alt="location icon"
          />
          <Link href="/" className="text-blue-500 ">
            kebede.dev
          </Link>
          <span className="ml-3 text-sm bg-green-200 px-1">
            joined nov 2024
          </span>
        </div>
        <div className="bg-blue-600 mt-6 text-white text-center rounded-2xl w-full p-2">
          following
        </div>
        <div className="text-red-400 cursor-pointer ml-35 mt-4">Block user</div>
      </div>
    </div>
  );
};

export default UserInfoCard;
