import { headers } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export function getUserId() {
  const token = headers().get("authorization")?.replace("Bearer ", "") || "";
  const { sub } = verifyToken(token);
  return String(sub);
}
