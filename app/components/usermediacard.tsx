import Link from "next/link";
import React from "react";

const usermediacard = ({ userId }: { userId: string }) => {
  return (
    <div>
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500 ">user media</span>
        <Link className="text-blue-500 text-sm " href="/">
          see all
        </Link>
      </div>
    </div>
  );
};

export default usermediacard;
