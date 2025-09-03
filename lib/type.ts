// types.ts
export interface User {
  id: string;
  username: string;
  name?: string;
  surname?: string;
  avatar?: string;
  // Add any other user properties that your Post component expects
}

export interface Like {
  id: number;
  userId: string;
  // Add other like properties
}

export interface PostType {
  id: number;
  desc: string;
  img?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  likes: Like[];
  _count: {
    likes: number;
    comments: number;
  };
  // Add comments if needed by your Post component
  comments?: Comment[];
}