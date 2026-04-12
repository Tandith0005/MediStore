import { NavLinks } from "@/constants";
import { userService } from "@/services/user.service";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { UserDropdown } from "./UserDropdown";

const Navbar = async () => {
  const {data} = await userService.getSession();
  const user = data?.user || null;

  return (
    <div className="navbar bg-base-100/30 backdrop-blur-lg border-b border-base-content/10 fixed top-0 z-50 w-full ">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            {/* dropdown */}
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              {NavLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/"
            className="btn btn-ghost bg-white/0 border-transparent text-xl"
          >
            <Image
              src="/mediStore(1).png"
              alt="logo"
              width={120}
              height={120}
              priority
            />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex text-primary">
          {NavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="btn btn-ghost text-[18px] hover:text-blue-600 hover:bg-white/0"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="navbar-end">
          {/* no user :{ */}
          {!user && (
            <Link
              href="/login"
              className="btn bg-primary text-white border-none hover:bg-blue-600"
            >
              Login
            </Link>
          )}

          {/* User */}
          {user && <UserDropdown user={user} />}

        </div>
      </div>
    </div>
  );
};

export default Navbar;
