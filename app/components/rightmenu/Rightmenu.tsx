
import Ad from "../../components/Ad";

import Birthday from "../rightmenu/Birthday";
import FriendRequests from "../rightmenu/FriendRequests";
import { User } from "@prisma/client";
const Rightmenu = ({ user }: { user?: User }) => {
  return (
    <div className="flex flex-col gap-6">
      <FriendRequests />

      <Birthday />
      <Ad size="sm" />
    </div>
  );
};

export default Rightmenu;
