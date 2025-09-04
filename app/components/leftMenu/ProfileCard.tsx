// components/leftMenu/ProfileCard.tsx
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const ProfileCard = async () => {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        _count: {
          select: { followers: true },
        },
        followers: {
          take: 3, // Only get the first 3 followers for the avatar display
          include: {
            follower: {
              // Assuming your follower relation returns the follower user object
              select: {
                avatar: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!user) return null;

    return (
      <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-6">
        {/* Cover + Avatar */}
        <div className="h-20 relative">
          <Image
            src={user.cover || "/icons/backgroundprofile.jpg"} // Fixed typo
            alt="Cover image"
            fill
            className="rounded-md object-cover"
          />
          <Image
            src={user.avatar || "/icons/profile.png"} // Fixed: avatar should be the profile image
            alt="Profile image"
            width={48}
            height={48}
            className="rounded-full object-cover w-12 h-12 absolute left-0 right-0 m-auto -bottom-6 ring-2 ring-white z-10"
          />
        </div>

        {/* Info */}
        <div className="h-20 flex flex-col gap-2 items-center mt-4">
          {" "}
          {/* Added margin-top */}
          <span className="font-semibold">
            {user.name && user.surname
              ? `${user.name} ${user.surname}`
              : user.username}
          </span>
          {/* Followers */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {user.followers.slice(0, 3).map((follower, i) => (
                <Image
                  key={i}
                  src={follower.follower?.avatar || "/icons/profile.png"}
                  alt={`${follower.follower?.username || "follower"} avatar`}
                  width={16}
                  height={16}
                  className="rounded-full object-cover w-4 h-4 border border-white"
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {user._count.followers} Followers
            </span>
          </div>
          {/* Button */}
          <Link href={`/profile/${user.username}`}>
            <button className="bg-blue-500 hover:bg-blue-600 transition text-white text-xs px-3 py-1.5 rounded-md">
              My Profile
            </button>
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export default ProfileCard;
