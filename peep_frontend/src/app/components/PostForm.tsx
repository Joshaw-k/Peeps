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
import { LucideImagePlus, LucideUpload, LucideX } from "lucide-react";
import Image from "next/image";

const PostForm: React.FC<IInputProps> = (props) => {
  const { wallet, userData, refreshPost, setRefreshPost } = usePeepsContext();
  const postTextField = useRef(null);
  const [postText, setPostText] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [formImage, setFormImage] = useState("");
  const [postMedia, setPostMedia] = useState("");
  const [formVideo, setFormVideo] = useState("");
  const [formImagePreview, setFormImagePreview] = useState("");
  const [formVideoPreview, setFormVideoPreview] = useState("");

  const wait = (milliseconds: any) => {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  };

  const pinFileToIPFS = async (files: any) => {
    try {
      let data = new FormData();
      data.append("file", files);
      data.append("pinataOptions", '{"cidVersion": 0}');
      data.append("pinataMetadata", '{"name": "peeps"}');
      toast.success("Uploading event image to IPFS .....");
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkMjEwODYwOC01YzRhLTQ2MDQtOTJjMi1jNTkyMjg1ZGViNzYiLCJlbWFpbCI6ImF3aW5yaW40Ymxlc3NAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjJjYmE4MzNkYmM1MjQyNjFiNjU4Iiwic2NvcGVkS2V5U2VjcmV0IjoiZGE2ZWMwZDZlNjBmYmI0ZWY5MTdmOTkzMmFjZWEwZGUyNGFjZTU1NDZmYWQyMTNmYThmZTVlY2RhMDI2NDQ0OCIsImlhdCI6MTcxMTkwODAxNX0.3RVKCUnhqQlgvfy9lxmAa1ltR_sLHVhHSZtvNJj7aik`,
          },
        }
      );
      console.log(res.data);
      console.log(
        `View the file here: https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
      );
      toast.success("Event Image upload complete");
      return {
        uploaded: true,
        image: `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`,
      };
    } catch (error) {
      console.log(error);
      return { uploaded: false, image: `` };
    }
  };

  const sendPost = async (imgUrl: string = "") => {
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
          post_media: imgUrl,
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
        setPostText("");
        setPostMedia("");
        setFormImagePreview("");
        setFormVideoPreview("");
        setIsSubmit(false);
        await wait(300);

        setRefreshPost(!refreshPost);
      }
    } catch (error) {
      console.log(error);
      toast.error("Post not created");
      setIsSubmit(false);
    }
  };

  const handlePost = async () => {
    setIsSubmit(true);
    // construct the json payload to send to addInput
    if (wallet) {
      try {
        if (formImage == "") {
          await sendPost();
        } else {
          const imgUploadRes = await pinFileToIPFS(formImage);
          await wait(600);
          if (imgUploadRes.uploaded) {
            setFormImage("");
            await sendPost(imgUploadRes.uploaded ? imgUploadRes.image : "");
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Error, Can't make post!");
      toast.error("Please connect your wallet!");
      setIsSubmit(false);
    }
  };

  const handleTriggerFormImage = (event: any) => {
    const selectedMedia = event.target.files[0];
    if (selectedMedia.type.startsWith("image/")) {
      setFormImage(selectedMedia);
      setFormImagePreview(URL.createObjectURL(selectedMedia));
    } else if (selectedMedia.type.startsWith("video/")) {
      setFormVideo(selectedMedia);
      setFormVideoPreview(URL.createObjectURL(selectedMedia));
      console.log(URL.createObjectURL(selectedMedia));
    }
  };

  const removeFormImage = () => {
    setFormImage("");
    setFormImagePreview("");
  };

  const removeFormVideo = () => {
    setFormVideo("");
    setFormVideoPreview("");
  };

  useEffect(() => {}, [
    postText,
    formImage,
    formImagePreview,
    formVideoPreview,
  ]);

  return (
    <div className="bg-base-200 rounded-box focus-within:ring-2 focus-within:ring-primary">
      <textarea
        placeholder="Write something"
        className="textarea textarea-lg border-0 w-full resize-none bg-transparent focus:outline-0"
        ref={postTextField}
        onChange={(e) => setPostText(e.target.value)}
      ></textarea>
      <div>
        {formImagePreview && (
          <div className={"relative inline-block bg-pink-400 mx-8"}>
            <Image
              src={formImagePreview}
              alt={"formImagePreview"}
              width={320}
              height={320}
              className={"shadow-xl"}
            />
            <span
              className={
                "absolute -top-2 -right-2 btn btn-sm btn-circle btn-error"
              }
              onClick={removeFormImage}
            >
              <LucideX size={16} strokeWidth={4} />
            </span>
          </div>
        )}
        {formVideoPreview && (
          <div className={"relative inline-block mx-8"}>
            <video width={320} height={320} className={"shadow-2xl"}>
              <source src={formVideoPreview} />
            </video>
            <span
              className={
                "absolute -top-2 -right-2 btn btn-sm btn-circle btn-error"
              }
              onClick={removeFormVideo}
            >
              <LucideX size={16} strokeWidth={4} />
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-row items-center px-2 py-2">
        <span className="flex-1 px-2">
          <label htmlFor={"id-form-image-trigger"} className={"btn btn-circle"}>
            <LucideUpload size={24} />
            <input
              type="file"
              id={"id-form-image-trigger"}
              className={"hidden"}
              accept={"*/*"}
              onChange={handleTriggerFormImage}
            />
          </label>
        </span>
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
