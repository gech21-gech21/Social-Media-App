import React from "react";
import Ad from "./Ad";
import UserInfoCard from "./userinfocard";
import UserMediaCard from "./usermediacard";
import Birthday from "./Birthday";
import FriendRequests from "./FriendRequests";

const Rightmenu = ({ userId }: { userId?: string }) => {
  return (
    <div className="flex flex-col gap-6">
      {userId ? (
        <>
          <UserInfoCard userId={userId} />
          <UserMediaCard userId={userId} />
        </>
      ) : null}

      
      <FriendRequests />
      <Birthday />
      <Ad size="sm" />
    </div>
  );
};

export default Rightmenu;
