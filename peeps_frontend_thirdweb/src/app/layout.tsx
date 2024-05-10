"use client";

import type { Metadata } from "next";
import {Inter, Noto_Sans} from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import PeepsProvider from "@/app/context";
import {Toaster} from "react-hot-toast";
import Navbar from "@/app/components/Navbar";
import {UserLeft} from "@/app/components/UserLeft";
import {RightComponent} from "@/app/components/RightComponent";
import {MobileNavigation} from "@/app/components/MobileNavigation";
import Home from "@/app/page";
import React from "react";
import injectedModule from "@web3-onboard/injected-wallets";
import { init } from "@web3-onboard/react";
import configFile from "./config.json";

const inter = Inter({ subsets: ["latin"] });
const notoSans = Noto_Sans({
    subsets: ["latin", "cyrillic"],
    display: "swap",
    preload: false,
    variable: "--font-noto-sans",
});

const metadata: Metadata = {
  title: "Peeps",
  description: "A decentralized social media platform",
};

//Setup GraphQL Apollo client
const URL_QUERY_GRAPHQL = "http://localhost:8080/graphql";

const client = new ApolloClient({
    uri: URL_QUERY_GRAPHQL,
    cache: new InMemoryCache(),
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSans.className} flex flex-col h-dvh overflow-y-auto`}>
      <ApolloProvider client={client}>
        <ThirdwebProvider>
            <PeepsProvider>
                <section className="w-full h-dvh overflow-y-auto">
                    <Navbar/>
                    <section className={"flex flex-col lg:grid lg:grid-cols-12 py-2 lg:py-8"}>
                        <section className={"lg:col-span-3"}>
                            <UserLeft/>
                        </section>
                        <section className={"col-span-6 px-2 pb-16 lg:px-4 py-0"}>{children}</section>
                        <section className={"lg:col-span-3"}>
                            <RightComponent/>
                        </section>
                    </section>
                </section>
                <MobileNavigation/>
                <Toaster
                    position="top-right"
                    containerStyle={{top: "88px"}}
                    toastOptions={{}}
                />
            </PeepsProvider>
        </ThirdwebProvider>
      </ApolloProvider>
      </body>
    </html>
  );
}
