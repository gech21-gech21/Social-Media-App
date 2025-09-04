"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "./client";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const switchFollow = async (userId: string) => {
  const { userId: currentUserId } = await auth();
  if (!currentUserId) {
    throw new Error("User not authenticated");
  }

  try {
    const existingFollow = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId,
      },
    });

    if (existingFollow) {
      await prisma.follower.delete({
        where: { id: existingFollow.id },
      });
    } else {
      const existingFollowRequest = await prisma.followRequest.findFirst({
        where: {
          senderId: currentUserId,
          receiverId: userId,
        },
      });

      if (existingFollowRequest) {
        await prisma.followRequest.delete({
          where: { id: existingFollowRequest.id },
        });
      } else {
        await prisma.followRequest.create({
          data: {
            senderId: currentUserId,
            receiverId: userId,
          },
        });
      }
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong");
  }
};

export const switchBlock = async (userId: string) => {
  const { userId: currentUserId } = await auth();
  if (!currentUserId) {
    throw new Error("User is not authenticated!!");
  }

  try {
    const existingBlock = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: userId,
      },
    });

    if (existingBlock) {
      await prisma.block.delete({
        where: { id: existingBlock.id },
      });
    } else {
      await prisma.block.create({
        data: {
          blockerId: currentUserId,
          blockedId: userId,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong");
  }
};

export const acceptFollowRequest = async (userId: string) => {
  const { userId: currentUserId } = await auth();
  if (!currentUserId) {
    throw new Error("User is not authenticated!!");
  }

  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });

      await prisma.follower.create({
        data: {
          followerId: userId,
          followingId: currentUserId,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

// Define the form data schema
const profileSchema = z
  .object({
    cover: z.string().optional(),
    name: z.string().max(20).optional(),
    surname: z.string().max(20).optional(),
    description: z.string().max(200).optional(),
    work: z.string().max(50).optional(),
    school: z.string().max(50).optional(),
    website: z.string().url().or(z.literal("")).optional(),
    city: z.string().max(30).optional(),
  })
  .partial();

export const updateProfile = async (
  prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: true };
    }

    // Extract data from FormData
    const rawData = {
      cover: (formData.get("cover") as string) || undefined,
      name: (formData.get("name") as string) || undefined,
      surname: (formData.get("surname") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      work: (formData.get("work") as string) || undefined,
      school: (formData.get("school") as string) || undefined,
      website: (formData.get("website") as string) || undefined,
      city: (formData.get("city") as string) || undefined,
    };

    // Filter out empty strings
    const filteredData = Object.fromEntries(
      Object.entries(rawData).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );

    // Validate the data
    const validatedData = profileSchema.safeParse(filteredData);

    if (!validatedData.success) {
      console.log(validatedData.error.flatten().fieldErrors);
      return { success: false, error: true };
    }

    // Update the user profile
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: validatedData.data,
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const switchLike = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) throw new Error("user is not authenticated");
  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });
    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("something went wrong !!");
  }
};

export const getPost = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) throw new Error("user is not authenticated");

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
            likes: true,
          },
        },
        likes: true,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    return post;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch post");
  }
};

export const updatePost = async (
  postId: number,
  desc: string,
  img?: string
) => {
  const { userId } = await auth();
  if (!userId) throw new Error("user is not authenticated");

  try {
    // Verify the post belongs to the user
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.userId !== userId) {
      throw new Error("Unauthorized to edit this post");
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        desc,
        ...(img && { img }),
        updatedAt: new Date(),
      },
      include: {
        user: true,
      },
    });

    revalidatePath("/");
    return updatedPost;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update post");
  }
}; // Comment like functionality - FIXED VERSION
export const switchCommentLike = async (commentId: number) => {
  const { userId } = await auth();
  if (!userId) throw new Error("user is not authenticated");

  try {
    // First check if the comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { likes: true },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        commentId: commentId,
        userId: userId,
      },
    });

    if (existingLike) {
      // Unlike the comment
      await prisma.like.delete({
        where: { id: existingLike.id },
      });

      // Get the updated comment with likes
      const updatedComment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: { likes: true },
      });

      return {
        liked: false,
        likeCount: updatedComment?.likes.length || 0,
      };
    } else {
      // Like the comment
      await prisma.like.create({
        data: {
          commentId: commentId,
          userId: userId,
        },
      });

      // Get the updated comment with likes
      const updatedComment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: { likes: true },
      });

      return {
        liked: true,
        likeCount: updatedComment?.likes.length || 0,
      };
    }
  } catch (err) {
    console.log(err);
    throw new Error("something went wrong !!");
  }
};
export const addComment = async (postId: string, desc: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("user is not authenticated");

  try {
    const createdComment = await prisma.comment.create({
      data: {
        desc,
        userId,
        postId: parseInt(postId),
      },
      include: {
        user: true,
        likes: true, // Include likes in the response
      },
    });

    revalidatePath("/");
    return createdComment;
  } catch (error) {
    console.log(error);
    throw new Error("something went wrong !!");
  }
};

export const addPost = async (formData: FormData, img: string) => {
  const desc = formData.get("desc") as string;
  const Desc = z.string().min(1).max(255);
  const validatedDesc = Desc.safeParse(desc);
  if (!validatedDesc.success) {
    console.log("Description is not valid");
    return;
  }

  const { userId } = await auth();
  if (!userId) throw new Error("user is not authenticated");

  try {
    await prisma.post.create({
      data: {
        desc: validatedDesc.data,
        userId,
        img,
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
};

export const addStory = async (img: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("user is not authenticated");

  try {
    const existingStory = await prisma.story.findFirst({
      where: {
        userId,
      },
    });
    if (existingStory) {
      await prisma.story.delete({
        where: { id: existingStory.id },
      });
    }
    const createStory = await prisma.story.create({
      data: {
        userId,
        img,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      include: {
        user: true,
      },
    });
    return createStory;
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) throw new Error("user is not authenticated");

  try {
    // First, check if the post exists and belongs to the user
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== userId) {
      throw new Error("Unauthorized: You can only delete your own posts");
    }

    // Delete related records first (comments, likes) to avoid foreign key constraints
    await prisma.comment.deleteMany({
      where: { postId: postId },
    });

    await prisma.like.deleteMany({
      where: { postId: postId },
    });

    // Now delete the post
    await prisma.post.delete({
      where: { id: postId },
    });

    revalidatePath("/");
    return { success: true, message: "Post deleted successfully" };
  } catch (error) {
    console.log("Delete post error:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to delete post");
  }
};
export const declineFollowRequest = async (senderId: string) => {
  const { userId: currentUserId } = await auth();
  if (!currentUserId) {
    throw new Error("User not authenticated");
  }

  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId,
        receiverId: currentUserId,
      },
    });

    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong");
  }
};
