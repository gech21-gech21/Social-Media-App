"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import FriendRequestList from "./FriendRequestList";
import { User, FollowRequest } from "@prisma/client";

type RequestWithUser = FollowRequest & {
  sender: User;
};

const FriendRequests: React.FC = () => {
  const [requests, setRequests] = useState<RequestWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/friend-requests");

        if (!response.ok) {
          throw new Error("Failed to fetch friend requests");
        }

        const requestsData = await response.json();
        setRequests(requestsData);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
        setError("Failed to load friend requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return <div>Loading friend requests...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (requests.length === 0) {
    return <div>No friend requests.</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-full text-sm flex flex-col gap-4">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">Friend Requests</span>
        <Link className="text-blue-500 text-sm" href="/requests">
          see all
        </Link>
      </div>
      <FriendRequestList requests={requests} />
    </div>
  );
};

export default FriendRequests;
