import React from "react";
import Feed from "../../components/feed";
import LeftMenu from "@/app/components/leftMenu/LeftMenu";
import Rightmenu from "../../components/Rightmenu";

const page = () => {
  return (
    <div>
      <div className="w-full max-w-screen-xl flex gap-4 px-2">
        <div className="hidden md:block w-[20%]">
          <LeftMenu type="home" />
        </div>

        <div className="w-full md:w-[50%]">
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
