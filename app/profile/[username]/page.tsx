import Feed from "@/app/components/feed";
import LeftMenu from "@/app/components/leftMenu/LeftMenu";
import Prisma from "../../../lib/client";
import Rightmenu from "../../components/Rightmenu";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: { username: string } }) => {
  // Await the params before accessing its properties
  const { username } = await params;

  const user = await Prisma.user.findFirst({
    where: { username },
    include: {
      _count: { select: { followers: true, followings: true, posts: true } },
    },
  });

  if (!user) return notFound();

  const { userId: currentUserId } = await auth(); // Get current user's ID on the server

  let isBlocked = false;
  if (currentUserId) {
    const res = await Prisma.block.findFirst({
      where: {
        blockerId: user.id,
        blockedId: currentUserId,
      },
    });
    if (res) isBlocked = true;
  }

  if (isBlocked) return notFound();

  return (
    <div className="">
      <div className="w-full max-w-screen-xl flex gap-4 px-2">
        <div className="hidden md:block mt-4 w-[20%]">
          <LeftMenu type="home" />
        </div>
        <div className="w-full md:w-[50%]">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full h-64 mt-4 relative">
              <Image
                src={user.cover || "/icons/backgroundprofile.jpg"}
                alt=""
                fill
                className="rounded-md object-cover"
              />
              <Image
                src={user.avatar || "/icons/profileimage.jpg"}
                alt=""
                width={20}
                height={20}
                className="object-cover w-15 h-15 left-0 right-0 m-auto -bottom-8 ring-4 ring-white absolute rounded-full"
              />
            </div>
            <h1 className="mt-8 mb-2 text-2xl font-medium">
              {user.name && user.surname
                ? user.name + " " + user.surname
                : user.username}
            </h1>
            <div className="flex items-center justify-center gap-12 mb-4">
              <div className="flex flex-col items-center">
                <span className="font-medium">{user._count.posts}</span>
                <span className="text-sm">Posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium">{user._count.followers}</span>
                <span className="text-sm">Followers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium">{user._count.followings}</span>
                <span className="text-sm">Following</span>
              </div>
            </div>
          </div>
          <Feed />
        </div>
        <div className="hidden md:block w-[30%]">
          <Rightmenu user={user} />
        </div>
      </div>
    </div>
  );
};

export default Page;
