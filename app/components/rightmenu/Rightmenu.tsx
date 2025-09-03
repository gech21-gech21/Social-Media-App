import React, { Suspense } from "react";
import Ad from "../../components/Ad";
import UserInfoCard from "../rightmenu/userinfocard"
import UserMediaCard from "../rightmenu/usermediacard"; // Ensure proper casing
import Birthday from "../rightmenu/Birthday";
import FriendRequests from "../rightmenu/FriendRequests";
import { User } from "@prisma/client";
const Rightmenu = ({user}:{user?:User}) => {
  return (
    <div className="flex flex-col gap-6">
      {user?(<>  
      <Suspense fallback="loading...">
       <UserInfoCard user ={user}/></Suspense>
            <Suspense fallback="loading..."><UserMediaCard user={user}/></Suspense>
      </>):null
}
      <FriendRequests />

      <Birthday />
      <Ad size="sm" />
    </div>
  );
};

export default Rightmenu;