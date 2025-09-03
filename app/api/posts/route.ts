import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";

// Define TypeScript interfaces for the response data
interface User {
  id: string;
  username: string;
  name: string | null;
  surname: string | null;
  avatar: string | null;
  // Add other user fields as needed
}

interface Like {
  userId: string;
}

interface Post {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  user: User;
  likes: Like[];
  _count: {
    comments: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    let posts: Post[] = [];

    if (username) {
      // Get posts for a specific user
      posts = (await prisma.post.findMany({
        where: {
          user: {
            username: username,
          },
        },
        include: {
          user: true,
          likes: {
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })) as Post[];
    } else if (userId) {
      // Get posts from users that the current user follows
      const following = await prisma.follower.findMany({
        where: {
          followerId: userId,
        },
        select: {
          followingId: true,
        },
      });

      const followingIds = following.map((f) => f.followingId);
      const ids = [userId, ...followingIds]; // Include user's own posts

      posts = (await prisma.post.findMany({
        where: {
          userId: {
            in: ids,
          },
        },
        include: {
          user: true,
          likes: {
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })) as Post[];
    }

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}

// Optional: Add POST method for creating new posts
export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const newPost = await prisma.post.create({
      data: {
        content,
        userId,
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}