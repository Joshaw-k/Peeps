"use client";

import Link from "next/link";
import { FaGear, FaWallet } from "react-icons/fa6";
import { ProfileForm } from "./ProfileForm";
import { useConnectWallet } from "@web3-onboard/react";
import { useNotices } from "./useNotices";
import { useEffect, useState } from "react";
import { usePeepsContext } from "../context";
import Image from "next/image";

const defaultImage: string =
  "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg";

const Avatar = (profileImage: any) => {
  return (
    <div className="avatar">
      <div className="w-12 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-2">
        <Image width={30} height={30} src={profileImage} alt="" />
      </div>
    </div>
  );
};

export const UserLeft = () => {
  // const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const {
    wallet,
    currentUser,
    userCreated,
    checkProfileExist,
    userData,
    setHasProfile,
    hasProfile,
    profileChanged,
  } = usePeepsContext();

  console.log(userData);

  useEffect(() => {
    checkProfileExist();
  }, [wallet, hasProfile, profileChanged]);

  useEffect(() => {}, [userData]);

  return (
    <>
      <div className="absolute left-24 bottom-10 card max-w-[280px] bg-base-200/80 opacity-60">
        <div className="card-body">
          <div className="font-bold">Ad</div>
          Play your favourite games on a web3 decentralized platform.
        </div>
      </div>
      <section className={`sticky top-28 w-[60%] mx-auto`}>
        <div
          className={
            "card card-bordered bg-base-200 p-4 flex flex-row items-center gap-x-4"
          }
        >
          {wallet && hasProfile ? (
            <>
              <div className="avatar">
                <div className="w-12 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-2">
                  <Image
                    width={30}
                    height={30}
                    src={userData?.profilePicture}
                    alt=""
                  />
                </div>
              </div>
              <div className="grow">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-white">
                  {userData?.displayName ? userData?.displayName : "Anonymous"}
                </h4>
                <p className="text-sm text-gray-800 md:text-gray-500 dark:text-white md:dark:text-gray-500">
                  @{userData?.username ? userData?.username : "Anonymous"}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="avatar">
                <div className="w-12 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-2">
                  <Image width={30} height={30} src={defaultImage} alt="" />
                </div>
              </div>
              <div className="grow">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-white">
                  {"Anonymous"}
                </h4>
                <p className="text-sm text-gray-800 md:text-gray-500 dark:text-white md:dark:text-gray-500">
                  @Anonymous
                </p>
              </div>
            </>
          )}
        </div>
        {wallet && hasProfile ? (
          <div className={"card card-compact bg-base-200 my-1"}>
            <div className="card-body">
              <div className="font-bold text-xs">About me</div>
              {userData?.bio ? userData?.bio : "*********"}
            </div>
          </div>
        ) : null}
        {wallet && !hasProfile && (
          <div className={"card card-compact bg-amber-400/40 my-4"}>
            <div className="card-body">
              <div className="card-title">Action Required</div>
              You have not created your profile
              <ProfileForm />
            </div>
          </div>
        )}
        <div>
          <ul className="menu menu-md py-4 gap-y-2 [&_a]:py-4">
            {wallet && hasProfile && (
              <li>
                <Link
                  href={`/profile/${userData?.username}`}
                  className="space-x-2"
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

            {/* <li>
            <Link href={"/wallet"} className="space-x-2">
              <FaWallet />
              <span>Wallet</span>
            </Link>
          </li> */}
            {/* <li>
            <Link href={"/settings"} className="space-x-2">
              <FaGear />
              <FcSettings />
              <span>Options</span>
            </Link>
          </li> */}
            {/* <li>
            <Link href={""} className="space-x-2">
              Logout
            </Link>
          </li> */}
          </ul>
        </div>
      </section>
    </>
  );
};
