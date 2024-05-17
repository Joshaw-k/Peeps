"use client";

import React, { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ethers } from "ethers";
import {LucideArrowUpRight, LucideHandCoins, LucideX} from "lucide-react";
import {usePeepsContext} from "@/app/context";
import {useRollups} from "@/app/useRollups";
import { ButtonLoader } from "./Button";
import { useActiveAccount } from "thirdweb/react";
import toast from "react-hot-toast";
import { erc20Address } from "../utils/constants";

export const TipModal = ({address}: {address: string}) => {
    const { baseDappAddress } = usePeepsContext();
    const rollups = useRollups(baseDappAddress);
    const activeAccount = useActiveAccount();
    const [dp, setDp] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [depositAddress, setDepositAddress] = useState("");
    const [transferAmount, setTransferAmount] = useState<number>(0);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const transferErc20ToPortal = async () => {
        try {
            if (rollups && activeAccount) {
                const input_obj = {

                    method: "erc20_transfer",
                    args: {
                        to: address,
                        amount: `${ethers.utils.parseEther(`${transferAmount}`)}`,
                        erc20: erc20Address
                    },
                };
                const data = JSON.stringify(input_obj);
                let payload = ethers.utils.toUtf8Bytes(data);
                await rollups.inputContract.addInput(baseDappAddress, payload);
                setIsModalOpen(false);
                toast.success("Transfer successful");
            }
        } catch (e) {
            console.log(e);
            setIsModalOpen(false);
            toast.error("Transfer failed");
        }
        // "Unload" the submit button
        setIsSubmit(false);
    };

    const handleSendToken = async (e: any) => {
        e.preventDefault()
        setIsSubmit(true);
        await transferErc20ToPortal()
    };

    return (
        <AlertDialog.Root open={isModalOpen}>
            <AlertDialog.Trigger asChild>
                <div
                    className={"absolute right-0 btn btn-sm md:btn-md btn-ghost rounded-box font-normal text-xs flex flex-row items-center lg:gap-x-3"}
                    onClick={() => setIsModalOpen(true)}
                >
                    <LucideHandCoins size={8} width={18} height={18} className={"text-xs"}/>
                </div>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay
                    className="bg-black/40 bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 dark:bg-base-300/80 dark:backdrop-blur-sm z-30" />
                <AlertDialog.Content className="z-40 data-[state=open]:animate-contentShow fixed bottom-4 left-[50%] max-h-[85vh] w-[96vw] lg:w-[90vw] max-w-[540px] bg-base-100 translate-x-[-50%] lg:translate-y-[-50%] rounded-lg py-1 lg:p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none dark:bg-base-100">
                    <AlertDialog.Title className="text-mauve12 mt-12 mb-4 lg:mt-4 lg:mb-8 text-xl text-center font-bold">
                        Tip User
                    </AlertDialog.Title>
                    <AlertDialog.Description className="text-[15px] text-center leading-normal">
                        {/* We require this to serve the best experience */}
                        <div className="card items-center shrink-0 my-0 lg:my-4 w-full bg-base-100">
                            <form className="card-body w-full" onSubmit={handleSendToken}>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Address to send token</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Address to send token"
                                        className="input input-bordered readonly:bg-base-200"
                                        defaultValue={address}
                                        onChange={(e) => setDepositAddress(e.target.value)}
                                        readOnly={true}
                                        disabled
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Amount to send</span>
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Amount"
                                        className="input input-bordered"
                                        onChange={(e) => setTransferAmount(Number(e.target.value))}
                                        required
                                    />
                                </div>
                                {/*<div className="form-control">
                                    <label className="label">
                    <span className="label-text">
                      Describe this transaction
                    </span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-lg textarea-bordered text-base resize-none"
                                        placeholder="describe this transaction. It will help track older transactions"
                                        onChange={(e) => setDepositDescription(e.target.value)}
                                    ></textarea>
                                </div>*/}
                                <div className="form-control mt-6">
                                    <button
                                        type="submit"
                                        className="btn btn-primary dark:bg-[#4563eb] dark:border-0 rounded-xl"
                                    >
                                        {isSubmit ? <ButtonLoader /> : "Send"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </AlertDialog.Description>
                    <div className="absolute top-8 right-4 flex justify-end gap-[25px]">
                        <AlertDialog.Cancel asChild>
                            <button
                                title="Close Send token dialog"
                                type="button"
                                className="btn size-12 rounded-full text-xl"
                                aria-label="Close"
                                onClick={() => setIsModalOpen(false)}
                            >
                                {/* <Cross2Icon size={64} /> */}
                                <LucideX />
                            </button>
                        </AlertDialog.Cancel>
                        {/* <AlertDialog.Action asChild>
            <button className="text-red11 bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
              Yes, delete account
            </button>
          </AlertDialog.Action> */}
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
};