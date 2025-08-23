import Post from "./post";

const Feed = () => {
  return (
    <div className="flex justify-center w-full ">
      <div className="w-full   bg-white shadow-md rounded-lg">
        <Post />
      </div>
    </div>
  );
};

export default Feed;