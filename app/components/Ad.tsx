import Image from "next/image";

type AdProps = {
  size: "sm" | "md" | "lg";
  image?: string;
  logo?: string;
  title?: string;
  description?: {
    sm: string;
    md: string;
    lg: string;
  };
};

const Ad = ({
  size,
  image = "https://images.pexels.com/photos/23193135/pexels-photo-23193135.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
  logo = "https://images.pexels.com/photos/23193135/pexels-photo-23193135.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
  title = "BigChef Lounge",
  description = {
    sm: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    md: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    lg: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
}: AdProps) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm">
      {/* TOP */}
      <div className="flex items-center justify-between text-gray-500 font-medium">
        <span>Sponsored Ads</span>
        <Image src="/more.png" alt="more options" width={16} height={16} />
      </div>

      {/* BOTTOM */}
      <div
        className={`flex flex-col mt-4 ${
          size === "sm" ? "gap-2" : "gap-4"
        }`}
      >
        {/* Ad image */}
        <div
          className={`relative w-full ${
            size === "sm" ? "h-24" : size === "md" ? "h-36" : "h-48"
          }`}
        >
          <Image
            src={image}
            alt={`${title} banner`}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        {/* Brand */}
        <div className="flex items-center gap-4">
          <Image
            src={logo}
            alt={`${title} logo`}
            width={24}
            height={24}
            className="rounded-full w-6 h-6 object-cover"
          />
          <span className="text-blue-500 font-medium">{title}</span>
        </div>

        {/* Description */}
        <p className={size === "sm" ? "text-xs" : "text-sm"}>
          {description[size]}
        </p>

        {/* Button */}
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-2 text-xs rounded-lg transition">
          Learn more
        </button>
      </div>
    </div>
  );
};

export default Ad;
