import Link from "next/link";
import React from "react";
import Image from "next/image"
const userinfocard = ({ userId }: { userId: string }) => {
  return (
    <div>
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500 ">user information</span>
        <Link className="text-blue-500 text-sm " href="/">
          see all
        </Link>
      </div>
      <div className="flex flex-col gap-4 text-gray-500">
        <div className="flex items-center gap-2 ">
          <span className="text-xl text-black">Kebed Ayaliwu</span>
          <span className="text-sm">@ayliwukebed23</span>
        </div>
        <p>
          Absolutely loving this vibe! Your creativity shines through every
          detail!🌟
        </p>
      </div>
      <div className="flex gap-4 flex-col">
        <Image src="/icons/location" width={20} height={15} alt="location icon"/>
        <span></span>
      </div>
    </div>
  );
};

export default userinfocard;
