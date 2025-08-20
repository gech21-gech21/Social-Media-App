"use client";

import Image from "next/image";

export default function Navbar() {
  return (
    <div className="flex  ">
      <div>
        {" "}
        <h1>S.media app</h1>
      </div>
        <div></div>
      <div>
        <Image
          className=""
          width={34}
          height={34}
          alt=""
          src="/icons/bars.svg"
        ></Image>
      </div>
    
    </div>
  );
}
