"use client";

import { LucideHome, LucidePlus, LucideSearch, LucideTrendingUp, LucideWallet2 } from "lucide-react";
import { AvatarProfileSmall } from "./Avatar";
import React from "react";
import Link from "next/link";
import { usePeepsContext } from "../context";
import { useActiveWalletConnectionStatus } from "thirdweb/react";
import { PostFormModal } from "@/app/components/postFormModal";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

export const MobileNavigation = () => {
    const {
      activeAddress,
        userData,
        hasProfile,
    } = usePeepsContext();
    const walletStatus = useActiveWalletConnectionStatus();
    const pathname = usePathname();

    return (
        <ul className="fixed bottom-0 w-full mx-auto bg-base-200 dark:bg-base-300 menu menu-horizontal justify-center border-t-2 border-base-100 dark:border-[#4563eb] px-0 lg:hidden *:flex-1 gap-x-0.5 *:flex *:flex-row *:justify-center *:items-center">
            <li>
                <Link
                    href={"/"}
                    className={"flex flex-row flex-nowrap justify-center text-center rounded-xl"}>
                    <LucideHome size={16} strokeWidth={4} />
                    {/*<span>Search</span>*/}
                    {/*<span className="badge badge-sm badge-info">new</span>*/}
                </Link>
            </li>
            <li>
                <Link href={"/trending"} className={"flex flex-row flex-nowrap justify-center text-center rounded-xl active:bg-base-300"}>
                    <LucideSearch size={16} strokeWidth={4} />
                    {/* <LucideTrendingUp size={16} strokeWidth={4} /> */}
                    {/*<span className="badge badge-sm badge-warning">NEW</span>*/}
                </Link>
            </li>
            {
                pathname === "/" &&
                (
                    walletStatus === "connected"
                        ? <li>
                            <PostFormModal />
                        </li>
                        : <li>
                            <div
                                className={"flex flex-row flex-nowrap justify-center text-center bg-primary-content dark:bg-[#4563eb]/40 rounded-box"}
                                onClick={() => toast("Sign in to make a Post")}
                            >
                                <LucidePlus size={24} strokeWidth={4} />
                            </div>
                        </li>
                )
            }
            <li>
                <Link href={"/wallet"}
                    className={"flex flex-row flex-nowrap text-center rounded-xl text-ellipsis overflow-x-hidden whitespace-nowrap"}>
                    <LucideWallet2 size={16} strokeWidth={4} />
                    {/*<span>Trending</span>*/}
                    {/*<span className="badge badge-sm">99+</span>*/}
                </Link>
            </li>
            <li>
                <Link href={walletStatus === "connected" ? (userData?.user === activeAddress ? `/profile/me` : `/profile/${userData?.username}`) : ""}
                    className={"flex flex-row flex-nowrap gap-x-3 rounded-xl active:bg-base-300"}>
                    <div className={"relative"}>
                        <AvatarProfileSmall src={userData?.profilePicture} />
                        {
                            walletStatus === "connected" && !hasProfile &&
                            <span className="absolute top-0 -right-2 badge badge-xs badge-warning"></span>
                        }
                    </div>
                    {/*{userData?.username && <span className={"text-ellipsis overflow-hidden"}>{userData?.username}</span>}*/}
                </Link>
            </li>
        </ul>
    )
}