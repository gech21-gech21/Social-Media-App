import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/client";

// Define types for user data based on your schema
interface UserData {
  id: string;
  username: string;
  name?: string;
  email: string;
}

// Define types for Clerk email verification
interface ClerkEmailVerification {
  status: string;
  strategy: string;
}

interface ClerkEmailAddress {
  email_address: string;
  id: string;
  object: string;
  verification: ClerkEmailVerification;
}

// Define the Clerk UserJSON type structure
interface ClerkUserJSON {
  id: string;
  email_addresses: ClerkEmailAddress[];
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  image_url?: string | null;
}

// Define type for deleted user event data
interface ClerkUserDeletedData {
  id: string;
  deleted: boolean;
}

// Define Prisma error types
interface PrismaError extends Error {
  code?: string;
  meta?: {
    target?: string[];
  };
}

// Function to transform Clerk user data to your UserData format
function transformClerkUserToUserData(clerkUser: ClerkUserJSON): UserData {
  const username = clerkUser.username || `user_${clerkUser.id.slice(0, 8)}`;
  const name =
    clerkUser.first_name || clerkUser.last_name
      ? `${clerkUser.first_name || ""} ${clerkUser.last_name || ""}`.trim()
      : undefined;

  const email = clerkUser.email_addresses[0]?.email_address || "";

  return {
    id: clerkUser.id,
    username: username,
    name: name,
    email: email,
  };
}

// Function to create user in your database
async function createUserInDatabase(userData: UserData): Promise<void> {
  try {
    console.log("Attempting to create user in database:", userData);

    await prisma.user.create({
      data: {
        id: userData.id,
        username: userData.username,
        name: userData.name,
        email: userData.email,
        password: "clerk_oauth_user",
      },
    });

    console.log(
      `User created successfully: ${userData.name || userData.username} (ID: ${
        userData.id
      })`
    );
  } catch (error: unknown) {
    console.error("Error creating user:", error);

    const prismaError = error as PrismaError;
    if (prismaError.code === "P2002") {
      console.error(
        "Unique constraint violation - user might already exist:",
        prismaError.meta?.target
      );
    }

    throw error;
  }
}

// Function to delete user from your database
async function deleteUserFromDatabase(userId: string): Promise<void> {
  try {
    console.log("Attempting to delete user from database:", userId);

    await prisma.user.delete({
      where: { id: userId },
    });

    console.log(`User deleted successfully: ${userId}`);
  } catch (error: unknown) {
    console.error("Error deleting user:", error);

    const prismaError = error as PrismaError;
    if (prismaError.code === "P2025") {
      console.log(
        "User not found in database, might have been already deleted"
      );
      return;
    }

    throw error;
  }
}

// Function to update user in your database
async function updateUserInDatabase(
  userId: string,
  updates: Partial<UserData>
): Promise<void> {
  try {
    console.log("Attempting to update user in database:", userId, updates);

    await prisma.user.update({
      where: { id: userId },
      data: updates,
    });

    console.log(`User updated successfully: ${userId}`);
  } catch (error: unknown) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// Main POST function to handle webhook events
export async function POST(req: Request): Promise<Response> {
  console.log("Clerk webhook received");

  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("WEBHOOK_SECRET is not configured in environment variables");
    return new Response(
      JSON.stringify({ error: "WEBHOOK_SECRET not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing Svix headers - received:", {
      svix_id,
      svix_timestamp,
      svix_signature,
    });
    return new Response(JSON.stringify({ error: "Missing svix headers" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let payload: unknown;
  try {
    payload = await req.json();
    console.log("Received payload:", JSON.stringify(payload, null, 2));
  } catch (error) {
    console.error("Invalid JSON payload:", error);
    return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    console.log("Webhook verification successful");
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response(
      JSON.stringify({ error: "Invalid webhook signature" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const eventType = evt.type;
  console.log(`Received webhook type: ${eventType}`);

  try {
    switch (eventType) {
      case "user.created": {
        const userData = transformClerkUserToUserData(
          evt.data as unknown as ClerkUserJSON
        );
        console.log("Transformed user data for database:", userData);

        await createUserInDatabase(userData);
        console.log("User successfully created in database");

        return new Response(
          JSON.stringify({ success: true, userId: userData.id }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      case "user.deleted": {
        const deletedUserData = evt.data as unknown as ClerkUserDeletedData;
        await deleteUserFromDatabase(deletedUserData.id);

        return new Response(
          JSON.stringify({ success: true, message: "User deleted" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      case "user.updated": {
        const updatedUserData = transformClerkUserToUserData(
          evt.data as unknown as ClerkUserJSON
        );
        await updateUserInDatabase(updatedUserData.id, {
          username: updatedUserData.username,
          name: updatedUserData.name,
          email: updatedUserData.email,
        });

        return new Response(
          JSON.stringify({ success: true, message: "User updated" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
        return new Response(
          JSON.stringify({
            message: `Event type '${eventType}' received but not handled`,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
    }
  } catch (error: unknown) {
    console.error("Failed to process webhook event:", error);
    const prismaError = error as PrismaError;

    if (prismaError.code === "P2002") {
      console.log(
        "User already exists in database, this might be a duplicate webhook"
      );
      return new Response(
        JSON.stringify({ success: true, message: "User already exists" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: "Failed to process webhook event",
        details: prismaError.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Optional: Health check endpoint for testing
export async function GET(): Promise<Response> {
  console.log("Webhook endpoint health check");

  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Database connection test successful");
    return new Response(
      JSON.stringify({
        status: "active",
        database: "connected",
        message: "Webhook endpoint is ready",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Database connection test failed:", error);
    return new Response(
      JSON.stringify({
        status: "active",
        database: "disconnected",
        error: "Database connection failed",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
