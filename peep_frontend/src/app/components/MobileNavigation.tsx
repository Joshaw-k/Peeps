"use client";

import {LucideHome, LucideSearch, LucideTrendingUp} from "lucide-react";
import {AvatarProfileSmall} from "./Avatar";
import React from "react";
import Link from "next/link";
import {usePeepsContext} from "../context";
import {useAccount} from "wagmi";
import classNames from "classnames";

export const MobileNavigation = () => {
    const {
        currentUser,
        userCreated,
        checkProfileExist,
        userData,
        setHasProfile,
        hasProfile,
    } = usePeepsContext();
    const {isConnected} = useAccount();

    return (
        <ul className="fixed bottom-0 w-full mx-auto bg-base-200 menu menu-horizontal justify-center border-t-2 border-base-100 dark:border-indigo-600 px-0 lg:hidden *:flex-1 gap-x-0.5 *:flex *:flex-row *:justify-center *:items-center">
            <li>
                <Link
                    href={"/"}
                    className={"flex flex-row flex-nowrap justify-center text-center"}>
                    <LucideHome size={16} strokeWidth={4}/>
                    {/*<span>Search</span>*/}
                    {/*<span className="badge badge-sm badge-info">new</span>*/}
                </Link>
            </li>
            <li>
                <Link href={"/search"} className={"flex flex-row flex-nowrap justify-center text-center active:bg-base-300"}>
                    <LucideSearch size={16} strokeWidth={4}/>
                    {/*<span>Search</span>*/}
                    {/*<span className="badge badge-sm badge-warning">NEW</span>*/}
                </Link>
            </li>
            <li>
                <Link href={"/trending"}
                      className={"flex flex-row flex-nowrap text-center text-ellipsis overflow-x-hidden whitespace-nowrap"}>
                    <LucideTrendingUp size={16} strokeWidth={4}/>
                    {/*<span>Trending</span>*/}
                    {/*<span className="badge badge-sm">99+</span>*/}
                </Link>
            </li>
            <li>
                <Link href={`/profile/${userData?.username}`}
                      className={"flex flex-row flex-nowrap gap-x-3 active:bg-base-300"}>
                    <div className={"relative"}>
                        <AvatarProfileSmall src={""}/>
                        {
                            isConnected && !hasProfile &&
                            <span className="absolute top-0 -right-2 badge badge-xs badge-warning"></span>
                        }
                    </div>
                    {/*{userData?.username && <span className={"text-ellipsis overflow-hidden"}>{userData?.username}</span>}*/}
                </Link>
            </li>
        </ul>
    )
}