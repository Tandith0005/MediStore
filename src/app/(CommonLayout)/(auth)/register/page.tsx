"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "SELLER">("CUSTOMER");
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const signupData = {
      email,
      password,
      name,
      role,
      image,
      callbackURL: "/",
    } as Parameters<typeof authClient.signUp.email>[0] & {
      role: "CUSTOMER" | "SELLER";
    };

    const res = await authClient.signUp.email({
      ...signupData,
      callbackURL: "/",
    });

  
    setLoading(false);

    if (res.error) {
      toast.error(res.error.message);
      return;
    }

    toast.success("Account created successfully");
    setName("");
    setEmail("");
    setPassword("");
    setRole("CUSTOMER");
    setImage("");

    window.location.href = "/";
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-xl p-12 w-[full] border border-gray-200">
        <div className="flex justify-center mb-6">
          <Image
            src="/mediStore(1).png"
            alt="MediStore Logo"
            width={100}
            height={100}
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
          Create an Account
        </h2>

        {/* Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4 pr-8 ">
          <input
            type="text"
            placeholder="Full name"
            className="input input-bordered w-[120%]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered w-[120%]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-[120%]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            className="select select-bordered w-[120%]"
            value={role}
            onChange={(e) => setRole(e.target.value as "CUSTOMER" | "SELLER")}
          >
            <option value="CUSTOMER">Register as Customer</option>
            <option value="SELLER">Register as Seller</option>
          </select>

          <input
            type="text"
            placeholder="Image URL"
            className="input input-bordered w-[120%]"
            onChange={(e) => setImage(e.target.value)}
          />

          <button
            type="submit"
            className="btn btn-primary w-[120%]"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
