import Feed from "./components/feed/feed";
import LeftMenu from "@/app/components/leftMenu/LeftMenu";
import Rightmenu from "./components/rightmenu/Rightmenu";
import Addpost from "./components/addpost";
import Userinfcard from "./components/rightmenu/userinfocard";
import Story from "./components/Stories";
import { User } from "@prisma/client";
export default function Home() {
  return (
    <div className="flex justify-center w-full pt-6">
      
      <div className="w-full max-w-screen-xl flex gap-4 px-2">
        <div className="hidden md:block w-[20%]">
          <LeftMenu type="home" />
          
        
        </div>

        <div className="w-full md:w-[50%]">
          <div className="w-full shadow-2xl m-2 ">
            {" "}
            <Story />
          </div>
          <div className="">
            {" "}
            <Addpost />
          </div>
          <Feed />
        </div>

        <div className="hidden md:block w-[30%]">
          <Rightmenu />
         
        </div>
      </div>
    </div>
  );
}
