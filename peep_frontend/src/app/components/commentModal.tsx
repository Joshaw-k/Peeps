import React, { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { AvatarProfile } from "./Avatar";
import { Camera, CameraIcon, X as LucideX } from "lucide-react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useRollups } from "../useRollups";
import { ethers } from "ethers";
import { usePeepsContext } from "../context";
import { defaultDappAddress } from "../utils/constants";
import { PostActions, PostBody, PostContainer, PostUser } from "./Posts";

export const CommentModal = ({ postId, message, upload, postData }) => {
  //   const { baseDappAddress } = usePeepsContext();
  const rollups = useRollups(defaultDappAddress);
  const [dp, setDp] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  console.log(postData);
  console.log(message);

  const addInput = async (str: string) => {
    if (rollups) {
      try {
        let payload = ethers.utils.toUtf8Bytes(str);
        // if (hexInput) {
        //   payload = ethers.utils.arrayify(str);
        // }
        await rollups.inputContract.addInput(defaultDappAddress, payload);
      } catch (e) {
        console.log(`${e}`);
      }
    }
  };

  const handleCreateComment = () => {
    // construct the json payload to send to addInput
    const jsonPayload = JSON.stringify({
      method: "createComment",
      data: {
        post_id: postId,
        message: commentText,
        upload: upload,
      },
    });
    addInput(JSON.stringify(jsonPayload));
    console.log(JSON.stringify(jsonPayload));

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

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <div
          className={
            "btn btn-ghost rounded-box flex flex-row items-center gap-x-3"
          }
        >
          <span className="flex-shrink-0 inline-flex justify-center items-center h-[46px] rounded-full border-0 border-gray-200 bg-transparent text-gray-800 shadow-sm mx-auto dark:bg-slate-90 dark:border-gray-700 dark:text-gray-200">
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
        <AlertDialog.Content className="rounded-box z-40 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] bg-base-100 translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none dark:bg-base-100">
          <AlertDialog.Title className="text-mauve12 mt-4 mb-12 text-xl text-center font-bold">
            Comment on @{postData?.username} peep
          </AlertDialog.Title>
          <AlertDialog.Description className="text-[15px] leading-normal">
            <PostContainer>
              <PostUser {...postData} />
              <PostBody>{message}</PostBody>
              {/* <PostActions postId={postData.id} /> */}
            </PostContainer>
            {/* We require this to serve the best experience */}
            <div className="card items-center shrink-0 w-full bg-base-100">
              <form className="card-body w-full">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Your comment</span>
                  </label>
                  <textarea
                    className="textarea textarea-lg textarea-bordered text-base resize-none"
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
                    Send comment
                  </button>
                </div>
              </form>
            </div>
          </AlertDialog.Description>
          <div className="absolute top-8 right-4 flex justify-end gap-[25px]">
            <AlertDialog.Cancel asChild>
              <button
                title="Close profile dialog"
                type="button"
                className="btn size-12 rounded-full text-xl"
                aria-label="Close"
              >
                <Cross2Icon size={64} />
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
