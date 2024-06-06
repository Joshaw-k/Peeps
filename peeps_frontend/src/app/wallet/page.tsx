"use client";

// import { useConnectWallet } from "@web3-onboard/react";
// import { FaCopy, FaWallet } from "react-icons/fa6";
import { shortenAddress } from "../utils";
import { LucideCopy, LucideWallet, LucideWallet2 } from "lucide-react";
import { useActiveWalletChain, useActiveWalletConnectionStatus } from "thirdweb/react";
import { usePeepsContext } from "../context";
import { getWalletBalance } from "thirdweb/wallets";
import { client } from "@/app/client";
import { memo, useEffect, useMemo, useState } from "react";
import { GetWalletBalanceResult } from "thirdweb/src/wallets/utils/getWalletBalance";
import { TransferTransaction } from "./components/transferTx";
import { WithDrawTransaction } from "./components/withdrawTx";
import { Balance } from "./balance";
import { FreeMintTransaction } from "./components/freeMint";
import Voucher from "./components/Voucher";
import { DepositTransaction } from "./components/depositTx";


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
    const { walletBalance } = usePeepsContext();
    // const [{ wallet }] = useConnectWallet();
    const walletStatus = useActiveWalletConnectionStatus();
    const { activeAddress } = usePeepsContext();
    const connectedChain = useActiveWalletChain();
    // const balance = useMemo(() => Balance(), []);
    // const balance = Balance();
    // console.log("balance", balance);
    // console.log("Wallet balance", balance, walletBalance);
    const [transactionsGrid, setTransactionsGrid] = useState([
        {
            type: "Balance",
            value: walletBalance,
        },
        {
            type: "spent",
            value: "0.0",
        },
        {
            type: "received",
            value: "0.0",
        },
    ]);

    useEffect(() => {
        console.log("Wallet balance set transaction grid");
        setTransactionsGrid([
            {
                type: "Balance",
                value: walletBalance,
            },
            {
                type: "spent",
                value: "0.0",
            },
            {
                type: "received",
                value: "0.0",
            },
        ])
    }, [walletBalance]);


    // useEffect(() => {
    //     if (connectedChain) {
    //         // walletBalance();
    //         console.log(balance)
    //     }
    // }, [connectedChain, activeAddress]);

    // async function walletBalance() {
    //     console.log("Fetching wallet balance");
    //     const _balance = await getWalletBalance({
    //         address: activeAddress,
    //         client,
    //         chain: connectedChain!,
    //     });
    //     console.log("wallet Balance", _balance);
    //     setBalance(_balance);
    // }

    // console.log(wallet?.accounts[0]);
    // console.log(wallet?.accounts[0].balance?.keys);

    if (walletStatus === "disconnected") {
        return (
            <section className="hero min-h-96 card dark:bg-transparent">
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

            {/* This is the wallet page */}
            <section className="bg-base-300 lg:bg-base-200 rounded-xl lg:rounded-3xl px-4 pb-4">
                <section className="relative flex flex-row px-2 py-12">
                    <div className="flex-1">
                        <div className="flex flex-row items-center px-2 lg:px-6 text-xl text-base-content/20">
                            <span className="flex-1 flex flex-row items-center gap-4">
                                <LucideWallet /> Address:
                            </span>
                            <span className="btn rounded-box flex flex-row items-center gap-4 text-lg z-10">
                                <LucideCopy /> Copy
                            </span>
                        </div>
                        <div className="text-5xl lg:text-6xl font-bold">
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
                    activeAddress && walletStatus === "connected"
                        ? (
                            <section className="flex flex-row flex-wrap justify-around lg:justify-start gap-2 lg:space-x-8 mb-4 *:flex-1 lg:*:flex-0">
                                {/* Financial Transactions */}
                                <DepositTransaction />
                                <TransferTransaction />
                                <WithDrawTransaction />
                                <FreeMintTransaction />
                            </section>
                        )
                        : <section className="flex flex-row flex-wrap justify-around lg:justify-start gap-2 lg:space-x-8 mb-4">
                            <div className="skeleton min-w-40 h-16"></div>
                            <div className="skeleton min-w-40 h-16"></div>
                            <div className="skeleton min-w-40 h-16"></div>
                            <div className="skeleton min-w-40 h-16"></div>
                        </section>
                }
            </section>
            <section className={"mt-16 px-2"}>
                <header className="font-medium text-xl text-base-content/60">
                    Your Token details on Peeps
                </header>
                <section className={"grid grid-cols-3 gap-4 py-4"}>
                    {transactionsGrid.map((eachTxGrid, index) => (
                        <div key={index} className="stats shadow bg-base-200 lg:p-4">
                            <div className="stat">
                                <div className="stat-title capitalize">{eachTxGrid.type}</div>
                                <div className="stat-value text-5xl">{eachTxGrid.value}</div>
                                {/* <div className="stat-desc">21% more than last month</div> */}
                            </div>
                        </div>
                    ))}
                </section>
            </section>

            <section>
                <section className={"mt-16 lg:mt-28 px-4"}>
                    <header className="font-medium text-xl text-base-content/60">
                        Your Voucher History
                    </header>
                    <Voucher />
                </section>

                <section className={"mt-16 lg:mt-28 px-4"}>
                    <header className="font-medium text-xl text-base-content/60">
                        Your NFTs
                    </header>
                    <section
                        className={"flex flex-row flex-nowrap gap-4 py-8 overflow-x-auto"}
                    >
                        {nftGrid.map((eachTxGrid, index) => (
                            <div key={index} className="stats shadow bg-base-200 min-w-40 lg:p-4">
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

            {/* <section className={"mt-28 px-4"}>
                <header className="py-8 font-medium text-xl text-base-content/60">
                    Charts and Overview
                </header>
                <ChartTransaction />
            </section> */}
        </section>
    );
};

export default memo(Wallet);