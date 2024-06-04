"use client";

import Image from "next/image";
import { ConnectButton, useActiveWalletConnectionStatus } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg";
import { client } from "./client";
import Navbar from "@/app/components/Navbar";
import { UserLeft } from "@/app/components/UserLeft";
import { RightComponent } from "@/app/components/RightComponent";
import { MobileNavigation } from "@/app/components/MobileNavigation";
import React, { useState } from "react";
import { usePeepsContext } from "@/app/context";
import PostForm from "@/app/components/PostForm";
import classNames from "classnames";
import { Tab } from "@headlessui/react";
import { Post } from "@/app/components/Posts/Posts";
import { PostExplore } from "@/app/components/Posts/PostsExplore";

export default function Home() {
    const walletStatus = useActiveWalletConnectionStatus();

    return (
        <main className="min-h-[100vh] flex items-start w-full containe max-w-scree-lg mx-auto">
            {/*{*/}
            {/*    walletStatus === "connected" ?*/}
            {/*        <>*/}
            {/*            <section className="w-full h-dvh overflow-y-auto">*/}
            {/*                <Navbar/>*/}
            {/*                <section className={"flex flex-col lg:grid lg:grid-cols-12 py-2 lg:py-8"}>*/}
            {/*                    <section className={"lg:col-span-3"}>*/}
            {/*                        <UserLeft/>*/}
            {/*                    </section>*/}
            {/*                    <section className={"col-span-6 px-2 pb-16 lg:px-4 py-0"}><HomePosts /></section>*/}
            {/*                    <section className={"lg:col-span-3"}>*/}
            {/*                        <RightComponent/>*/}
            {/*                    </section>*/}
            {/*                </section>*/}
            {/*            </section>*/}
            {/*            <MobileNavigation/>*/}
            {/*        </>*/}
            {/*        : <LandingPage/>*/}
            {/*}*/}
            <HomePosts />
        </main>
    );
}

function LandingPage() {
    return (
        <div className="py-20">
            <Header />

            <div className="flex justify-center mb-20">
                <ConnectButton
                    client={client}
                    appMetadata={{
                        name: "Example App",
                        url: "https://example.com",
                    }}
                />
            </div>

            <ThirdwebResources />
        </div>
    )
}

const HomePosts = () => {
    const [dappAddress, setDappAddress] = useState<string>(
        "0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C"
    );
    const { postsNotice } = usePeepsContext();
    const recommendedPosts = postsNotice[0]?.payload ? JSON.parse(postsNotice[0]?.payload)?.posts : [];

    return (
        <div className={"lg:py-0 w-full"}>
            <div className={"hidden lg:block"}>
                <PostForm dappAddress={dappAddress} />
            </div>
            {
                recommendedPosts?.length > 0
                    ? <div className={""}>
                        {/* For you & Explore tabs */}
                        <Tab.Group>
                            <Tab.List className="bg-base-100 dark:bg-zinc-950/80 backdrop-blur sticky top-[60px] z-10 flex space-x-1 rounded-sm px-1 py-4">
                                <Tab
                                    className={({ selected }) =>
                                        classNames(
                                            "rounded-xl px-8 py-2.5 lg:py-2 leading-5 prose text-lg lg:text-xl font-semibold text-gray-400 lg:mt-8",
                                            "ring-white/60 focus:outline-none hover:bg-gray-300",
                                            selected
                                                ? "bg-primary dark:bg-[#4563eb] text-primary-content dark:text-white shadow font-bold hover:bg-primary"
                                                : "text-blue-100 hover:bg-white/[0.12] dark:hover:text-white"
                                        )
                                    }
                                >
                                    For You
                                </Tab>
                                <Tab
                                    className={({ selected }) =>
                                        classNames(
                                            "rounded-xl px-8 py-2.5 lg:py-2 leading-5 prose text-lg lg:text-xl font-semibold text-gray-400 lg:mt-8",
                                            "ring-white/60 focus:outline-none hover:bg-gray-300",
                                            selected
                                                ? "bg-primary dark:bg-[#4563eb] text-primary-content dark:text-white shadow font-bold hover:bg-primary"
                                                : "text-blue-100 hover:bg-white/[0.12] dark:hover:text-white"
                                        )
                                    }
                                >
                                    Explore
                                </Tab>
                                {/*<Tab
                        className={({selected}) =>
                            classNames(
                                "rounded-lg px-8 py-2.5 font-medium leading-5",
                                "ring-white/60 focus:outline-none",
                                selected
                                    ? "bg-primary text-primary-content shadow"
                                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                            )
                        }
                    >
                        Followers
                    </Tab>*/}
                            </Tab.List>
                            <Tab.Panels>
                                <Tab.Panel
                                    className={classNames(
                                        "rounded-xl py-1 lg:p-3",
                                        "focus:outline-none focus:ring-2"
                                    )}
                                >
                                    <Post />
                                </Tab.Panel>
                                <Tab.Panel
                                    className={classNames(
                                        "rounded-xl py-1 lg:p-3",
                                        "focus:outline-none focus:ring-2"
                                    )}
                                >
                                    <PostExplore />
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                    : <>
                        <div className={"prose text-xl lg:text-4xl font-bold text-gray-400 px-2 py-6 lg:mt-8"}>
                            Posts
                        </div>
                        <PostExplore />
                    </>
            }

        </div>
    );
};


function Header() {
    return (
        <header className="flex flex-col items-center mb-20 md:mb-20">
            <Image
                src={thirdwebIcon}
                alt=""
                className="size-[150px] md:size-[150px]"
                style={{
                    filter: "drop-shadow(0px 0px 24px #a726a9a8)",
                }}
            />

            <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
                thirdweb SDK
                <span className="text-zinc-300 inline-block mx-1"> + </span>
                <span className="inline-block -skew-x-6 text-blue-500"> Next.js </span>
            </h1>

            <p className="text-zinc-300 text-base">
                Read the{" "}
                <code className="bg-zinc-800 text-zinc-300 px-2 rounded py-1 text-sm mx-1">
                    README.md
                </code>{" "}
                file to get started.
            </p>
        </header>
    );
}

function ThirdwebResources() {
    return (
        <div className="grid gap-4 lg:grid-cols-3 justify-center">
            <ArticleCard
                title="thirdweb SDK Docs"
                href="https://portal.thirdweb.com/typescript/v5"
                description="thirdweb TypeScript SDK documentation"
            />

            <ArticleCard
                title="Components and Hooks"
                href="https://portal.thirdweb.com/typescript/v5/react"
                description="Learn about the thirdweb React components and hooks in thirdweb SDK"
            />

            <ArticleCard
                title="thirdweb Dashboard"
                href="https://thirdweb.com/dashboard"
                description="Deploy, configure, and manage your smart contracts from the dashboard."
            />
        </div>
    );
}

function ArticleCard(props: {
    title: string;
    href: string;
    description: string;
}) {
    return (
        <a
            href={props.href + "?utm_source=next-template"}
            target="_blank"
            className="flex flex-col border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700"
        >
            <article>
                <h2 className="text-lg font-semibold mb-2">{props.title}</h2>
                <p className="text-sm text-zinc-400">{props.description}</p>
            </article>
        </a>
    );
}
