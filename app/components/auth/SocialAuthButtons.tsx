"use client";

import { signIn } from "next-auth/react";
import { FaGoogle, FaGithub, FaTwitter } from "react-icons/fa";

const providers = [
  {
    name: "Google",
    icon: <FaGoogle className="h-5 w-5" />,
    id: "google",
  },
  {
    name: "GitHub",
    icon: <FaGithub className="h-5 w-5" />,
    id: "github",
  },
  {
    name: "Twitter",
    icon: <FaTwitter className="h-5 w-5" />,
    id: "twitter",
  },
];

export function SocialAuthButtons() {
  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/feed" });
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {providers.map((provider) => (
        <button
          key={provider.id}
          type="button"
          onClick={() => handleOAuthSignIn(provider.id)}
          className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span className="sr-only">Sign in with {provider.name}</span>
          {provider.icon}
        </button>
      ))}
    </div>
  );
}
