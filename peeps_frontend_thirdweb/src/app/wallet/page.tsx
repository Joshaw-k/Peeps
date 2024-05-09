"use client";

// import { useConnectWallet } from "@web3-onboard/react";
// import { FaCopy, FaWallet } from "react-icons/fa6";
import { shortenAddress } from "../utils";
import { SendTransaction } from "./components/sendTx";
import { ReceiveTransaction } from "./components/receiveTx";
import ChartTransaction from "./components/chartTx";
import {LucideCopy, LucideWallet, LucideWallet2} from "lucide-react";
import {useActiveWalletChain, useActiveWalletConnectionStatus} from "thirdweb/react";
import { usePeepsContext } from "../context";
import { getWalletBalance } from "thirdweb/wallets";
import {client} from "@/app/client";
import {useEffect, useState} from "react";
import {GetWalletBalanceResult} from "thirdweb/src/wallets/utils/getWalletBalance";

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
    // const [{ wallet }] = useConnectWallet();
    const walletStatus = useActiveWalletConnectionStatus();
    const {activeAddress} = usePeepsContext();
    const connectedChain = useActiveWalletChain();
    const [balance, setBalance] = useState<GetWalletBalanceResult>();

    useEffect(() => {
        if (connectedChain) {
            walletBalance();
        }
    }, [connectedChain, activeAddress]);

    async function walletBalance() {
        console.log("Fetching wallet balance");
        const _balance = await getWalletBalance({
            address: activeAddress,
            client,
            chain: connectedChain,
        });
        console.log("wallet Balance", _balance);
        setBalance(_balance);
    }

    // console.log(wallet?.accounts[0]);
    // console.log(wallet?.accounts[0].balance?.keys);

    if (walletStatus === "disconnected") {
        return (
            <section className="hero min-h-96 card dark:bg-base-100">
                <div className="hero-content flex-col">
                    <div>
                        {/* - Bounce animation */}
                        <LucideWallet size={48} />
                    </div>
                    <div>Connect wallet first</div>
                </div>
            </section>
        );
    }

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
                <LucideWallet /> Address:
              </span>
                            <span className="btn rounded-box flex flex-row items-center gap-4 text-lg z-10">
                <LucideCopy /> Copy
              </span>
                        </div>
                        <div className="text-9xl font-bold">
                            {shortenAddress(activeAddress)}
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 flex-grow-0 self-end">
                        <LucideWallet2
                            size={144}
                            className={"text-base-content/5 opacity-40 -ml-24"}
                        />
                    </div>
                </section>
                {
                    activeAddress && walletStatus === "connected" && (
                        <section className="card rounded-3xl bg-base-200">
                            <section className="card-body flex flex-row">
                                <div className="flex-1">
                                    <div className="text-base-content/40">Balance:</div>
                                    <div className="text-4xl font-bold">
                                        {/*{
                                            wallet?.accounts?.length > 0
                                            ? Object.values(wallet?.accounts[0]?.balance ?? {})
                                            : 0
                                        }{" "}
                                        <span className="text-2xl font-normal">
                                            {
                                                wallet?.accounts?.length > 0 &&
                                                Object.keys(wallet?.accounts[0]?.balance ?? {})
                                            }
                                        </span>*/}
                                        {balance?.displayValue}
                                    </div>
                                </div>
                                {/* <div>
              <div>Token NAME: </div>
            </div> */}
                            </section>
                        </section>
                    )
                }
            </section>

            <section>
                <section className={"mt-28 px-4"}>
                    <header className="font-medium text-xl text-base-content/60">
                        Your tokens on Peeps
                    </header>
                    <section className={"grid grid-cols-3 gap-4 py-8"}>
                        {transactionsGrid.map((eachTxGrid, index) => (
                            <div key={index} className="stats shadow bg-base-200 p-4">
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
                        {nftGrid.map((eachTxGrid, index) => (
                            <div key={index} className="stats shadow bg-base-200 p-4">
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