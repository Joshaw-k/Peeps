"use client";

import {LucideSearch, LucideTrendingUp} from "lucide-react";
import {AvatarProfileSmall} from "./Avatar";
import React from "react";
import Link from "next/link";
import {usePeepsContext} from "../context";
import {useAccount} from "wagmi";

export const MobileNavigation = () => {
    const {
        wallet,
        currentUser,
        userCreated,
        checkProfileExist,
        userData,
        setHasProfile,
        hasProfile,
    } = usePeepsContext();
    const {isConnected} = useAccount();

    return (
        <ul className="fixed bottom-0 w-full mx-auto menu bg-base-200 menu-horizontal justify-center items-center border-t-2 border-indigo-600 px-0 lg:hidden *:flex-1">
            <li>
                <Link href={`/profile/${userData?.username}`} className={"flex flex-row flex-nowrap gap-x-3 active:bg-base-300"}>
                    <AvatarProfileSmall src={""} />
                    <span className={"text-ellipsis overflow-hidden"}>{"Mayowa"}</span>
                    {
                        isConnected && !hasProfile &&
                        <span className="badge badge-xs badge-warning"></span>
                    }
                </Link>
            </li>
            <li>
                <Link href={""} className={"flex flex-row flex-nowrap justify-center text-center active:bg-base-300"}>
                    <LucideSearch size={16} strokeWidth={4}/>
                    <span>Search</span>
                    {/*<span className="badge badge-sm badge-warning">NEW</span>*/}
                </Link>
            </li>
            <li>
                <Link href={"/trending"} className={"flex flex-row flex-nowrap text-center text-ellipsis overflow-x-hidden whitespace-nowrap"}>
                    <LucideTrendingUp size={16} strokeWidth={4}/>
                    <span>Trending</span>
                    <span className="badge badge-sm">99+</span>
                </Link>
            </li>
        </ul>
    )
}