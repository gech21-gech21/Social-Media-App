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
  id: number;
  desc: string; // Changed from 'content' to 'desc' to match your Prisma schema
  img?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  likes: Like[];
  _count: {
    comments: number;
    likes: number; // Added likes count based on your usage
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
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              surname: true,
              avatar: true,
            },
          },
          likes: {
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true, // Added likes count
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
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              surname: true,
              avatar: true,
            },
          },
          likes: {
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true, // Added likes count
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // Format posts to ensure they match the Post type
    const formattedPosts: Post[] = posts.map((post) => ({
      id: post.id,
      desc: post.desc, // Use 'desc' instead of 'content'
      img: post.img || undefined,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      userId: post.userId,
      user: post.user,
      likes: post.likes,
      _count: {
        comments: post._count.comments,
        likes: post._count.likes || 0, // Ensure likes count exists
      },
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

    const { desc, img } = await request.json(); // Changed from 'content' to 'desc'

    if (!desc) {
      return NextResponse.json(
        { error: "Description is required" }, // Updated error message
        { status: 400 }
      );
    }

    const newPost = await prisma.post.create({
      data: {
        desc, // Use 'desc' instead of 'content'
        img: img || null,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            surname: true,
            avatar: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
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
