import React from "react";
import Ad from "./Ad";
import UserInfoCard from "./userinfocard";
import UserMediaCard from "./usermediacard";
import Birthday from "./Birthday";
import FriendRequests from "./FriendRequests";
import { User } from "@clerk/nextjs/server";

const Rightmenu = ({ user }: { user?: User }) => {
  return (
    <div className="flex flex-col gap-6">
      {user ? (
        <>
          <UserInfoCard user={user} />
          <UserMediaCard user={user} />
        </>
      ) : null}

      <FriendRequests />
      <Birthday />
      <Ad size="sm" />
    </div>
  );
};

export default Rightmenu;
