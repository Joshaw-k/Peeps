import { useRouter } from "next/navigation";
import { useRollups } from "../../useRollups";
import { defaultDappAddress } from "../../utils/constants";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { CommentModal } from "../commentModal";
// import { FaRetweet } from "react-icons/fa6";
import axios from "axios";
import { usePeepsContext } from "../../context";
import { useState } from "react";
// import {useAccount} from "wagmi";
import classNames from "classnames";
import Link from "next/link";
import {LucideCoins, LucideHandCoins, LucideShare} from "lucide-react";
import {useActiveWalletConnectionStatus} from "thirdweb/react";

interface IPostContainer {
  children: any;
}

interface IPostBody {
  postMetaData: any;
  children: any;
}

interface IPostActions {
  postId: number;
  message: string;
  upload: string;
  postData: any;
  postMetaData: any;
  children?: any;
}

const defaultImage =
  "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg";

const AvatarPost = ({ src }: {src: string}) => {
  return (
    <div className="avatar placeholder">
      <div className="w-7 rounded-full bg-base-100">
        {
          src
              ? <img
                  src={src}
                  alt={""}
              />
              : <span></span>
        }
      </div>
    </div>
  );
};

export const PostUser = (props: any) => {
  return (
    <section className={"flex flex-row px-2 text-sm"}>
      <Link
          href={`/profile/${props.post_username}`}
          className={"flex-1 flex flex-row items-center gap-x-4 leading-normal"}
      >
          <AvatarPost
              src={props?.post_media && props?.post_media}
          />
        <span className="font-medium text-xs lg:text-md relative dark:text-gray-400">
          {props?.post_displayName ?? "Anonymous"}
        </span>
        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
        <span className="relative text-xs lg:text-base dark:text-gray-400">
          @{props?.post_username ?? "Anonymous"}
        </span>
      </Link>
      <div className={"flex-grow-0 px-6 text-gray-500"}>
        {/* {new Date().toLocaleTimeString()} */}
      </div>
    </section>
  );
};

export const PostContainer = ({ children }: IPostContainer) => {
  return (
    <section
      className={
        "card card-compact p-4 my-2 border-base-200 bg-gray-100/60 dark:bg-base-300"
      }
    >
      {children}
    </section>
  );
};

export const PostBody = ({ children, postMetaData }: IPostBody) => {
  const router = useRouter();
  const post_hash = postMetaData?.ipfs_pin_hash;
  return (
    <section
      className={"px-3 py-4 text-sm lg:text-base leading-7 text-pretty"}
      onClick={() => router.push("/comments/" + post_hash)}
    >
      {children}
    </section>
  );
};

export const PostActionsContainer = ({
  postId,
  message,
  upload,
  postData,
  postMetaData,
  children,
}: IPostActions) => {
  // const {isConnected} = useAccount();
  const walletStatus = useActiveWalletConnectionStatus();
  const rollups = useRollups(defaultDappAddress);
  const { unPin, PostActions, userData } = usePeepsContext();
  const [like, setLike] = useState(false);
  const [repeep, setRepeep] = useState(false);

  const revertReactions = async (
    address: string,
    uuid: string,
    actionData: string
  ) => {
    if (actionData == "unlike") {
      try {
        const res1 = await axios.get(
          `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_LIKES&metadata[keyvalues]={"addr":{"value":"${address}","op":"eq"},"post_uuid":{"value":"${uuid}","op":"eq"}}
&status=pinned`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
            },
          }
        );
        console.log(res1.data);
        if (res1.data.rows.length > 0) {
          const resOne = await unPin(res1.data.rows[0].ipfs_pin_hash);
          if (resOne) {
            await PostActions(postId, postData, postMetaData, actionData);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (actionData == "unrepeep") {
      try {
        const res1 = await axios.get(
          `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_REPEEP&metadata[keyvalues]={"addr":{"value":"${address}","op":"eq"},"post_uuid":{"value":"${uuid}","op":"eq"}}
&status=pinned`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
            },
          }
        );
        console.log(res1.data);
        if (res1.data.rows.length > 0) {
          const resOne = await unPin(res1.data.rows[0].ipfs_pin_hash);
          if (resOne) {
            await PostActions(postId, postData, postMetaData, actionData);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleLikePost = async (action: boolean) => {
    if (walletStatus === "connected") {
      const actionData = action ? "like" : "unlike";
      if (actionData == "like") {
        await PostActions(postId, postData, postMetaData, actionData);
      } else {
        await revertReactions(
          userData?.wallet,
          postMetaData[postId].metadata?.keyvalues?.uuid,
          actionData
        );
      }
    } else {
      toast.error("connect your wallet");
    }
  };

  const handleRepeepPost = async (action: boolean) => {
    if (walletStatus === "connected") {
      const actionData = action ? "repeep" : "unrepeep";
      if (actionData == "repeep") {
        await PostActions(postId, postData, postMetaData, actionData);
      } else {
        await revertReactions(
          userData?.wallet,
          postMetaData[postId].metadata?.keyvalues?.uuid,
          actionData
        );
      }
    } else {
      toast.error("connect your wallet");
    }
  };

  return (
    <section className={"relative flex flex-row flex-nowrap lg:gap-x-6 lg:p-2 max-w-full"}>
      <div
        className={
          "btn btn-sm md:btn-md btn-ghost rounded-box font-normal text-xs flex flex-row justify-start items-center lg:gap-x-3"
        }
        onClick={() => handleLikePost(!like)}
      >
        <span className="inline-flex justify-center items-center lg:h-[46px] rounded-full border-0 border-gray-200 bg-transparent text-gray-800 mx-auto scale-75 lg:scale-100 dark:bg-slate-90 dark:border-gray-700 dark:text-gray-200">
          <svg
            className="flex-shrink-0 w-5 h-5"
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
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
          </svg>
        </span>
        <span className={classNames("text-xs", {"font-bold": postData?.post_likes > 0})}>
          {postData?.post_likes > 0 ? postData?.post_likes : "Like"}
        </span>
      </div>

      {/* <div
        className={
          "btn btn-ghost rounded-box flex flex-row items-center gap-x-3"
        }
      >
        <span
          className="flex-shrink-0 inline-flex justify-center items-center lg:h-[46px] rounded-full border-0 border-gray-200 bg-transparent text-gray-800 shadow-sm mx-auto dark:bg-slate-90 dark:border-gray-700 dark:text-gray-200"
          onClick={showCommentModal}
        >
          <svg
            className="flex-shrink-0 w-5 h-5"
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
            <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
            <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
          </svg>
        </span>
        <span className={"text-xs"}>Comment</span>
      </div> */}
      <CommentModal
        postUuid={postId}
        message={message}
        upload={upload}
        postData={postData}
        postMetaData={postMetaData?.[postId]}
      />

      <div
        className={
          "btn btn-sm md:btn-md btn-ghost rounded-box font-normal text-xs flex flex-row items-center lg:gap-x-3"
        }
        onClick={() => handleRepeepPost(!repeep)}
      >
        <span className="flex-shrink-0 inline-flex justify-center items-center lg:h-[46px] rounded-full border-0 border-gray-200 bg-transparent text-gray-800 mx-auto scale-75 lg:scale-100 dark:bg-slate-90 dark:border-gray-700 dark:text-gray-200">
          <LucideShare width={24} height={24} className={"text-xl"} />
        </span>
        <span className={classNames("text-xs", {"font-bold": postData?.post_repeeps > 0})}>
          {postData?.post_repeeps > 0 ? postData?.post_repeeps : "Repeep"}
        </span>
      </div>

      <div className={"absolute right-0 btn btn-sm md:btn-md btn-ghost rounded-box font-normal text-xs flex flex-row items-center lg:gap-x-3"}>
        <LucideHandCoins width={24} height={24} className={"text-xs"} />
      </div>
    </section>
  );
};
