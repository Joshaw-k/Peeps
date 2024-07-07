import React, { useEffect, useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { AvatarProfile } from "./Avatar";
import { Camera, CameraIcon, LucidePlus, X as LucideX } from "lucide-react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useRollups } from "../useRollups";
import { ethers } from "ethers";
import { usePeepsContext } from "../context";
import { defaultDappAddress } from "../utils/constants";
import { ButtonLoader } from "./Button";
import toast from "react-hot-toast";
import { CustomToastUI } from "./ToastUI";
import { PostBody, PostContainer, PostUser } from "./Posts";
import axios from "axios";
import classNames from "classnames";
import {
  useActiveAccount,
  useActiveWalletConnectionStatus,
  useConnect,
} from "thirdweb/react";
import PostForm from "./PostForm";

interface ICommentModal {
  postUuid: number;
  message: string;
  upload: string;
  postData: any;
  postMetaData: any;
}

export const PostFormModal = () => {
  const {
    baseDappAddress,
    userData,
    setRefreshPost,
    refreshPost,
    isPostModalOpen,
    setIsPostModalOpen,
  } = usePeepsContext();
  const walletStatus = useActiveWalletConnectionStatus();
  const activeAccount = useActiveAccount();
  const { connect, isConnecting } = useConnect();
  const address = activeAccount?.address;
  const [commentText, setCommentText] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  return (
    <AlertDialog.Root open={isPostModalOpen}>
      <AlertDialog.Trigger asChild>
        <div
          className={
            "flex flex-row flex-nowrap justify-center text-center bg-primary-content dark:bg-[#4563eb] rounded-box"
          }
          onClick={() => setIsPostModalOpen(true)}
        >
          <LucidePlus size={24} strokeWidth={4} />
        </div>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-black/40 bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 dark:bg-base-100/80 dark:backdrop-blur-sm z-30" />
        <AlertDialog.Content className="z-40 data-[state=open]:animate-contentShow fixed top-0 lg:top-[50%] left-[50%] h-dvh w-[100vw] max-w-full lg:w-[90vw] lg:max-w-[500px] bg-base-10 translate-x-[-50%] lg:translate-y-[-50%] lg:rounded-[6px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none dark:bg-base-200/40">
          <div className="flex items-center justify-end h-16 bg-gray-200 dark:bg-base-300">
            <AlertDialog.Cancel asChild>
              <button
                title="Close profile dialog"
                type="button"
                className="btn size-12 rounded-full text-xl"
                aria-label="Close"
                onClick={() => setIsPostModalOpen(false)}
              >
                <LucideX size={48} strokeWidth={6} />
              </button>
            </AlertDialog.Cancel>
          </div>
          <AlertDialog.Description
            asChild
            className="text-[15px] leading-normal p-2"
          >
            <div className="px-1 py-1">
              {/* We require this to serve the best experience */}
              <PostForm dappAddress={baseDappAddress} />
            </div>
          </AlertDialog.Description>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
