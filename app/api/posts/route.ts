import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";

// Define User, Like, and Post interfaces based on your schema
interface User {
  id: string;
  username: string;
  name: string | null;
  surname: string | null;
  avatar: string | null;
}

interface Like {
  userId: string;
}

interface Post {
  id: number; // Changed to number based on your schema
  content: string; // Ensure this matches your Post model
  img?: string; // Optional image field
  createdAt: Date;
  updatedAt: Date;
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
      posts = await prisma.post.findMany({
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
      });
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

      posts = await prisma.post.findMany({
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
      });
    }

    // Format posts to ensure they match the Post type
    const formattedPosts: Post[] = posts.map(post => ({
      id: post.id,
      content: post.content, // Ensure this field exists
      img: post.img,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      userId: post.userId,
      user: post.user,
      likes: post.likes,
      _count: post._count,
    }));

    return NextResponse.json(formattedPosts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}

// POST method for creating a new post
export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, img } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const newPost = await prisma.post.create({
      data: {
        img,
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