import Fead from "./components/feed";
import LeftMenu from "@/app/components/leftMenu/LeftMenu";

export default function Home() {
  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="home" />
      </div>
      <h1 className="text-2xl font-semibold">Welcome to social media app</h1>
      <Fead />
    </div>
  );
}
