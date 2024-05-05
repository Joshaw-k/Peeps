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
import '@rainbow-me/rainbowkit/styles.css'
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import PeepsProvider from "./context";
import Navbar from "./components/Navbar";

import { Toaster } from "react-hot-toast";
import { MobileNavigation } from "./components/MobileNavigation";
import {WagmiProvider} from "wagmi";
import {rainbowKitConfig} from "../../wagmi";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {darkTheme, lightTheme, RainbowKitProvider} from "@rainbow-me/rainbowkit";
import Head from "next/head";

// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  preload: false,
  variable: "--font-noto-sans-jp",
});

const metadata: Metadata = {
  title: "Peeps",
  description: "A web3 decentralized social media platform",
};

const config: any = configFile;

// const injected: any = injectedModule();
// init({
//   wallets: [injected],
//   chains: Object.entries(config).map(([k, v]: [string, any], i) => ({
//     id: k,
//     token: v.token,
//     label: v.label,
//     rpcUrl: v.rpcUrl,
//   })),
//   appMetadata: {
//     name: "Peeps - Built on Cartesi",
//     icon: "<svg><svg/>",
//     description: "Peeps is a decentralized social platform",
//     recommendedInjectedWallets: [
//       { name: "MetaMask", url: "https://metamask.io" },
//     ],
//   },
// });

//Setup GraphQL Apollo client
const URL_QUERY_GRAPHQL = "http://localhost:8080/graphql";

const client = new ApolloClient({
  uri: URL_QUERY_GRAPHQL,
  cache: new InMemoryCache(),
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return (
    <html lang="en" className={notoSansJP.className}>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
    </Head>
    <body
        className={`${notoSansJP.className} flex flex-col h-dvh overflow-y-auto`}
      >
        {/* <section className={"flex flex-col h-screen"}>
          <Navbar />
        </section> */}
        <ApolloProvider client={client}>
          <WagmiProvider config={rainbowKitConfig}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider theme={{
                lightMode: lightTheme({...lightTheme.accentColors.purple}),
                darkMode: darkTheme({
                  accentColor: '#4563eb',
                  accentColorForeground: 'white',
                  borderRadius: 'large',
                }),
              }}>
                <PeepsProvider>
                  <section className="h-dvh overflow-y-auto">
                    <Navbar />
                    <section className={"flex flex-col lg:grid lg:grid-cols-12 py-2 lg:py-8"}>
                      <section className={"lg:col-span-3"}>
                        <UserLeft />
                      </section>
                      <section className={"col-span-6 px-2 lg:px-4"}>{children}</section>
                      <section className={"lg:col-span-3"}>
                        <RightComponent />
                      </section>
                    </section>
                  </section>
                  <MobileNavigation />
                  <Toaster
                    position="top-right"
                    containerStyle={{ top: "88px" }}
                    toastOptions={
                      {
                        // Define default options
                        // className: "",
                        // duration: 5000,
                        // style: {
                        //   background: "#363636",
                        //   color: "#fff",
                        // },
                        // // Default options for specific types
                        // success: {
                        //   duration: 3000,
                        //   theme: {
                        //     primary: "green",
                        //     secondary: "black",
                        //   },
                        // },
                      }
                    }
                  />
                  {/* <App /> */}
                  {/* {children} */}
                </PeepsProvider>
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
