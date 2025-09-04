import Link from "next/link";
import React from "react";
import Image from "next/image";
import prisma from "@/lib/client";
import Updateuser from "./updateuser";
import { auth } from "@clerk/nextjs/server";
import UserInfocardInteraction from "../rightmenu/userinfocardInteraction";

const UserInfoCard = async ({ userId }: { userId: string }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const createdAtDate = new Date(user.createdAt);
  const formattedDate = createdAtDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let isUserBlocked = false;
  let isFollowing = false;
  let isFollowingSent = false;

  const { userId: currentUserId } = await auth();

  if (currentUserId) {
    const blockedRes = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: user.id,
      },
    });
    isUserBlocked = !!blockedRes;

    const followRes = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: user.id,
      },
    });
    isFollowing = !!followRes;

    const followreq = await prisma.followRequest.findFirst({
      where: {
        senderId: currentUserId,
        receiverId: user.id,
      },
    });
    isFollowingSent = !!followreq;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">User information</span>
        {currentUserId === user.id ? (
          <Updateuser user={user} />
        ) : (
          <Link className="text-blue-500 text-sm" href="/">
            See all
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-4 text-gray-500 mt-4">
        <div className="flex items-center gap-6">
          <span className="text-sm text-black">
            {user.name && user.surname
              ? `${user.name} ${user.surname}`
              : user.username}
          </span>
          <span className="text-sm">@{user.username}</span>
        </div>
        {user.description && <p className="text-sm">{user.description}</p>}
      </div>

      <div className="mt-4 space-y-2">
        {user.city && (
          <div className="flex gap-4 items-center">
            <Image
              src="/icons/location.png"
              width={20}
              height={15}
              alt="location icon"
            />
            <span className="text-sm">
              Living in <i>{user.city}</i>
            </span>
          </div>
        )}

        {user.school && (
          <div className="flex gap-4 items-center">
            <Image
              src="/icons/school.png"
              width={20}
              height={15}
              alt="school icon"
            />
            <span className="text-sm">
              School at <i>{user.school}</i>
            </span>
          </div>
        )}

        {user.work && (
          <div className="flex gap-4 items-center">
            <Image
              src="/icons/work.png"
              width={20}
              height={15}
              alt="work icon"
            />
            <span className="text-sm">
              Work at <i>{user.work}</i>
            </span>
          </div>
        )}

        {user.website && (
          <div className="flex gap-2 items-center mt-2">
            <Image
              src="/icons/website.png"
              width={16}
              height={16}
              alt="website icon"
            />
            <Link
              href={user.website}
              className="text-blue-500 text-sm"
              target="_blank"
            >
              {user.website}
            </Link>
          </div>
        )}

        <div className="mt-2">
          <span className="text-sm bg-green-200 px-2 py-1 rounded">
            Joined {formattedDate}
          </span>
        </div>
      </div>

      {currentUserId && currentUserId !== user.id && (
        <div className="mt-4">
          <UserInfocardInteraction
            userId={user.id}
            currentUserId={currentUserId}
            isUserBlocked={isUserBlocked}
            isFollowing={isFollowing}
            isFollowingSent={isFollowingSent}
          />
        </div>
      )}
    </div>
  );
};

export default UserInfoCard;
