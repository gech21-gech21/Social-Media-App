import Image from "next/image";
import StoryList from "./StoryList";

// Dummy stories (replace with props, API call, or static data later)

interface UserType {
  id: string;
  username: string;
  avatar: string;
  name?: string;
}

interface StoryType {
  id: string | number;
  img: string;
  createdAt: Date;
  expiresAt: Date;
  userId: string;
  user: UserType;
}

const dummyStories: StoryType[] = [
  {
    id: "1",
    userId: "123",
    user: {
      id: "123",
      username: "Abeni",
      avatar: "/default-avatar.png",
    },
    img: "/sample-story.jpg",   // ✅ now matches StoryType
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
  },
  {
    id: "2",
    userId: "456",
    user: {
      id: "456",
      username: "Bini",
      avatar: "/default-avatar.png",
    },
    img: "/sample-story2.jpg",
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2),
  },
];


const Stories = () => {
  // Simulate "current logged-in user"
  const currentUserId = "123";

  return (
    <div className="p-4 bg-white rounded-lg shadow-md overflow-scroll text-xs scrollbar-hide">
      <div className="flex gap-8 w-max">
        <StoryList stories={dummyStories} userId={currentUserId} />
      </div>
    </div>
  );
};

export default Stories;
