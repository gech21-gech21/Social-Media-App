import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export const sign = (payload: object) =>
  jwt.sign(payload, SECRET, { expiresIn: "7d" });

export const verifyToken = (token: string) =>
  jwt.verify(token, SECRET) as { sub: string; iat: number; exp: number };
