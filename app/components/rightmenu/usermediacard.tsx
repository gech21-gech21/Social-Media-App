// components/rightmenu/usermediacard.tsx
import Link from "next/link";
import React from "react";
import { User } from "@prisma/client"; // Removed unused Post import
import prisma from "@/lib/client";
import ClientImage from "@/app/components/ClientImage";

const UserMediaCard = async ({ user }: { user: User | null | undefined }) => {
  // Check if user is undefined or null
  if (!user || !user.id) {
    return (
      <div className="shadow-lg rounded-2xl p-4 bg-white">
        <div className="flex justify-between items-center font-medium mb-4">
          <span className="text-gray-500">User Media</span>
        </div>
        <div className="text-center text-gray-500 py-4">User not available</div>
      </div>
    );
  }

  try {
    // Fetch posts with images - Use a different approach
    const allPosts = await prisma.post.findMany({
      where: {
        userId: user.id,
      },
      take: 12, // Get more posts to filter
      orderBy: { createdAt: "desc" },
    });

    // Filter posts that have images (client-side filtering)
    const postMedia = allPosts
      .filter((post) => post.img && post.img.trim() !== "")
      .slice(0, 8);

    return (
      <div className="shadow-lg rounded-2xl p-4 bg-white">
        <div className="flex justify-between items-center font-medium mb-4">
          <span className="text-gray-500">User Media</span>
          <Link
            className="text-blue-500 text-sm"
            href={`/user/${user.username}/media`}
          >
            See all
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {postMedia.length > 0 ? (
            postMedia.map((post) => (
              <div className="relative aspect-square" key={post.id}>
                <ClientImage
                  alt={`Media post by ${user.name || user.username}`}
                  src={post.img || "/icons/noimage.png"}
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 20vw, 10vw"
                />
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center text-gray-500 py-4">
              No media found
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching user media:", error);
    return (
      <div className="shadow-lg rounded-2xl p-4 bg-white">
        <div className="flex justify-between items-center font-medium mb-4">
          <span className="text-gray-500">User Media</span>
        </div>
        <div className="text-center text-gray-500 py-4">
          Error loading media
        </div>
      </div>
    );
  }
};

export default UserMediaCard;
