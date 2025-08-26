import React from "react";
import Feed from "../../components/feed";
import LeftMenu from "@/app/components/leftMenu/LeftMenu";
import Rightmenu from "../../components/Rightmenu";
import Image from "next/image";
const page = () => {
  return (
    <div className="">
      <div className="w-full max-w-screen-xl flex gap-4 px-2">
        <div className="hidden md:block mt-4 w-[20%]">
          <LeftMenu type="home" />
        </div>
        <div className="w-full md:w-[50%]">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full h-64 mt-4 relative">
              <Image
                src="/icons/bacgroudprofile.jpg"
                alt=""
                fill
                className=" rounded-md object-cover"
              ></Image>
              <Image
                src="/icons/profileimage.jpg"
                alt=""
                width={20}
                height={20}
                className="object-cover w-15 h-15 left-0 right-0 m-auto -bottom-8 ring-4 ring-white   absolute rounded-full"
              ></Image>
            </div>
            <h1 className="mt-8 mb-2 text-2xl  font-medium">
              Theshome Brehanu
            </h1>
            <div className=" flex items-center justify-center gap-12 mb-4">
              <div className="flex flex-col items-center  ">
                <span className="font-medium">154</span>
                <span className="text-sm">Posts</span>
              </div>
              <div className="flex flex-col items-center  ">
                <span className="font-medium">1.4k</span>
                <span className="text-sm">followers</span>
              </div>
              <div className="flex flex-col items-center  ">
                <span className="font-medium">1.5k</span>
                <span className="text-sm">following</span>
              </div>
            </div>
          </div>
          <Feed />
        </div>
        <div className="hidden md:block w-[30%]">
          <Rightmenu userId="test" />
        </div>
      </div>
    </div>
  );
};
export default page;
