// components/rightmenu/userinfocard.tsx
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Updateuser from "../rightmenu/updateuser";
import FriendRequests from "./FriendRequests";
import UserinfocardInteraction from "../rightmenu/userinfocardInteraction";

// Define the full user type that matches Prisma User model
interface User {
  id: string;
  name: string | null;
  surname: string | null;
  username: string;
  description: string | null;
  city: string | null;
  school: string | null;
  work: string | null;
  website: string | null;
  createdAt: Date;
  avatar: string | null;
  email: string;
  password: string;
  country: string | null;
  cover: string | null;
  updatedAt: Date;
}

const UserInfoCard: React.FC<{ userId: string }> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingSent, setIsFollowingSent] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/user/${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data.user);
        setCurrentUserId(data.currentUserId);
        setIsUserBlocked(data.isUserBlocked);
        setIsFollowing(data.isFollowing);
        setIsFollowingSent(data.isFollowingSent);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <div>Loading user information...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!user) {
    return null;
  }

  const createdAtDate = new Date(user.createdAt);
  const formattedDate = createdAtDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
          <UserinfocardInteraction
            userId={user.id}
            currentUserId={currentUserId}
            isUserBlocked={isUserBlocked}
            isFollowing={isFollowing}
            isFollowingSent={isFollowingSent}
          />
        </div>
      )}
      <FriendRequests />
    </div>
  );
};

export default UserInfoCard;
