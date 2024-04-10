import React, { useEffect, useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { AvatarProfile } from "./Avatar";
import { Camera, CameraIcon, X as LucideX } from "lucide-react";
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
import { useAccount } from "wagmi";
import classNames from "classnames";

interface ICommentModal {
  postUuid: number;
  message: string;
  upload: string;
  postData: any;
  postMetaData: any;
}

export const CommentModal = ({
  postUuid,
  message,
  upload,
  postData,
  postMetaData,
}: ICommentModal) => {
  const { wallet, userData, setRefreshPost, refreshPost } = usePeepsContext();
  const {address, isConnected} = useAccount();
  const [commentText, setCommentText] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  // const addInput = async (str: string) => {
  //   if (rollups) {
  //     try {
  //       let payload = ethers.utils.toUtf8Bytes(str);
  //       // if (hexInput) {
  //       //   payload = ethers.utils.arrayify(str);
  //       // }
  //       return await rollups.inputContract.addInput(
  //         defaultDappAddress,
  //         payload
  //       );
  //     } catch (e) {
  //       console.log(`${e}`);
  //     }
  //   }
  // };

  const unPin = async (postMetaData: any) => {
    try {
      const res = await axios.delete(
        `https://api.pinata.cloud/pinning/unpin/${postMetaData.ipfs_pin_hash}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
          },
        }
      );
      toast.success("unpinning successful");
      return true;
    } catch (error) {
      console.log(error);
      toast.success("unpinning failed");
      return false;
    }
  };

  const pinPost = async (postData: any, postMetaData: any, action: string) => {
    const likelist = postData?.post_likes;
    const post_creator = postMetaData.metadata?.keyvalues?.addr;
    const post_uuid = postMetaData.metadata?.keyvalues?.uuid;
    const username = postData?.post_username;
    const postContent = postData?.post_content;
    const postMedia = postData?.post_media;
    const commentList = postData?.post_comments;
    const repeepList = postData?.post_repeeps;
    const createdAt = postData?.createdAt;
    try {
      const data = JSON.stringify({
        pinataOptions: {
          cidVersion: 0,
        },
        pinataMetadata: {
          name: "PEEPS_POSTS",
          keyvalues: {
            addr: `${post_creator}`,
            uuid: `${post_uuid}`,
          },
        },
        pinataContent: {
          post_username: username,
          post_content: postContent,
          post_media: postMedia,
          post_comments:
            action == "comment"
              ? commentList + 1
              : action == "uncomment"
              ? commentList - 1
              : commentList,
          post_repeeps:
            action == "repeep"
              ? repeepList + 1
              : action == "unrepeep"
              ? repeepList - 1
              : repeepList,
          post_likes:
            action == "like"
              ? likelist + 1
              : action == "unlike"
              ? likelist - 1
              : likelist,
          createdAt: createdAt,
        },
      });

      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
          },
        }
      );
      if (res.data.IpfsHash) {
        toast.success("Repinning successful");
        return res.data;
      }
    } catch (error) {
      console.log(error);
      toast.error("Repinning failed");
    }
  };

  const wait = (milliseconds: any) => {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  };

  const handleCreateComment = async () => {
    if (isConnected) {
      setIsSubmit(true);
      //unpin from ipfs
      const unPinRes = await unPin(postMetaData);

      if (unPinRes) {
        try {
          const data = JSON.stringify({
            pinataOptions: {
              cidVersion: 0,
            },
            pinataMetadata: {
              name: "PEEPS_COMMENT",
              keyvalues: {
                addr: `${address}`,
                parent_post_uuid: `${postMetaData.metadata?.keyvalues?.uuid}`,
              },
            },
            pinataContent: {
              post_username: userData?.username,
              post_content: commentText,
              post_media: "",
              post_comments: 0,
              post_repeeps: 0,
              post_likes: 0,
              createdAt: new Date(),
            },
          });
          const res = await axios.post(
            "https://api.pinata.cloud/pinning/pinJSONToIPFS",
            data,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
              },
            }
          );
          if (res.data.IpfsHash) {
            const pinRes = await pinPost(postData, postMetaData, "comment");
            if (pinRes.IpfsHash) {
              setIsSubmit(false);
              toast.success(`commented successful`);
              await wait(300);
              setRefreshPost(!refreshPost);
            }
          }
        } catch (error) {
          console.log(error);
          setIsSubmit(false);
          toast.error(`Unable to post comment`);
        }
        // Then repin on ipfs
      } else {
        toast.error(
          "Something went wrong at our end. We are working to resolve it as we speak."
        );
        toast.error("Please try again in a few minutes.");
      }
    } else {
      // toast.error("Error, Can't make post!");
      toast.error("Please connect your wallet!");
    }
    // construct the json payload to send to addInput

    // addInput(JSON.stringify(jsonPayload));
    // console.log(JSON.stringify(jsonPayload));

    // const res = await addInput(JSON.stringify(jsonPayload));
    // // console.log(res);
    // const receipt = await res?.wait(1);
    // // console.log(receipt);
    // const event = receipt?.events?.find((e) => e.event === "InputAdded");
    // console.log(event);

    // if (event) {
    //   toast.success("Comment posted");
    // }
    // toast.custom((t) => (
    //   <CustomToastUI t={t} message={"Address has been copied"}></CustomToastUI>
    // ));

    // // construct the json payload to send to addInput
    // const jsonPayload = JSON.stringify({
    //   method: "createProfile",
    //   data: {
    //     username: username,
    //     bio: bio,
    //     profile_pic: dp,
    //   },
    // });
    // addInput(JSON.stringify(jsonPayload));
    // console.log(JSON.stringify(jsonPayload));
  };

  useEffect(() => {}, [postData]);

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <div
          className={
            "btn btn-sm md:btn-md btn-ghost rounded-box font-normal text-xs flex flex-row items-center lg:gap-x-3"
          }
        >
          <span className="flex-shrink-0 inline-flex justify-center items-center lg:h-[46px] rounded-full border-0 border-gray-200 bg-transparent text-gray-800 mx-auto scale-75 lg:scale-100 dark:bg-slate-90 dark:border-gray-700 dark:text-gray-200">
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
          <span className={classNames("text-xs", {"font-bold": postData?.post_comments > 0})}>
            {postData?.post_comments > 0 ? postData?.post_comments : "Comment"}
          </span>
          {/* <CommentModal
            postId={postId}
            message={message}
            upload={upload}
            postData={props}
          /> */}
        </div>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-black/40 bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 dark:bg-base-300/80 dark:backdrop-blur-sm z-30" />
        <AlertDialog.Content className="rounded-box z-40 data-[state=open]:animate-contentShow fixed bottom-4 lg:top-[50%] left-[50%] max-h-[85vh] w-[96vw] max-w-full lg:w-[90vw] lg:max-w-[500px] bg-base-100 translate-x-[-50%] lg:translate-y-[-50%] lg:rounded-[6px] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none dark:bg-base-100">
          {/* <AlertDialog.Title className="text-mauve12 mt-4 mb-12 text-xl text-center font-bold">
            Comment on @{postData?.username} peep
          </AlertDialog.Title> */}
          <AlertDialog.Description className="text-[15px] leading-normal">
            <PostContainer>
              <PostUser {...postData} />
              <PostBody postMetaData={postMetaData}>{message}</PostBody>
              {/* <PostActions postId={postData.id} /> */}
            </PostContainer>
            {/* We require this to serve the best experience */}
            <div className="card items-center w-full bg-base-100">
              <form className="w-full">
                <div className="max-w-full text-base">
                  {/* <label className="label">
                    <span className="label-text">Your comment</span>
                  </label> */}
                  <textarea
                    className="textarea textarea-lg lg:text-base border-0 w-full h-54 resize-none bg-transparent focus:outline-primary"
                    placeholder="write your comment here"
                    onChange={(e) => setCommentText(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-control mt-6">
                  <button
                    type="button"
                    className="btn btn-primary rounded-xl"
                    onClick={handleCreateComment}
                  >
                    {isSubmit ? <ButtonLoader /> : "Send comment"}
                  </button>
                </div>
              </form>
            </div>
          </AlertDialog.Description>
          <div className="absolute top-4 right-4 flex justify-end gap-[25px]">
            <AlertDialog.Cancel asChild>
              <button
                title="Close profile dialog"
                type="button"
                className="btn size-12 rounded-full text-xl"
                aria-label="Close"
              >
                <LucideX size={48} strokeWidth={6} />
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
