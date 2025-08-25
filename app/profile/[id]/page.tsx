import Feed from "@/app/components/feed";
import LeftMenu from "@/app/components/leftMenu/LeftMenu";
import RightMenu from "@/app/components/Rightmenu";
import Image from "next/image";

const ProfilePage = ({ params }: { params: { username: string } }) => {
  const username = params.username;

  // Mocked user data
  const user = {
    id: "1",
    username: username,
    name: "John",
    surname: "Doe",
    avatar: "/icons/noAvatar.png",
    cover: "/icons/noCover.png",
    _count: {
      posts: 12,
      followers: 128,
      followings: 89,
    },
  };

  return (
    <div className="flex gap-6 pt-6">
      {/* LEFT MENU */}
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="profile" />
      </div>

      {/* MAIN CONTENT */}
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          {/* PROFILE HEADER */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-full h-64 relative">
              <Image
                src={user.cover}
                alt={`${user.username} cover`}
                fill
                className="rounded-md object-cover"
              />
              <Image
                src={user.avatar}
                alt={`${user.username} avatar`}
                width={128}
                height={128}
                className="w-32 h-32 rounded-full absolute left-0 right-0 m-auto -bottom-16 ring-4 ring-white object-cover"
              />
            </div>
            <h1 className="mt-20 mb-4 text-2xl font-medium">
              {user.name && user.surname
                ? `${user.name} ${user.surname}`
                : user.username}
            </h1>

            {/* COUNTS */}
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

          {/* FEED */}
          <Feed username={user.username} />
        </div>
      </div>

      {/* RIGHT MENU */}
      <div className="hidden lg:block w-[30%]">
        <RightMenu userId={user.id} />
      </div>
    </div>
  );
};

export default ProfilePage;
