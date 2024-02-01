"use client";

import Link from "next/link";
import { Network } from "../Network";
import { FaWallet } from "react-icons/fa6";
import { LucideGamepad2, MessageSquareText } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <section className="sticky top-0 z-[10]">
      <div className="navbar bg-base-200 px-24 h-20">
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Parent</a>
                <ul className="p-2">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </li>
              <li>
                <a>Item 3</a>
              </li>
            </ul>
          </div>
          <Link
            href={"/"}
            className="text-xl font-black bg-clip-text bg-gradient-to-tl from-blue-600 to-violet-600 text-transparent"
          >
            Peeps
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-x-6 px-1">
            <li>
              <Link href="/">
                <MessageSquareText size={20} />
                Feed
              </Link>
            </li>
            <li>
              <Link href="/wallet">
                <FaWallet />
                Wallet
              </Link>
            </li>
            {/* <li>
              <details>
                <summary>Notifications</summary>
                <ul className="p-2">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </details>
            </li> */}
            <li>
              <Link href={"/arcade"}>
                <LucideGamepad2 size={20} />
                Arcade
                <span className="badge badge-md badge-error text-xs text-white font-semibold bg-red-600 shadow-error shadow-lg">
                  hot
                </span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <Network />
          {/* <a className="btn btn-primary rounded-box">Login</a> */}
        </div>
      </div>
    </section>
  );
};

export default Navbar;
