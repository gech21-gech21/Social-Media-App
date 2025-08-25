  "use client";
  import { useState } from "react";
  import Image from "next/image";
  import { usePathname } from "next/navigation";
  import Stories from "./Stories"; 
  import Link from "next/link";

  export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showStories, setShowStories] = useState(false); 
    const pathname = usePathname();

    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

    const navItems = [
      { href: "/", icon: "/icons/home.png", label: "Home" },
      { href: "#stories", icon: "/icons/story.png", label: "Stories" }, 
      { href: "/friends", icon: "/icons/friends.png", label: "Friends" },
      { href: "/search", icon: "/icons/searching.png", label: "Search" },
      { 
      href: "/profile/1", 
      icon: "/icons/profile.png", 
      label: "Profile" 
    },
    ];

    return (
      <>
        <nav className="bg-white sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center py-3">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">S.media app</h1>
              </div>

              {/* Desktop nav */}
              <div className="hidden md:flex items-center space-x-6">
                {navItems.map((item) =>
                  item.label === "Stories" ? (
                    <button
                      key={item.label}
                      onClick={() => setShowStories((prev) => !prev)}
                      className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                        showStories
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
                      }`}
                    >
                      <Image
                        width={24}
                        height={20}
                        alt={item.label}
                        src={item.icon}
                        className={
                          showStories
                            ? "filter brightness-0 saturate(100%) invert(36%) sepia(89%) saturate(1045%) hue-rotate(224deg) brightness(93%) contrast(93%)"
                            : ""
                        }
                      />
                      <span className="text-xs mt-1">{item.label}</span>
                    </button>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                        pathname === item.href
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
                      }`}
                    >
                      <Image
                        width={24}
                        height={20}
                        alt={item.label}
                        src={item.icon}
                        className={
                          pathname === item.href
                            ? "filter brightness-0 saturate(100%) invert(36%) sepia(89%) saturate(1045%) hue-rotate(224deg) brightness(93%) contrast(93%)"
                            : ""
                        }
                      />
                      <span className="text-xs mt-1">{item.label}</span>
                    </Link>
                  )
                )}
              </div>

              {/* Mobile menu toggle */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={toggleMenu}
                  className="outline-none focus:outline-none"
                  aria-label="Toggle menu"
                >
                  <Image width={34} height={34} alt="Menu" src="/icons/bars.svg" />
                </button>
              </div>
            </div>

            {/* Mobile nav */}
            <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
              <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
                {navItems.map((item) =>
                  item.label === "Stories" ? (
                    <button
                      key={item.label}
                      onClick={() => {
                        setShowStories((prev) => !prev);
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors ${
                        showStories
                          ? "bg-indigo-100 text-indigo-700 border-l-4 border-indigo-600"
                          : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                      }`}
                    >
                      <Image
                        width={20}
                        height={18}
                        alt={item.label}
                        src={item.icon}
                        className="mr-3"
                      />
                      <span>{item.label}</span>
                    </button>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors ${
                        pathname === item.href
                          ? "bg-indigo-100 text-indigo-700 border-l-4 border-indigo-600"
                          : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                      }`}
                    >
                      <Image
                        width={20}
                        height={18}
                        alt={item.label}
                        src={item.icon}
                        className="mr-3"
                      />
                      <span>{item.label}</span>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Stories inline render */}
        {showStories && (
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Stories />
          </div>
        )}
      </>
    );
  }
