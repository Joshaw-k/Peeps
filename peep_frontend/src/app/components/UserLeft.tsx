"use client";

import Link from "next/link";
import { FaGear, FaWallet } from "react-icons/fa6";
import { ProfileForm } from "./ProfileForm";
import { useConnectWallet } from "@web3-onboard/react";
import { useNotices } from "./useNotices";
import { useEffect, useState } from "react";
import { usePeepsContext } from "../context";

const Avatar = () => {
  return (
    <div className="avatar">
      <div className="w-12 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-2">
        <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
      </div>
    </div>
  );
};

export const UserLeft = () => {
  // const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const { wallet, currentUser, userCreated } = usePeepsContext();
  // const { data, notices } = useNotices();
  // const [currentUser, setCurrentUser] = useState();
  // const latestNotices = notices ? notices?.reverse()[0] : null;
  // const usersInLatestNotices = latestNotices
  //   ? JSON.parse(latestNotices.payload).users
  //   : [];
  // const userCreated = usersInLatestNotices
  //   ? usersInLatestNotices.filter(
  //       (it) => it.address === wallet?.accounts[0].address
  //     )
  //   : false;
  // // console.log(userCreated);

  // useEffect(() => {
  //   console.log(notices);
  //   if (notices !== undefined && notices?.length > 0) {
  //     // notices ??
  //     setCurrentUser(
  //       JSON.parse(notices?.reverse()[0].payload).users.filter(
  //         (it: any) => it.address === wallet?.accounts[0].address
  //       )
  //     );
  //     console.log(
  //       JSON.parse(notices?.reverse()[0].payload).users.filter(
  //         (it: any) => it.address === wallet?.accounts[0].address
  //       )
  //     );
  //   }
  // }, [wallet?.accounts[0].address]);

  // console.log(notices?.reverse()[0].payload);
  console.log(currentUser);
  console.log(userCreated);

  return (
    <section className={"sticky top-28 w-[60%] mx-auto"}>
      <div
        className={
          "card card-bordered bg-base-200 p-4 flex flex-row items-center gap-x-4"
        }
      >
        <Avatar />
        {currentUser?.length > 0 ? (
          <div className="grow">
            <h4 className="font-semibold text-sm text-gray-800 dark:text-white">
              {currentUser[0]?.username}
            </h4>
            <p className="text-sm text-gray-800 md:text-gray-500 dark:text-white md:dark:text-gray-500">
              @{currentUser[0]?.username}
            </p>
          </div>
        ) : (
          <div className="grow">
            <h4 className="font-semibold text-sm text-gray-800 dark:text-white">
              {"Anonymous"}
            </h4>
            <p className="text-sm text-gray-800 md:text-gray-500 dark:text-white md:dark:text-gray-500">
              ...
            </p>
          </div>
        )}
      </div>
      {currentUser?.length > 0 ? (
        <div className={"card card-compact bg-base-200 my-1"}>
          <div className="card-body">
            <div className="font-bold text-xs">About me</div>
            {currentUser[0].bio}
          </div>
        </div>
      ) : null}
      {!userCreated && (
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
          <li>
            <Link href="/profile" className="space-x-2">
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
          <li>
            <Link href={"/wallet"} className="space-x-2">
              <FaWallet />
              <span>Wallet</span>
            </Link>
          </li>
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
  );
};
