import Rightmenu from "../components/rightmenu/Rightmenu";
import Profilecard from "../components/leftMenu/ProfileCard";
import UserInfoCard from "../components/rightmenu/userinfocard";
import UserMediaCard from "../components/rightmenu/usermediacard";
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";

const page = async () => {
  const { userId } = await auth();

  if (!userId) {
    return <div>No user found.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <div>
        <Profilecard />

        <Rightmenu user={user} />
        <UserInfoCard userId={user.id} />
        <UserMediaCard user={user} />
      </div>
    </div>
  );
};

export default page;
