"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import SocialSignIn from "@/components/layout/SocialSignIn";
import { MessageCircleWarning } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const res = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });

    setLoading(false);
    if (res.error) {
      toast.error(
        `${res.error.message}. If you don't have an account please Register`,
      );
      return;
    }

    toast.success("Account created successfully");

    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm border border-gray-200">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/mediStore(1).png"
            alt="MediStore Logo"
            className="object-contain"
            width={100}
            height={100}
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
          Login to MediStore
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="label">
              <span className="label-text text-gray-700">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text text-gray-700">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary mt-4 w-full">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* social login buttons */}
        <SocialSignIn />

        {/* Register link */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
        <div className="pt-5 text-yellow-500 flex gap-2">
          <MessageCircleWarning />
          <p className="text-sm">
            Want to sell products? You must register as a <b>Seller</b> during
            sign-up.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
