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
          <Link
            href={"/"}
            className="text-xl font-black bg-clip-text bg-gradient-to-tl from-blue-600 to-violet-600 text-transparent"
          >
            Peeps
          </Link>
        </div>
        <div className="navbar-end">
          <Network />
        </div>
      </div>
    </section>
  );
};

export default Navbar;
