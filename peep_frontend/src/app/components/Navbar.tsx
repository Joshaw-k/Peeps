"use client";

import Link from "next/link";
import { Network } from "../Network";
import { FaWallet } from "react-icons/fa6";
import { LucideGamepad2, MessageSquareText } from "lucide-react";
import {WalletOptions} from "./walletOptions";
import React from "react";
import {useAccount} from "wagmi";
import { Account } from "./account";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar: React.FC = () => {
  const { isConnected } = useAccount();

  return (
    <section className="sticky top-0 z-[10]">
      <div className="navbar bg-base-200 px-6 lg:px-24 h-20">
        <div className="navbar-start">
          <Link
            href={"/"}
            className="text-xl font-black bg-clip-text bg-gradient-to-tl from-blue-600 to-violet-600 text-transparent"
          >
            Peeps
          </Link>
        </div>
        <div className="navbar-end">
          {/*<Network />*/}
          <ConnectButton
              accountStatus={{smallScreen: "avatar", largeScreen: "full"}}
              chainStatus={{smallScreen: "icon", largeScreen: "full"}}
              showBalance={false}
          />
          {/*{*/}
          {/*  isConnected*/}
          {/*      ? <Account/>*/}
          {/*      : <WalletOptions/>*/}
          {/*}*/}
        </div>
      </div>
    </section>
  );
};

export default Navbar;
