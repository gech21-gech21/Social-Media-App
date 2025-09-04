import Feed from "@/app/components/feed/feed";
import LeftMenu from "@/app/components/leftMenu/LeftMenu";
import prisma from "../../../lib/client";
import Rightmenu from "../../components/rightmenu/Rightmenu";
import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import UserInfoCard from "@/app/components/rightmenu/userinfocard";
import UserMediaCard from "@/app/components/rightmenu/usermediacard";

interface PageProps {
  params: Promise<{ username: string }>;
}

const ProfilePage = async (props: PageProps) => {
  try {
    const params = await props.params;
    const username = params.username;

    const { userId: currentUserId } = await auth();

    const user = await prisma.user.findFirst({
      where: { username },
      include: {
        _count: {
          select: {
            followers: true,
            followings: true,
            posts: true,
          },
        },
      },
    });

    if (!user) return notFound();
    let isBlocked = false;
    if (currentUserId && user.id) {
      const blockRelation = await prisma.block.findFirst({
        where: {
          OR: [
            {
              blockerId: user.id,
              blockedId: currentUserId,
            },
            {
              blockerId: currentUserId,
              blockedId: user.id,
            },
          ],
        },
      });
      isBlocked = !!blockRelation;
    }

    if (isBlocked) return notFound();

    return (
      <div className="">
        <div className="w-full max-w-screen-xl flex gap-4 px-2 mx-auto">
          <div className="hidden md:block mt-4 w-[20%]">
            <LeftMenu type="home" />
          </div>
          <div className="w-full md:w-[50%]">
            <div className="flex flex-col items-center justify-center">
              <div className="w-full h-64 mt-4 relative">
                <Image
                  src={user.cover || "/icons/bacgroudprofile.jpg"}
                  alt="Cover image"
                  fill
                  className="rounded-md object-cover"
                  priority
                />
                <Image
                  src={user.avatar || "/icons/profileimage.jpg"}
                  alt="Profile image"
                  width={120}
                  height={120}
                  className="object-cover w-30 h-30 left-0 right-0 m-auto -bottom-12 ring-4 ring-white absolute rounded-full"
                  priority
                />
              </div>
              <h1 className="mt-14 mb-2 text-2xl font-medium">
                {user.name && user.surname
                  ? `${user.name} ${user.surname}`
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
            <Feed username={user.username} />
          </div>
          <div className="hidden md:block w-[30%]">
            {user.id && (
              <>
                <UserInfoCard userId={user.id} />
                <UserMediaCard user={user} />
                <Rightmenu user={user} />
              </>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in ProfilePage:", error);
    return notFound();
  }
};

export default ProfilePage;
