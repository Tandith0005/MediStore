"use client";

import React from "react";

import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Image from "next/image";

const SocialSignIn = () => {
  const handleGoogleSignIn = async () => {
    const res = await authClient.signIn.social({
      provider: "google",
      callbackURL: process.env.NEXT_PUBLIC_APP_URL
    });

    if (res?.error) {
      toast.error(res.error.message);
    }
  };

  return (
    <>
        <hr  className="my-4 text-sky-300"/>
    <button
      onClick={handleGoogleSignIn}
      className="btn btn-outline w-full flex items-center justify-center gap-2 my-5 border-primary shadow-inner hover:shadow-lg hover:shadow-primary/30"
    >
      <Image src="/google.svg" alt="Google" width={20} height={20} />
      Continue with Google
    </button>
    </>
  );
};

export default SocialSignIn;
