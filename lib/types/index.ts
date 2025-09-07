export type ApiPostType = {
  id: number;
  desc: string;
  img?: string;
  userId: string;
  createdAt: Date;
  user: {
    id: string;
    username: string;
    name?: string | null;
    surname?: string | null;
    avatar?: string | null;
  };
  likes: Array<{ userId: string }>;
  _count: {
    comments: number;
  };
};
