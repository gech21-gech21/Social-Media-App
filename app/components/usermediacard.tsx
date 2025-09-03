import Link from "next/link";
import React from "react";
import Image from "next/image";

const UserMediaCard = ({ userId }: { userId: string }) => {
  return (
    <div className="shadow-lg rounded-2xl p-4 bg-white">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">user media</span>
        <Link className="text-blue-500 text-sm" href="/">
          see all
        </Link>
      </div>
      <div className="flex flex-wrap gap-4 justify-between">
        <Image
          alt=""
          src="/icons/background.png"
          width={80}
          height={50}
          className="object-center rounded-md"
        />
        <Image
          alt=""
          src="/icons/background.png"
          width={80}
          height={50}
          className="object-center rounded-md"
        />
        <Image
          alt=""
          src="/icons/background.png"
          width={80}
          height={50}
          className="object-center rounded-md"
        />
        <Image
          alt=""
          src="/icons/background.png"
          width={80}
          height={50}
          className="object-center rounded-md"
        />
        <Image
          alt=""
          src="/icons/background.png"
          width={80}
          height={50}
          className="object-center rounded-md"
        />
        <Image
          alt=""
          src="/icons/background.png"
          width={80}
          height={50}
          className="object-center rounded-md"
        />
      </div>
    </div>
  );
};

export default UserMediaCard;
