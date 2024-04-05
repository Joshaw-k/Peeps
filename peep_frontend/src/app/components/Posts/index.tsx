import {useRouter} from "next/navigation";
import { useRollups } from "../../useRollups";
import {defaultDappAddress} from "../../utils/constants";
import {ethers} from "ethers";
import toast from "react-hot-toast";
import {CommentModal} from "../commentModal";
import {FaRetweet} from "react-icons/fa6";
import axios from "axios";
import {usePeepsContext} from "../../context";

interface IPostContainer {
  children: any;
}

interface IPostBody {
  postId?: number;
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

const AvatarPost = () => {
  return (
    <div className="avatar">
      <div className="w-7 rounded-full">
        <img
          src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
          alt={""}
        />
      </div>
    </div>
  );
};

export const PostUser = (props: any) => {
  return (
    <section className={"flex flex-row px-2 text-sm"}>
      <div
        className={"flex-1 flex flex-row items-center gap-x-4 leading-normal"}
      >
        <AvatarPost />
        <span className="font-medium text-md relative dark:text-gray-400">
          {props?.post_username ?? "Anonymous"}
        </span>
        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
        <span className="relative dark:text-gray-400">@{props?.post_username ?? "Anonymous"}</span>
      </div>
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
        "card card-compact p-4 my-2 border-base-200 bg-gray-100/60 dark:bg-base-200"
      }
    >
      {children}
    </section>
  );
};

export const PostBody = ({ children, postId }: IPostBody) => {
  const router = useRouter();
  return (
    <section
      className={"px-3 py-4 text-base leading-7 text-pretty"}
      onClick={() => router.push("/comments/" + postId)}
    >
      {children}
    </section>
  );
};


export const unPin = async (postMetaData: any) => {
  console.log("POST METADATA", postMetaData);
  try {
    const res = await axios.delete(
        `https://api.pinata.cloud/pinning/unpin/${postMetaData.ipfs_pin_hash}`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkMjEwODYwOC01YzRhLTQ2MDQtOTJjMi1jNTkyMjg1ZGViNzYiLCJlbWFpbCI6ImF3aW5yaW40Ymxlc3NAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjJjYmE4MzNkYmM1MjQyNjFiNjU4Iiwic2NvcGVkS2V5U2VjcmV0IjoiZGE2ZWMwZDZlNjBmYmI0ZWY5MTdmOTkzMmFjZWEwZGUyNGFjZTU1NDZmYWQyMTNmYThmZTVlY2RhMDI2NDQ0OCIsImlhdCI6MTcxMTkwODAxNX0.3RVKCUnhqQlgvfy9lxmAa1ltR_sLHVhHSZtvNJj7aik`,
          },
        }
    );
    console.log(res);
    toast.success("unpinning successful");
    return true;
  } catch (error) {
    console.log(error);
    toast.success("unpinning failed");
    return false;
  }
};


export const PostActionsContainer = ({
  postId,
  message,
  upload,
  postData,
    postMetaData,
  children,
}: IPostActions) => {
  const rollups = useRollups(defaultDappAddress);
  const { wallet } = usePeepsContext();

  const pinActionPost = async (post_uuid: any, action: string) => {
    try {
      let data;
      if (action == "like") {
        data = JSON.stringify({
          pinataOptions: {
            cidVersion: 0,
          },
          pinataMetadata: {
            name: "PEEPS_LIKES",
            keyvalues: {
              addr: `${wallet?.accounts[0]?.address}`,
            },
          },
          pinataContent: {
            post_uuid: `${post_uuid}`,
            liked_post: true,
          },
        });
      }
      if (action == "unlike") {
        data = JSON.stringify({
          pinataOptions: {
            cidVersion: 0,
          },
          pinataMetadata: {
            name: "PEEPS_LIKES",
            keyvalues: {
              addr: `${wallet?.accounts[0]?.address}`,
            },
          },
          pinataContent: {
            post_uuid: `${post_uuid}`,
            liked_post: false,
          },
        });
      }
      if (action == "repeep") {
        data = JSON.stringify({
          pinataOptions: {
            cidVersion: 0,
          },
          pinataMetadata: {
            name: "PEEPS_REPEEP",
            keyvalues: {
              addr: `${wallet?.accounts[0]?.address}`,
            },
          },
          pinataContent: {
            post_uuid: `${post_uuid}`,
            repeeped_post: true,
          },
        });
      }
      if (action == "unrepeep") {
        data = JSON.stringify({
          pinataOptions: {
            cidVersion: 0,
          },
          pinataMetadata: {
            name: "PEEPS_REPEEP",
            keyvalues: {
              addr: `${wallet?.accounts[0]?.address}`,
            },
          },
          pinataContent: {
            post_uuid: `${post_uuid}`,
            repeeped_post: false,
          },
        });
      }
      if (action == "comment") {
        data = JSON.stringify({
          pinataOptions: {
            cidVersion: 0,
          },
          pinataMetadata: {
            name: "PEEPS_COMMENT",
            keyvalues: {
              addr: `${wallet?.accounts[0]?.address}`,
            },
          },
          pinataContent: {
            parent_post_uuid: `${post_uuid}`,
            comment_username: "username",
            comment_content: "commentText",
            comment_media: "",
            comment_comments: 0,
            comment_repeeps: 0,
            comment_likes: 0,
            createdAt: new Date(),
          },
        });
      }
      if (action == "uncomment") {
        data = JSON.stringify({
          pinataOptions: {
            cidVersion: 0,
          },
          pinataMetadata: {
            name: "PEEPS_COMMENT",
            keyvalues: {
              addr: `${wallet?.accounts[0]?.address}`,
            },
          },
          pinataContent: {
            post_uuid: `${post_uuid}`,
            commented_post: false,
          },
        });
      }

      const res = await axios.post(
          "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkMjEwODYwOC01YzRhLTQ2MDQtOTJjMi1jNTkyMjg1ZGViNzYiLCJlbWFpbCI6ImF3aW5yaW40Ymxlc3NAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjJjYmE4MzNkYmM1MjQyNjFiNjU4Iiwic2NvcGVkS2V5U2VjcmV0IjoiZGE2ZWMwZDZlNjBmYmI0ZWY5MTdmOTkzMmFjZWEwZGUyNGFjZTU1NDZmYWQyMTNmYThmZTVlY2RhMDI2NDQ0OCIsImlhdCI6MTcxMTkwODAxNX0.3RVKCUnhqQlgvfy9lxmAa1ltR_sLHVhHSZtvNJj7aik`,
            },
          }
      );
      if (res.data.IpfsHash) toast.success(`${action} successful`);
    } catch (error) {
      console.log(error);
      toast.error(`${action} failed`);
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
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkMjEwODYwOC01YzRhLTQ2MDQtOTJjMi1jNTkyMjg1ZGViNzYiLCJlbWFpbCI6ImF3aW5yaW40Ymxlc3NAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjJjYmE4MzNkYmM1MjQyNjFiNjU4Iiwic2NvcGVkS2V5U2VjcmV0IjoiZGE2ZWMwZDZlNjBmYmI0ZWY5MTdmOTkzMmFjZWEwZGUyNGFjZTU1NDZmYWQyMTNmYThmZTVlY2RhMDI2NDQ0OCIsImlhdCI6MTcxMTkwODAxNX0.3RVKCUnhqQlgvfy9lxmAa1ltR_sLHVhHSZtvNJj7aik`,
            },
          }
      );
      if (res.data.IpfsHash) pinActionPost(post_uuid, action);
      toast.success("Repinning successful");
    } catch (error) {
      console.log(error);
      toast.error("Repinning failed");
    }
  };

  const PostActions = async (postData: any, postMetaData: any, action: string) => {
    if (wallet) {
      //unpin from ipfs
      const unPinRes = await unPin(postMetaData[postId]);

      if (unPinRes) {
        // Then repin on ipfs
        await pinPost(postData, postMetaData, action);
      } else {
        toast.error("Something went wrong at our end. We are working to resolve it as we speak.");
        toast.error("Please try again in a few minutes.");
      }
    } else {
      toast.error("Error, Can't make post!");
      toast.error("Please connect your wallet!");
    }
  };

  const addInput = async (str: string) => {
    if (rollups) {
      try {
        let payload = ethers.utils.toUtf8Bytes(str);
        // if (hexInput) {
        //   payload = ethers.utils.arrayify(str);
        // }
        return await rollups.inputContract.addInput(
          defaultDappAddress,
          payload
        );
      } catch (e) {
        console.log(`${e}`);
      }
    }
  };

  const handleLikePost = async () => {
    await PostActions(postData, postMetaData, "like");

    /*
    // Previous implementation
    // construct the json payload to send to addInput
    const jsonPayload = JSON.stringify({
      method: "likePost",
      data: {
        id: postId,
      },
    });

    const res = await addInput(JSON.stringify(jsonPayload));
    const receipt = await res?.wait(1);
    const event = receipt?.events?.find((e) => e.event === "InputAdded");
    console.log(event);

    // toast("Transaction successful");
    if (event) {
      // toast.custom((t) => (
      //   <CustomToastUI t={t} message={"Post liked"}></CustomToastUI>
      // ));
      toast.success("Post liked");
    }*/
  };

  // const handleCommentPost = () => {
  //   // construct the json payload to send to addInput
  //   const jsonPayload = JSON.stringify({
  //     method: "likePost",
  //     data: {
  //       post_id: postId,
  //       message: commentMessage,
  //       upload: upload,
  //     },
  //   });
  //   addInput(JSON.stringify(jsonPayload));
  //   console.log(JSON.stringify(jsonPayload));
  // };

  return (
    <section className={"flex flex-row gap-x-6 p-2"}>
      <div
        className={
          "btn btn-ghost rounded-box flex flex-row items-center gap-x-3"
        }
        onClick={handleLikePost}
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
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
          </svg>
        </span>
        <span className={"text-xs"}>
          {postData?.post_likes > 0 ? postData?.post_likes : "Like"}
        </span>
      </div>

      {/* <div
        className={
          "btn btn-ghost rounded-box flex flex-row items-center gap-x-3"
        }
      >
        <span
          className="flex-shrink-0 inline-flex justify-center items-center h-[46px] rounded-full border-0 border-gray-200 bg-transparent text-gray-800 shadow-sm mx-auto dark:bg-slate-90 dark:border-gray-700 dark:text-gray-200"
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
        postId={postId}
        message={message}
        upload={upload}
        postData={postData}
      />

      <div
        className={
          "btn btn-ghost rounded-box flex flex-row items-center gap-x-3"
        }
      >
        <span className="flex-shrink-0 inline-flex justify-center items-center h-[46px] rounded-full border-0 border-gray-200 bg-transparent text-gray-800 shadow-sm mx-auto dark:bg-slate-90 dark:border-gray-700 dark:text-gray-200">
          <FaRetweet width={24} height={24} className={"text-xl"} />
        </span>
        <span className={"text-xs"}>
          {postData?.post_repeeps > 0 ? postData?.post_repeeps : "Repeep"}</span>
      </div>
    </section>
  );
};