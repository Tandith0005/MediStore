"use client"; 

import { User } from "@/constants";
import { authClient } from "@/lib/auth-client";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const UserDropdown = ({ user }: { user: User }) => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout.");
    }
  };;

  return (
    <details className="dropdown">
      <summary className="btn m-1 bg-primary text-zinc-50">
        <CircleUserRound />
      </summary>
      <ul className="menu dropdown-content bg-blue-400 text-zinc-50 rounded-box w-52 p-2 shadow-sm">
        {user.role === "ADMIN" && (
          <li>
            <Link
              href="/admin/dashboard"
              className="block px-4 py-2 hover:bg-blue-500 rounded"
            >
              Admin Dashboard
            </Link>
          </li>
        )}

        {user.role === "SELLER" && (
          <li>
            <Link
              href="/seller/dashboard"
              className="block px-4 py-2 hover:bg-blue-500 rounded"
            >
              Seller Dashboard
            </Link>
            <Link
              href="/seller/my-medicines"
              className="block px-4 py-2 hover:bg-blue-500 rounded"
            >
              My Medicines
            </Link>
          </li>
        )}

        {user.role === "CUSTOMER" && (
          <li>
            <Link
              href="/user/dashboard"
              className="block px-4 py-2 hover:bg-blue-500 rounded"
            >
              Dashboard
            </Link>
            <Link
              href="/user/cart"
              className="block px-4 py-2 hover:bg-blue-500 rounded"
            >
              Cart
            </Link>
          </li>
        )}

        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-red-500 rounded"
          >
            Logout
          </button>
        </li>
      </ul>
    </details>
  );
};
