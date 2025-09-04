import Rightmenu from "../components/rightmenu/Rightmenu";
import Updateuser from "../components/rightmenu/updateuser";
import Profilecard from "../components/leftMenu/ProfileCard";
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";

const page = async () => {
  const { userId } = await auth();

  if (!userId) {
    return <div>No user ID found.</div>;
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
        <Updateuser user={user} />
        <Rightmenu user={user} /> {/* Pass user to Rightmenu if it needs it */}
      </div>
    </div>
  );
};

export default page;
