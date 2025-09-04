export interface User {
  id: string;
  username: string;
  name?: string;
  surname?: string;
  avatar?: string;
}

export interface Like {
  id: number;
  userId: string;
}

export interface PostType {
  id: number;
  desc: string;
  img: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  likes: Like[];
  _count: {
    likes: number;
    comments: number;
  };

  comments?: Comment[];
}
