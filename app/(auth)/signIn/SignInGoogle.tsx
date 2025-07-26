"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

const GoogleSignIn = () => {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="flex border border-gray-200 w-full min-h-[5rem] items-center justify-center gap-2 cursor-pointer"
    >
      <Image
        src="https://authjs.dev/img/providers/google.svg"
        alt="google-logo"
        width={40}
        height={40}
      />
      <span>Continue with Google</span>
    </button>
  );
};

export default GoogleSignIn;
