import Image from "next/image";
import Link from "next/link";

const ProfileCard = () => {
  // Mock user data (replace with props or context later)
  const user = {
    username: "john_doe",
    name: "John",
    surname: "Doe",
    avatar: "/noAvatar.png",
    cover: "/noCover.png",
    followers: [
      { username: "alice", avatar: "/noAvatar.png" },
      { username: "bob", avatar: "/noAvatar.png" },
      { username: "charlie", avatar: "/noAvatar.png" },
    ],
    _count: { followers: 128 },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-6">
      {/* Cover + Avatar */}
      <div className="h-20 relative">
        <Image
          src={user.cover || "/noCover.png"}
          alt={`${user.username}'s cover`}
          fill
          className="rounded-md object-cover"
        />
        <Image
          src={user.avatar || "/noAvatar.png"}
          alt={`${user.username}'s avatar`}
          width={48}
          height={48}
          className="rounded-full object-cover w-12 h-12 absolute left-0 right-0 m-auto -bottom-6 ring-2 ring-white z-10"
        />
      </div>

      {/* Info */}
      <div className="h-20 flex flex-col gap-2 items-center">
        <span className="font-semibold">
          {user.name && user.surname
            ? `${user.name} ${user.surname}`
            : user.username}
        </span>

        {/* Followers */}
        <div className="flex items-center gap-4">
          <div className="flex -space-x-1">
            {user.followers.map((follower, i) => (
              <Image
                key={i}
                src={follower.avatar || "/noAvatar.png"}
                alt={`${follower.username}'s avatar`}
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
};

export default ProfileCard;
