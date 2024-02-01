"use client";

import type { Metadata } from "next";

import { Inter, Noto_Sans_JP } from "next/font/google";
import { UserLeft } from "./components/UserLeft";
import { RightComponent } from "./components/RightComponent";
import App from "./App";
import { init } from "@web3-onboard/react";

import configFile from "./config.json";
import injectedModule from "@web3-onboard/injected-wallets";

import "./globals.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import PeepsProvider from "./context";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansJP = Noto_Sans_JP({
  subsets: ["cyrillic"],
  display: "swap",
  preload: true,
  variable: "--font-noto-sans-jp",
});

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

//Setup GraphQL Apollo client
const URL_QUERY_GRAPHQL = "http://localhost:8080/graphql";

const client = new ApolloClient({
  uri: URL_QUERY_GRAPHQL,
  cache: new InMemoryCache(),
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return (
    <html lang="en" className={notoSansJP.className}>
      <body
        className={`${notoSansJP.className} flex flex-col h-dvh overflow-y-auto`}
      >
        {/* <section className={"flex flex-col h-screen"}>
          <Navbar />
        </section> */}
        <PeepsProvider>
          <ApolloProvider client={client}>
            <section className="h-dvh overflow-y-auto">
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
            </section>
            {/* <App /> */}
            {/* {children} */}
          </ApolloProvider>
        </PeepsProvider>
      </body>
    </html>
  );
}
