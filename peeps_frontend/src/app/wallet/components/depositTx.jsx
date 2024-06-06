"use client";

import React, { useEffect, useRef, useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ethers } from "ethers";
import { defaultDappAddress, erc20Address, PEEPS_SEPOLIA_ARBITRUM_RPC } from "../../utils/constants";
import { useRollups } from "../../useRollups";
import { usePeepsContext } from "../../context";
import { ButtonLoader } from "../../components/Button";
import { LucideArrowDownRight, LucideArrowUpRight, LucideX } from "lucide-react";
import { useActiveAccount, useActiveWallet, useReadContract, useActiveWalletChain, useSendTransaction, useWaitForReceipt } from "thirdweb/react";
import { client } from "@/app/client";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { IERC20__factory } from "@cartesi/rollups";
import { localhostChain } from "@/app/components/Navbar";
import toast from "react-hot-toast";
import { getContract, prepareContractCall } from "thirdweb";
import { arbitrumSepolia } from "thirdweb/chains";
import { PeepsAbi } from "@/app/utils";
// import {useWallets} from "@web3-onboard/react";


export const DepositTransaction = () => {
  const { activeAddress, baseDappAddress, fetchBalance } = usePeepsContext();
  const activeAccount = useActiveAccount();
  const rollups = useRollups(baseDappAddress);
  // const [connectedWallet] = useWallets();
  // const provider = new ethers.providers.Web3Provider(connectedWallet.provider);
  const provider = new ethers.providers.JsonRpcProvider(PEEPS_SEPOLIA_ARBITRUM_RPC);
  const [dp, setDp] = useState("");
  const [depositDescription, setDepositDescription] = useState("");
  const [depositAddress, setDepositAddress] = useState("");
  const [depositAmount, setDepositAmount] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const connectedChain = useActiveWalletChain();
  const closeButton = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const erc20PortalAddress = "0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB";

  const { mutate: sendTx, data: transactionResult } = useSendTransaction()
  const tokenContract = getContract({
    client,
    chain: arbitrumSepolia,
    address: erc20Address,
    abi: [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "subtractedValue",
            "type": "uint256"
          }
        ],
        "name": "decreaseAllowance",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "freeMint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "addedValue",
            "type": "uint256"
          }
        ],
        "name": "increaseAllowance",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]
  })

  const { data: currentAllowance, isLoading } = useReadContract({
    contract: tokenContract,
    method: "allowance",
    params: [activeAddress, erc20PortalAddress]
  });
  const tx = prepareContractCall({
    contract: tokenContract,
    method: "approve",
    params: [erc20PortalAddress, ethers.utils.parseEther(`${depositAmount}`).toBigInt()],
  });

  const { data: receipt } = useWaitForReceipt({
    client,
    chain: arbitrumSepolia,
    transactionHash: transactionResult?.transactionHash,
  });

  const depositToDapp = async () => {
    try {
      const data = ethers.utils.toUtf8Bytes(
        `Deposited (${depositAmount}) of ERC20 (${erc20Address}).`
      );
      await rollups?.erc20PortalContract.depositERC20Tokens(
        erc20Address,
        baseDappAddress,
        ethers.utils.parseEther(`${depositAmount}`),
        data
      );
      setIsModalOpen(false);
      toast.success("Deposit successful");
      // refetch the balance
      fetchBalance();
    } catch (err) {
      setIsModalOpen(false);
      toast.error("Deposit failed");
      console.log(err);
    }
  }

  const depositErc20ToPortal = async () => {
    try {
      if (rollups && activeAccount) {
        console.log("Inside rollups", rollups);

        if (Number(currentAllowance) >= 0) {
          if (depositAmount > Number(ethers.utils.formatEther(currentAllowance))) {
            console.log("not enough allowance");
            // Allow portal to withdraw `amount` tokens from signer

            try {
              sendTx(tx);
            } catch (error) {
              console.log(`could not approve ${depositAmount} tokens for DAppERC20Portal(${erc20PortalAddress})  (signer: ${activeAddress}`)
            }
          }
          else {
            await depositToDapp()
          }
        }
      }
    } catch (e) {
      console.log(`${e}`);
    }
    // "Unload" the submit button
    setIsSubmit(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmit(true);
    await depositErc20ToPortal()
  };

  useEffect(() => {
    if (receipt?.status == "success") {
      const func = async () => { await depositToDapp() }
      func()
    }
  }, [transactionResult?.transactionHash, receipt])


  return (
    <AlertDialog.Root open={isModalOpen}>
      <AlertDialog.Trigger asChild>
        <button
          type="button"
          className="btn bg-white text-walletDark hover:text-white btn-lg rounded-box inline-flex lg:w-auto items-center justify-center font-medium text-base leading-none outline-none outline-0"
          onClick={() => setIsModalOpen(true)}
        >
          Deposit <LucideArrowDownRight className="hidden lg:inline-block" />
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-black/40 bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 dark:bg-base-300/80 dark:backdrop-blur-sm z-30" />
        <AlertDialog.Content className="z-40 data-[state=open]:animate-contentShow fixed bottom-4 left-[50%] max-h-[85vh] w-[96vw] lg:w-[90vw] max-w-[540px] bg-base-100 translate-x-[-50%] lg:translate-y-[-50%] rounded-lg py-1 lg:p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none dark:bg-base-100">
          <AlertDialog.Title className="text-mauve12 mt-12 mb-4 lg:mt-4 lg:mb-8 text-xl text-center font-bold">
            Deposit Token
          </AlertDialog.Title>
          <AlertDialog.Description asChild className="text-[15px] text-center leading-normal">
            {/* We require this to serve the best experience */}
            <div className="card items-center shrink-0 lg:my-4 w-full bg-base-100">
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
                    className="btn btn-primary dark:bg-[#4563eb] dark:border-0 rounded-xl"
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
                ref={closeButton}
                onClick={() => setIsModalOpen(false)}
              >
                <LucideX strokeWidth={4} />
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