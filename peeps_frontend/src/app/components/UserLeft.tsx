"use client";

import Link from "next/link";
import { ProfileForm } from "./ProfileForm";
import { useEffect, useState } from "react";
import { usePeepsContext } from "../context";

import Image from "next/image";
import {
  useActiveAccount,
  useActiveWalletConnectionStatus,
  useConnect,
} from "thirdweb/react";
import { LucideWallet2 } from "lucide-react";

const defaultImage: string =
  "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg";

export const Avatar = ({ profileImage }: { profileImage: string }) => {
  return (
    <div className="avatar placeholder">
      <div className="w-12 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-2">
        {profileImage ? (
          <Image width={30} height={30} src={profileImage} alt="" />
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
};

export const NoProfileCard = () => {
  return (
    <div className={"card card-compact bg-amber-400/40 my-4"}>
      <div className="card-body">
        <div className="card-title">Action Required</div>
        You have not created your profile
        <ProfileForm />
      </div>
    </div>
  );
};

export const NoSignInCard = () => {
  return (
    <div className={"card card-compact bg-blue-600/80 my-4"}>
      <div className="card-body">
        <div className="card-title">Action Required</div>
        Sign in to create your Peep.
      </div>
    </div>
  );
};

export const UserLeft = () => {
  const {
    activeAddress,
    checkProfileExist,
    userData,
    hasProfile,
    profileChanged,
  } = usePeepsContext();
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;
  const walletStatus = useActiveWalletConnectionStatus();

  useEffect(() => {
    checkProfileExist();
  }, [walletStatus, hasProfile, profileChanged]);

  return (
    <>
      <div className="hidden lg:hidden absolute left-24 bottom-10 card w-full lg:max-w-[280px] bg-base-200/80 opacity-60">
        <div className="card-body">
          <div className="font-bold">Ad</div>
          Play your favourite games on a web3 decentralized platform.
        </div>
      </div>
      <section
        className={`hidden lg:block w-full sticky lg:top-28 lg:w-[60%] mx-auto px-2`}
      >
        <div
          className={
            "card card-bordered bg-gray-200 dark:bg-base-300/80 p-4 flex flex-row items-center gap-x-4"
          }
        >
          {walletStatus === "connected" && hasProfile ? (
            <>
              <Avatar profileImage={userData?.profilePicture} />
              <div className="grow">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-white">
                  {userData?.displayName ? userData?.displayName : "Anonymous"}
                </h4>
                <div className="text-sm text-gray-800 md:text-gray-500 dark:text-white md:dark:text-gray-500 keep-all overflow-x-hidden text-ellipsis">
                  @{userData?.username ? userData?.username : "Anonymous"}
                </div>
              </div>
            </>
          ) : (
            <>
              {walletStatus === "connecting" ? (
                <>
                  <div className="avatar">
                    <div className="w-12 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-2">
                      <div className="skeleton w-12 h-12 rounded-full"></div>
                    </div>
                  </div>
                  <div className="grow space-y-2">
                    <h4 className="skeleton w-full h-6 max-w-sm"></h4>
                    <p className="skeleton w-20 h-4"></p>
                  </div>
                </>
              ) : (
                <>
                  <div className="avatar">
                    <div className="w-12 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-2">
                      <div className="w-12 h-12 rounded-full"></div>
                    </div>
                  </div>
                  <div className="grow space-y-2">
                    <h4 className="w-full h-6 max-w-sm bg-base-200 rounded-full"></h4>
                    <p className="w-20 h-4 bg-base-200 rounded-full"></p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        {walletStatus === "connected" && hasProfile ? (
          <div
            className={"card card-compact bg-gray-200 dark:bg-base-300/80 my-1"}
          >
            <div className="card-body">
              <div className="font-bold text-xs">About me</div>
              <div className={"keep-all overflow-x-hidden text-ellipsis"}>
                {userData?.bio ? userData?.bio : "***"}
              </div>
            </div>
          </div>
        ) : null}
        {walletStatus === "connected" && !hasProfile && <NoProfileCard />}
        {walletStatus === "disconnected" && <NoSignInCard />}
        <div>
          <ul className="lg:menu menu-md lg:py-4 gap-y-2 lg:[&_a]:py-4">
            {walletStatus === "connected" && hasProfile && (
              <li>
                <Link
                  href={
                    userData?.wallet === activeAddress
                      ? `/profile/me`
                      : `/profile/${userData?.username}`
                  }
                  className="space-x-2 hover:bg-gray-100 dark:hover:bg-base-200"
                >
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="18" cy="15" r="3" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M10 15H6a4 4 0 0 0-4 4v2" />
                    <path d="m21.7 16.4-.9-.3" />
                    <path d="m15.2 13.9-.9-.3" />
                    <path d="m16.6 18.7.3-.9" />
                    <path d="m19.1 12.2.3-.9" />
                    <path d="m19.6 18.7-.4-1" />
                    <path d="m16.8 12.3-.4-1" />
                    <path d="m14.3 16.6 1-.4" />
                    <path d="m20.7 13.8 1-.4" />
                  </svg>

                  <span>Account</span>
                </Link>
              </li>
            )}
            {walletStatus === "connected" && (
              <li>
                <Link href={"/wallet"} className="space-x-2 hover:bg-gray-100 dark:hover:bg-base-200 active:bg-green-400 dark:active:bg-green-600">
                  <LucideWallet2 width={20} height={20} />
                  <span>Wallet</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </section>
    </>
  );
};
