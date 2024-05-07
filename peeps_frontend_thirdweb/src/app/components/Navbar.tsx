"use client";

import Link from "next/link";
import React from "react";
// import {useAccount} from "wagmi";
import {client} from "@/app/client";
import {ConnectButton} from "thirdweb/react";
// import {ConnectButton, WalletButton} from "@rainbow-me/rainbowkit";
import { defineChain } from "thirdweb";

const localhost = defineChain({
    id: 31337,
    rpc: "http://localhost:8545"
});

const Navbar: React.FC = () => {
  // const { isConnected } = useAccount();

  return (
    <section className="sticky top-0 z-[100]">
      <div className="navbar bg-base-200 dark:bg-base-300 px-3 md:px-6 lg:px-16 lg:px-24 h-16 lg:h-20">
        <div className="navbar-start">
          <Link
            href={"/"}
            className="text-base lg:text-xl font-black bg-clip-text bg-gradient-to-tl from-blue-600 to-violet-600 text-transparent"
          >
            Peeps
          </Link>
        </div>
        <div className="navbar-end">
          <ConnectButton
              client={client}
              chain={localhost}
              appMetadata={{
                name: "Peeps",
                url: "https://peeps-mu.vercel.app",
              }}
          />
          {/*<Network />*/}
          {/*<ConnectButton*/}
          {/*    accountStatus={{smallScreen: "avatar", largeScreen: "full"}}*/}
          {/*    chainStatus={{smallScreen: "icon", largeScreen: "full"}}*/}
          {/*    showBalance={false}*/}
          {/*/>*/}
          {/*<WalletButton wallet="metamask" />*/}
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
