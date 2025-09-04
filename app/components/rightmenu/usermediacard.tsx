import Link from "next/link";
import React from "react";
import Image from "next/image";
import { User, Post } from "@prisma/client";
import prisma from "@/lib/client";

// Define a type for posts with image
interface PostWithImage extends Post {
  img: string;
}

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
    // Fetch posts with images
    const postMedia = (await prisma.post.findMany({
      where: {
        userId: user.id,
        img: {
          not: "", // Ensure img is not an empty string
        },
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    })) as PostWithImage[];

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
                <Image
                  alt={`Media post by ${user.name || user.username}`}
                  src={post.img}
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 20vw, 10vw"
                  // REMOVED: onError event handler (not allowed in Server Components)
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
