"use client";

import { ethers } from "ethers";
import { useEffect, useRef, useState } from "react";
import { useRollups } from "../useRollups";
import { IInputProps } from "../Home";
import { usePeepsContext } from "../context";
import toast from "react-hot-toast";
import { CustomToastUI } from "./ToastUI";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { ButtonLoader } from "./Button";

const PostForm: React.FC<IInputProps> = (props) => {
  const { wallet, userData, refreshPost, setRefreshPost } = usePeepsContext();
  const postTextField = useRef(null);
  const [postText, setPostText] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const wait = (milliseconds: any) => {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  };
  const handlePost = async () => {
    setIsSubmit(true);
    // construct the json payload to send to addInput
    if (wallet) {
      try {
        const data = JSON.stringify({
          pinataOptions: {
            cidVersion: 0,
          },
          pinataMetadata: {
            name: "PEEPS_POSTS",
            keyvalues: {
              addr: `${wallet?.accounts[0]?.address}`,
              uuid: uuidv4(),
            },
          },
          pinataContent: {
            post_username: userData?.username,
            post_content: postText,
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
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkMjEwODYwOC01YzRhLTQ2MDQtOTJjMi1jNTkyMjg1ZGViNzYiLCJlbWFpbCI6ImF3aW5yaW40Ymxlc3NAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjJjYmE4MzNkYmM1MjQyNjFiNjU4Iiwic2NvcGVkS2V5U2VjcmV0IjoiZGE2ZWMwZDZlNjBmYmI0ZWY5MTdmOTkzMmFjZWEwZGUyNGFjZTU1NDZmYWQyMTNmYThmZTVlY2RhMDI2NDQ0OCIsImlhdCI6MTcxMTkwODAxNX0.3RVKCUnhqQlgvfy9lxmAa1ltR_sLHVhHSZtvNJj7aik`,
            },
          }
        );
        if (res.data.IpfsHash) {
          toast.success("Post created");
          setIsSubmit(false);
          await wait(300);
          setRefreshPost(!refreshPost);
        }
      } catch (error) {
        console.log(error);
        toast.error("Post not created");
        setIsSubmit(false);
      }
    } else {
      toast.error("Error, Can't make post!");
      toast.error("Please connect your wallet!");
      setIsSubmit(false);
    }
  };

  return (
    <div className="bg-base-200 rounded-box focus-within:ring-2 focus-within:ring-primary">
      <textarea
        placeholder="Write something"
        className="textarea textarea-lg border-0 w-full resize-none bg-transparent focus:outline-0"
        ref={postTextField}
        onChange={(e) => setPostText(e.target.value)}
      ></textarea>
      <div className="flex flex-row px-2 py-2">
        <span className="flex-1"></span>
        <button
          title="Submit post"
          type="button"
          disabled={postText.length < 1}
          className="flex-grow-0 btn btn-sm btn-primary rounded-xl disabled:btn-disabled"
          onClick={handlePost}
        >
          {isSubmit ? <ButtonLoader /> : "Post"}
        </button>
      </div>
    </div>
  );
};

export default PostForm;
