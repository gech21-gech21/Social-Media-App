import Post from "./post";

type FeedProps = {
  username?: string; // optional if you want Feed to work without a username
};

const Feed: React.FC<FeedProps> = ({ username }) => {
  return (
    <div className="flex justify-center w-full">
      <div className="w-full bg-white shadow-md rounded-lg">
        {username && (
          <h2 className="text-xl font-bold mb-4">Posts from {username}</h2>
        )}
        <Post />
      </div>
    </div>
  );
};

export default Feed;
