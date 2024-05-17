import React, { useEffect, useRef, useState } from "react";
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
import axios from "axios";
import {useActiveAccount, useActiveWalletConnectionStatus, useConnect} from "thirdweb/react";
// import { useAccount } from "wagmi";

export const ProfileForm = () => {
  // const {address, isConnecting, isConnected} = useAccount();
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;
  const walletStatus = useActiveWalletConnectionStatus();
  const {
    baseDappAddress,
    setHasProfile,
    pinFileToIPFS,
    profileChanged,
    setProfileChanged,
      updateBaseUserData
  } = usePeepsContext();
  const rollups = useRollups(baseDappAddress);
  const [dp, setDp] = useState<string>("");
  const [dpPreview, setDpPreview] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const profileFormCloseButton = useRef(null);
  const [open, setOpen] = React.useState(false);

  const wait = (milliseconds: any) => {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  };

  const createProfile = async (imgUrl: string = "") => {
    try {
      const data = JSON.stringify({
        pinataOptions: {
          cidVersion: 0,
        },
        pinataMetadata: {
          name: "PEEPS_USER",
          keyvalues: {
            addr: `${address}`,
            username: username,
          },
        },
        pinataContent: {
          username: username,
          wallet: `${address}`,
          displayName: displayName,
          profilePicture: imgUrl,
          bio: bio,
          following: 0,
          followers: 0,
          createdAt: new Date(),
        },
      });
      setIsSubmit(true);
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
        setIsSubmit(false);
        toast.success("Profile created");
        setOpen(false);
        setHasProfile(true);
        await wait(800);
        setProfileChanged(!profileChanged);
        updateBaseUserData({
          username: username,
          wallet: `${address}`,
          displayName: displayName,
          profilePicture: imgUrl,
          bio: bio,
          following: 0,
          followers: 0,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.log(error);
      setIsSubmit(false);
      toast.error("Profile not created");
    }
  };

  const handleCreateProfile = async () => {
    // if (isConnected) {
    if (walletStatus === "connected") {
      // Creating userProfile
      try {
        if (dp == "") {
          await createProfile();
        } else {
          const imgUploadRes = await pinFileToIPFS(dp);
          await wait(600);
          if (imgUploadRes.uploaded) {
            setDp("");
            await createProfile(
              imgUploadRes.uploaded ? imgUploadRes.image : ""
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Error, Can't make post!");
      toast.error("Please connect your wallet!");
    }
  };

  const handleTriggerDpChange = (event: any) => {
    const selectedImage = event.target.files[0];
    setDp(selectedImage);
    setDpPreview(URL.createObjectURL(selectedImage));
  };

  const removeProfileUpload = () => {
    setDp("");
    setDpPreview("");
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild>
        <button
          type="button"
          className="btn btn-block inline-flex h-[35px] items-center justify-center px-[15px] font-medium leading-none outline-none outline-0"
          disabled={walletStatus !== "connected"}
        >
          Create Profile
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-black/40 bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 dark:bg-base-300/80 dark:backdrop-blur-sm z-30" />
        <AlertDialog.Content className="z-40 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[96vw] lg:w-[90vw] max-w-[500px] bg-base-100 translate-x-[-50%] translate-y-[-50%] rounded-box lg:rounded-[6px] lg:p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none dark:bg-base-100 overflow-y-auto">
          <AlertDialog.Title className="text-mauve12 mt-8 lg:mt-4 mb-12 text-lg lg:text-xl text-center font-bold">
            Create your Profile
          </AlertDialog.Title>
          <AlertDialog.Description className="text-[15px] text-center leading-normal">
            {/* We require this to serve the best experience */}
            <div className="card items-center shrink-0 my-4 w-full bg-base-100">
              <div className={"relative inline-block"}>
                <AvatarProfile src={dpPreview} />
                {dpPreview && (
                  <span
                    className={
                      "absolute -top-0 -right-0 btn btn-sm btn-circle btn-error"
                    }
                    onClick={removeProfileUpload}
                  >
                    <LucideX size={16} strokeWidth={4} />
                  </span>
                )}
              </div>
              <label
                htmlFor={"id-avatar-dp"}
                title="Select dp"
                className="btn btn-sm mt-4 text-sm lg:text-base"
              >
                <CameraIcon />
                Select display picture
                <input
                  type="file"
                  name=""
                  id="id-avatar-dp"
                  className="hidden"
                  onChange={handleTriggerDpChange}
                />
              </label>
              <form className="card-body w-full">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Display Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="display_name"
                    className="input input-bordered"
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Username</span>
                  </label>
                  <input
                    type="username"
                    placeholder="username"
                    className="input input-bordered"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">About yourself</span>
                  </label>
                  <textarea
                    className="textarea textarea-lg textarea-bordered text-base resize-none"
                    placeholder="Tell the world something about yourself"
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-control mt-6">
                  <button
                    type="button"
                    className="btn btn-primary rounded-xl"
                    onClick={handleCreateProfile}
                  >
                    {isSubmit ? <ButtonLoader /> : "Create Profile"}
                  </button>
                </div>
              </form>
            </div>
          </AlertDialog.Description>
          <div className="absolute top-4 lg:top-8 right-4 flex justify-end gap-[25px]">
            <AlertDialog.Cancel asChild>
              <button
                title="Close profile dialog"
                type="button"
                className="btn py-0 size-12 rounded-full text-xl leading-normal"
                aria-label="Close"
                ref={profileFormCloseButton}
              >
                <LucideX size={48}  strokeWidth={4} />
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
