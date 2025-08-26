"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

import {
  ClerkLoading,
  ClerkLoaded,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
export default function Navbar() {
  return (
    <div className="flex  justify-between w-full">
      {/* left */}
      <div className="   w-[30%]  ">
        <Link className="font-bold text-xl sm:text-3xl text-blue-600" href="/">
          S.media app
        </Link>
      </div>
      {/* center */}
      <div className="hidden md:flex w-[70%] lg:gap-8 items-center  justify-between ">
        <div className="flex gap-6 text-gray-600">
          <Link className=" flex gap-2 items-center" href="/">
            <Image
              alt="home page image"
              src="/icons/home.png"
              width={30}
              height={20}
              className="h-4 w-4"
            ></Image>
            <span>Home</span>
          </Link>
          <Link className=" flex gap-2 items-center" href="/">
            <Image
              alt="home page image"
              src="/icons/friends.png"
              width={30}
              height={20}
              className="h-4 w-4"
            ></Image>
            <span>Friends</span>
          </Link>
          <Link className=" flex gap-2 items-center" href="/">
            <Image
              alt="home page image"
              src="/icons/story.png"
              width={30}
              height={20}
              className="h-4 w-4"
            ></Image>
            <span>stories</span>
          </Link>

          <div className="hidden md:flex rounded-xl bg-gray-200 w-30 justify-between items-center">
            <input
              type="text"
              placeholder="searching..."
              className="rounded-lg w-26 bg-gray-200 focus:outline-none pl-2 "
            />
            <Image
              src="/icons/searching.png"
              alt="searching icon"
              width={20}
              className="bg-transparent w-4 h-4  outline-none"
              height={20}
            ></Image>
          </div>
        </div>
      </div>
      {/* rightmenu */}
      <div className="flex items-center gap-4 xl:gap-8 justify-end">
        <ClerkLoading>
          <div className="w-4 h-4 border-2 border-gray-500 border-t-blue-500 rounded-full animate-spin"></div>
        </ClerkLoading>

        <ClerkLoaded>
          {" "}
          <SignedIn>
            <div className="cursor-pointer">
              <Image
                src="/icons/people.png"
                alt="profile image"
                width={20}
                height={20}
              ></Image>
            </div>
            <div className="cursor-pointer">
              <Image
                src="/icons/comment.png"
                alt="profile image"
                width={20}
                height={20}
              ></Image>
            </div>
            <div className="cursor-pointer">
              <Image
                src="/icons/notification.png"
                alt="profile image"
                width={20}
                height={20}
              ></Image>
            </div>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <div className="flex gap-2">
              <Image
                src="/icons/profile.png"
                alt="profile image"
                width={20}
                height={20}
              ></Image>
              <Link href="/sign-in">Login/Register</Link>
            </div>
          </SignedOut>
        </ClerkLoaded>
        <MobileMenu />
      </div>
    </div>
  );
}
