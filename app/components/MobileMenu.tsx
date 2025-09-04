"use client";

import Link from "next/link";
import { useState } from "react";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false); // Close the menu when a link is clicked
  };

  return (
    <div className="md:hidden">
      {/* Burger Icon */}
      <div
        className="flex flex-col gap-[4.5px] cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div
          className={`w-6 h-1 bg-blue-500 rounded-sm ${
            isOpen ? "rotate-45" : ""
          } origin-left ease-in-out duration-500`}
        />
        <div
          className={`w-6 h-1 bg-blue-500 rounded-sm ${
            isOpen ? "opacity-0" : ""
          } ease-in-out duration-500`}
        />
        <div
          className={`w-6 h-1 bg-blue-500 rounded-sm ${
            isOpen ? "-rotate-45" : ""
          } origin-left ease-in-out duration-500`}
        />
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute left-0 top-24 w-full h-[calc(100vh-96px)] bg-white flex flex-col items-center justify-center gap-8 font-medium text-xl z-10">
          <Link href="/" onClick={handleLinkClick}>
            Home
          </Link>
          <Link href="/friends" onClick={handleLinkClick}>
            Friends
          </Link>
          <Link href="/groups" onClick={handleLinkClick}>
            Groups
          </Link>
          <Link href="/stories" onClick={handleLinkClick}>
            Stories
          </Link>
          <Link href="/login" onClick={handleLinkClick}>
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
