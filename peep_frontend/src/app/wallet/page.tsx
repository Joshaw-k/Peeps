"use client";

import { useConnectWallet } from "@web3-onboard/react";
import { FaCopy, FaWallet } from "react-icons/fa6";
import { shortenAddress } from "../utils";
import { SendTransaction } from "./components/sendTx";
import { ReceiveTransaction } from "./components/receiveTx";
import ChartTransaction from "./components/chartTx";
import toast from "react-hot-toast";
import { EmptyPage } from "../components/EmptyPage";
import { CustomToastUI } from "../components/ToastUI";

const transactionsGrid = [
  {
    type: "sent",
    value: "0.0",
  },
  {
    type: "spent",
    value: "0.0",
  },
  {
    type: "received",
    value: "0.0",
  },
];

const nftGrid = [
  {
    type: "sent",
    value: "0.0",
  },
  {
    type: "spent",
    value: "0.0",
  },
  {
    type: "received",
    value: "0.0",
  },
  {
    type: "received",
    value: "0.0",
  },
];

const Wallet = () => {
  const [{ wallet }] = useConnectWallet();

  console.log(wallet?.accounts[0]);
  console.log(wallet?.accounts[0].balance?.keys);

  if (!wallet || wallet?.accounts.length < 1) {
    return (
      <EmptyPage
        icon={<FaWallet size={48} />}
        text={"Connect wallet first"}
      ></EmptyPage>
    );
  }

  const copyAddress = () => {
    // toast("Address copied");
    toast.custom((t) => (
      // <div
      //   className={`${
      //     t.visible ? "animate-enter" : "animate-leave"
      //   } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      // >
      //   <div className="flex-1 w-0 p-4">
      //     <div className="flex items-start">
      //       <div className="flex-shrink-0 pt-0.5">
      //         <div className="h-10 w-10 rounded-full">
      //           <img
      //             className="h-full w-full rounded-full"
      //             src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
      //             alt=""
      //           />
      //         </div>
      //       </div>
      //       <div className="ml-3 flex-1">
      //         <p className="text-sm font-medium text-gray-900">
      //
      //         </p>
      //         <p className="mt-1 text-sm text-gray-500">
      //           Address has been copied
      //         </p>
      //       </div>
      //     </div>
      //   </div>
      //   <div className="flex border-l border-gray-200">
      //     <button
      //       onClick={() => toast.dismiss(t.id)}
      //       className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      //     >
      //       Close
      //     </button>
      //   </div>
      // </div>
      <CustomToastUI t={t} message={"Address has been copied"}></CustomToastUI>
    ));
  };

  return (
    <section>
      {/* Financial Transactions */}
      <section className="space-x-8 mb-4">
        <SendTransaction />
        <ReceiveTransaction />
      </section>

      {/* This is the wallet page */}
      <section className="bg-base-200 rounded-3xl px-4">
        <section className="relative flex flex-row px-2 py-12">
          <div className="flex-1">
            <div className="flex flex-row items-center px-6 text-xl text-base-content/20">
              <span className="flex-1 flex flex-row items-center gap-4">
                <FaWallet /> Address:
              </span>
              <span
                className="btn rounded-box flex flex-row items-center gap-4 text-lg z-10"
                onClick={copyAddress}
              >
                <FaCopy /> Copy
              </span>
            </div>
            <div className="text-9xl font-bold">
              {shortenAddress(wallet?.accounts[0].address)}
            </div>
          </div>
          <div className="absolute top-0 right-0 flex-grow-0 self-end">
            <FaWallet
              size={144}
              className={"text-base-content/5 opacity-40 -ml-24"}
            />
          </div>
        </section>
        {wallet?.accounts?.length > 0 && (
          <section className="card rounded-3xl bg-base-200">
            <section className="card-body flex flex-row">
              <div className="flex-1">
                <div className="text-base-content/40">Balance: </div>
                <div className="text-4xl font-bold">
                  {wallet?.accounts?.length > 0
                    ? Object.values(wallet?.accounts[0]?.balance ?? {})
                    : 0}{" "}
                  <span className="text-2xl font-normal">
                    {wallet?.accounts?.length > 0 &&
                      Object.keys(wallet?.accounts[0]?.balance ?? {})}
                  </span>
                </div>
              </div>
              {/* <div>
              <div>Token NAME: </div>
            </div> */}
            </section>
          </section>
        )}
      </section>

      <section>
        <section className={"mt-28 px-4"}>
          <header className="font-medium text-xl text-base-content/60">
            Your tokens on Peeps
          </header>
          <section className={"grid grid-cols-3 gap-4 py-8"}>
            {transactionsGrid.map((eachTxGrid) => (
              <div className="stats shadow bg-base-200 p-4">
                <div className="stat">
                  <div className="stat-title capitalize">{eachTxGrid.type}</div>
                  <div className="stat-value text-5xl">{eachTxGrid.value}</div>
                  {/* <div className="stat-desc">21% more than last month</div> */}
                </div>
              </div>
            ))}
          </section>
        </section>

        <section className={"mt-28 px-4"}>
          <header className="font-medium text-xl text-base-content/60">
            Your NFTs
          </header>
          <section
            className={"flex flex-row flex-nowrap gap-4 py-8 overflow-x-auto"}
          >
            {nftGrid.map((eachTxGrid) => (
              <div className="stats shadow bg-base-200 p-4">
                <div className="stat">
                  <div className="stat-title capitalize">{eachTxGrid.type}</div>
                  <div className="stat-value text-5xl">{eachTxGrid.value}</div>
                  {/* <div className="stat-desc">21% more than last month</div> */}
                </div>
              </div>
            ))}
          </section>
        </section>
      </section>

      <section className={"mt-28 px-4"}>
        <header className="py-8 font-medium text-xl text-base-content/60">
          Charts and Overview
        </header>
        <ChartTransaction />
      </section>
    </section>
  );
};

export default Wallet;
