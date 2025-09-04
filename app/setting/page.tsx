import React from "react";
import Link from "next/link";
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
        <Rightmenu />
      </div>
    </div>
  );
};

export default page;
