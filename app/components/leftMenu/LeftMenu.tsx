import Link from "next/link";
import Image from "next/image";
import ProfileCard from "./ProfileCard";
import Ad from "../Ad";

type LeftMenuProps = {
  type: "home" | "profile";
};

const menuItems = [
  { href: "/", icon: "/posts.png", label: "My Posts" },
  { href: "/", icon: "/activity.png", label: "Activity" },
  { href: "/", icon: "/market.png", label: "Marketplace" },
  { href: "/", icon: "/events.png", label: "Events" },
  { href: "/", icon: "/albums.png", label: "Albums" },
  { href: "/", icon: "/videos.png", label: "Videos" },
  { href: "/", icon: "/news.png", label: "News" },
  { href: "/", icon: "/courses.png", label: "Courses" },
  { href: "/", icon: "/lists.png", label: "Lists" },
  { href: "/", icon: "/settings.png", label: "Settings" },
];

const LeftMenu = ({ type }: LeftMenuProps) => {
  return (
    <div className="flex flex-col gap-6">
      {type === "home" && <ProfileCard />}
      <div className="p-4 bg-white rounded-lg shadow-md text-sm text-gray-500 flex flex-col gap-2">
        {menuItems.map((item, i) => (
          <div key={item.label}>
            <Link
              href={item.href}
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"
            >
              <Image src={item.icon} alt={item.label} width={20} height={20} />
              <span>{item.label}</span>
            </Link>
            {i !== menuItems.length - 1 && (
              <hr className="border-t border-gray-100 w-36 self-center" />
            )}
          </div>
        ))}
      </div>
      <Ad size="sm" />
    </div>
  );
};

export default LeftMenu;
