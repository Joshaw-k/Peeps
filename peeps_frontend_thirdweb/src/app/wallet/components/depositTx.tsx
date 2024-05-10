"use client";

import React, { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ethers } from "ethers";
import { defaultDappAddress } from "../../utils/constants";
import { useRollups } from "../../useRollups";
import { usePeepsContext } from "../../context";
import { ButtonLoader } from "../../components/Button";
import { LucideArrowDownRight, LucideArrowUpRight, LucideX } from "lucide-react";
import { useActiveAccount, useActiveWallet, useActiveWalletChain } from "thirdweb/react";
import { client } from "@/app/client";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { IERC20__factory } from "@cartesi/rollups";
import {localhostChain} from "@/app/components/Navbar";
import {useWallets} from "@web3-onboard/react";


export const DepositTransaction = () => {
    const { activeAddress, baseDappAddress } = usePeepsContext();
    const erc20TokenAdress = "0x2797a6a6D9D94633BA700b52Ad99337DdaFA3f52"
    const activeAccount = useActiveAccount();
    const rollups = useRollups(baseDappAddress);
    const [connectedWallet] = useWallets();
    // const provider = new ethers.providers.Web3Provider(connectedWallet.provider);
    const provider = new ethers.providers.JsonRpcProvider();
    const [dp, setDp] = useState<string>("");
    const [depositDescription, setDepositDescription] = useState<string>("");
    const [depositAddress, setDepositAddress] = useState("");
    const [depositAmount, setDepositAmount] = useState<number>(0);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const connectedChain = useActiveWalletChain();


    const depositErc20ToPortal = async (token: string, amount: number) => {
      // const ethersSigner = await ethers5Adapter.signer.toEthers({
      //   client: client,
      //   chain: localhostChain!,
      //   account: activeAccount!
      // });
      // const ethersProvider = await ethers5Adapter.provider.toEthers({
      //     client: client,
      //     chain: localhostChain!,
      // });
      // const ethersProvider = new ethers.providers.Web3Provider(provider);
      // const ethersProvider = new ethers.providers.JsonRpcProvider();
      // const ethersSigner = ethersProvider.getSigner();
      const ethersSigner = provider.getSigner();
      // console.log("Sigr & Provider", signer, provider);
      // console.log("Ethers Provider", ethersProvider);
    try {
      if (rollups) {
          console.log("Inside rollups", rollups);
        const data = ethers.utils.toUtf8Bytes(
          `Deposited (${amount}) of ERC20 (${token}).`
        );
        //const data = `Deposited ${args.amount} tokens (${args.token}) for DAppERC20Portal(${portalAddress}) (signer: ${address})`;
        // const signer = provider.getSigner();
        // const signerAddress = await signer.getAddress();

        const erc20PortalAddress = rollups.erc20PortalContract.address;
        const tokenContract = ethersSigner
          ? IERC20__factory.connect(token, ethersSigner)
          : IERC20__factory.connect(token, provider);
        console.log("token Contract obj:", tokenContract, activeAddress, erc20PortalAddress);

        // query current allowance
        const currentAllowance = await tokenContract.allowance(
          activeAddress,
          erc20PortalAddress
        );
        // ethersSigner.connect();
        console.log("Current allowance:", currentAllowance);
        if (ethers.utils.parseEther(`${amount}`) > currentAllowance) {
            console.log("enough allowance");
          // Allow portal to withdraw `amount` tokens from signer
          const tx = await tokenContract.approve(
            erc20PortalAddress,
            ethers.utils.parseEther(`${amount}`)
          );
          console.log("Passed approve", tx);
          const receipt = await tx.wait(1);
          const event = (
            await tokenContract.queryFilter(
              tokenContract.filters.Approval(),
              receipt.blockHash
            )
          ).pop();
          if (!event) {
            throw Error(
              `could not approve ${amount} tokens for DAppERC20Portal(${erc20PortalAddress})  (signer: ${activeAddress}, tx: ${tx.hash})`
            );
          }
        }

        await rollups.erc20PortalContract.depositERC20Tokens(
          token,
          baseDappAddress,
          ethers.utils.parseEther(`${amount}`),
          data
        );
      }
    } catch (e) {
      console.log(`${e}`);
    }
  };

    const handleSubmit = async(e:any) => {
      e.preventDefault()
        setIsSubmit(true);
        // construct the json payload to send to addInput
        // const jsonPayload = JSON.stringify({
        //   method: "sendToken",
        //   data: {
        //     address: depositAddress,
        //     amount: depositAmount,
        //   },
        // });
        // addInput(JSON.stringify(jsonPayload));
        // console.log(JSON.stringify(jsonPayload));
       const txReceipt = await depositErc20ToPortal(erc20TokenAdress,depositAmount)
       console.log(txReceipt)
    };

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
                <button
                    type="button"
                    className="btn bg-white text-walletDark hover:text-white btn-lg rounded-box inline-flex w-auto items-center justify-center font-medium text-base leading-none outline-none outline-0"
                >
                    Deposit <LucideArrowDownRight />
                </button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="bg-black/40 bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 dark:bg-base-300/80 dark:backdrop-blur-sm z-30" />
                <AlertDialog.Content className="z-40 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[800px] bg-base-100 translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none dark:bg-base-100">
                    <AlertDialog.Title className="text-mauve12 mt-4 mb-12 text-xl text-center font-bold">
                        Deposit Token
                    </AlertDialog.Title>
                    <AlertDialog.Description className="text-[15px] text-center leading-normal">
                        {/* We require this to serve the best experience */}
                        <div className="card items-center shrink-0 my-4 w-full bg-base-100">
                            <form className="card-body w-full" onSubmit={handleSubmit}>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Amount to deposit</span>
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Amount"
                                        className="input input-bordered"
                                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                                        required
                                    />
                                </div>
                                <div className="form-control mt-6">
                                    <button
                                        type="submit"
                                        className="btn btn-primary rounded-xl"
                                    >
                                        {isSubmit ? <ButtonLoader /> : "Deposit"}
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