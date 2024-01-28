"use client";

import type { Metadata } from "next";

import { Inter } from "next/font/google";
import { Navbar } from "./components/Navbar";
import { UserLeft } from "./components/UserLeft";
import { RightComponent } from "./components/RightComponent";
import App from "./App";
import { init } from "@web3-onboard/react";

import configFile from "./config.json";
import injectedModule from "@web3-onboard/injected-wallets";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Peeps",
  description: "A web3 decentralized social media platform",
};

const config: any = configFile;

const injected: any = injectedModule();
init({
  wallets: [injected],
  chains: Object.entries(config).map(([k, v]: [string, any], i) => ({
    id: k,
    token: v.token,
    label: v.label,
    rpcUrl: v.rpcUrl,
  })),
  appMetadata: {
    name: "Cartesi Rollups Test DApp",
    icon: "<svg><svg/>",
    description: "Demo app for Cartesi Rollups",
    recommendedInjectedWallets: [
      { name: "MetaMask", url: "https://metamask.io" },
    ],
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={"flex flex-col h-dvh overflow-y-auto"}>
        {/* <section className={"flex flex-col h-screen"}>
          <Navbar />
        </section> */}
        <Navbar />
        <section className={"grid grid-cols-12 py-8"}>
          <section className={"col-span-3"}>
            <UserLeft />
          </section>
          <section className={"col-span-6 px-4"}>{children}</section>
          <section className={"col-span-3"}>
            <RightComponent />
          </section>
        </section>
        {/* <App /> */}
        {/* {children} */}
      </body>
    </html>
  );
}
