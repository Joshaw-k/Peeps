"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { defaultDappAddress } from "../utils/constants";
import { useConnectWallet } from "@web3-onboard/react";
import { useNotices } from "../components/useNotices";
import { Address } from "@web3-onboard/core/dist/types";
import axios from "axios";
import toast from "react-hot-toast";
import {useAccount} from "wagmi";
// import {
//   SUMMARY_HISTORY_CACHE_NAME,
//   SUMMARY_SEARCH_CACHE_NAME,
// } from "../helpers/constants";

interface IPeepsContext {
  wallet: any;
  connecting: boolean;
  connect: any;
  disconnect: any;
  baseDappAddress: string;
  updateBaseDappAddress: any;
  currentUser: ICurrentUser[];
  updateCurrentUser: any;
  userCreated: boolean;
  data: any;
  error: any;
  loading: any;
  notices: any;
  checkProfileExist: any;
  userData: any;
  unPin: any;
  PostActions: any;
  hasProfile: boolean;
  setHasProfile: any;
  userIpfsHash: any;
  refreshPost: any;
  setRefreshPost: any;
  pinFileToIPFS: any;
  profileChanged: boolean;
  setProfileChanged: any;
}

const PeepsContext = createContext<IPeepsContext>({
  wallet: null,
  connecting: false,
  connect: null,
  disconnect: null,
  baseDappAddress: "",
  updateBaseDappAddress: null,
  currentUser: [
    {
      username: "",
      address: "",
      bio: "",
    },
  ],
  updateCurrentUser: null,
  userCreated: false,
  data: null,
  error: null,
  loading: null,
  notices: null,
  checkProfileExist: null,
  userData: null,
  unPin: null,
  PostActions: null,
  hasProfile: false,
  setHasProfile: null,
  userIpfsHash: null,
  refreshPost: false,
  setRefreshPost: null,
  pinFileToIPFS: null,
  profileChanged: false,
  setProfileChanged: null,
});

export interface PeepsProviderProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

interface ICurrentUser {
  username: string;
  address: Address;
  bio: string;
}

const PeepsProvider: React.FC<PeepsProviderProps> = ({
  children,
}: PeepsProviderProps) => {
  const [baseDappAddress, setBaseDappAddress] =
    useState<string>(defaultDappAddress);
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const {address, isConnecting, isConnected} = useAccount();
  const [currentUser, setCurrentUser] = useState<ICurrentUser[] | any>();
  // const [profileExist, setProfileExist] = useState<ICurrentUser[] | any>();
  // const [address, setAdress] = useState<any>();
  const [userData, setUserData] = useState<any>();
  const [hasProfile, setHasProfile] = useState(false);
  const [userIpfsHash, setUserIpfsHash] = useState(null);
  const [refreshPost, setRefreshPost] = useState(false);
  const [profileChanged, setProfileChanged] = useState(false);

  const { data, notices, loading, error } = useNotices();
  // const [currentUser, setCurrentUser] = useState();
  const latestNotices = notices ? notices?.reverse()[0] : null;
  const usersInLatestNotices = latestNotices
    ? JSON.parse(latestNotices.payload).users
    : [];

  const userCreated = currentUser ? currentUser?.length > 0 : false;

  const updateBaseDappAddress = (newDappAddress: string) => {
    setBaseDappAddress(newDappAddress);
    console.log(baseDappAddress);
    console.log(newDappAddress);
  };

  const updateCurrentUser = (_user: ICurrentUser) => {
    setCurrentUser(_user);
  };

  const checkProfileExist = async () => {
    // if (wallet) {
    if (address) {
      try {
        const res = await axios.get(
          `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_USER&metadata[keyvalues]["addr"]={"value":"${address}","op":"eq"}&status=pinned`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
            },
          }
        );
        if (res.data.rows.length > 0) {
          setHasProfile(true);
        } else {
          setHasProfile(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
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
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
          },
        }
      );
      toast.success("Image upload complete");
      return {
        uploaded: true,
        image: `https://moccasin-many-grasshopper-363.mypinata.cloud/ipfs/${res.data.IpfsHash}`,
      };
    } catch (error) {
      console.log(error);
      return { uploaded: false, image: `` };
    }
  };

  const fetchUserData = async () => {
    try {
      const res1 = await axios.get(
        `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_USER&metadata[keyvalues]["addr"]={"value":"${address}","op":"eq"}&status=pinned`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
          },
        }
      );
      if (res1.data.rows.length > 0) {
        setUserIpfsHash(res1.data.rows[0].ipfs_pin_hash);
        try {
          const res2 = await axios.get(
            `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${res1.data.rows[0].ipfs_pin_hash}`
          );
          if (res2.data) {
            setUserData(res2.data);
            // console.log(res2.data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unPin = async (postMetaData: any) => {
    try {
      const res = await axios.delete(
        `https://api.pinata.cloud/pinning/unpin/${
          postMetaData?.ipfs_pin_hash
            ? postMetaData?.ipfs_pin_hash
            : postMetaData
        }`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
          },
        }
      );
      // toast.success("unpinning successful");
      return true;
    } catch (error) {
      console.log(error);
      // toast.success("unpinning failed");
      toast.success("Unable to complete request. Kindly try again.");
      return false;
    }
  };

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
              addr: `${address}`,
              post_uuid: `${post_uuid}`,
            },
          },
          pinataContent: {
            liked_post: true,
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
              addr: `${address}`,
              post_uuid: `${post_uuid}`,
            },
          },
          pinataContent: {
            repeeped_post: true,
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
              addr: `${address}`,
              parent_post_uuid: `${post_uuid}`,
            },
          },
          pinataContent: {
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

      if (data) {
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
          // toast.success(`${action} successful`);
          return true;
        }
      }
    } catch (error) {
      console.log(error);
      // toast.error(`${action} failed`);
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

    const resOne = await pinActionPost(post_uuid, action);
    if (resOne) {
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
        if (res.data.IpfsHash) pinActionPost(post_uuid, action);
        // toast.success("Repinning successful");
      } catch (error) {
        console.log(error);
        // toast.error("Repinning failed");
        toast.error("We couldn't complete your request.");
      }
    }
  };

  const PostActions = async (
    postId: number,
    postData: any,
    postMetaData: any,
    action: string
  ) => {
    // if (wallet) {
    if (address) {
      //unpin from ipfs
      const unPinRes = await unPin(postMetaData[postId]);

      if (unPinRes) {
        // Then repin on ipfs
        await pinPost(postData, postMetaData[postId], action);
      } else {
        toast.error(
          "Something went wrong at our end. We are working to resolve it as we speak."
        );
        toast.error("Please try again in a few minutes.");
      }
    } else {
      toast.error("Error, Can't make post!");
      toast.error("Please connect your wallet!");
    }
  };

  // useEffect(() => {
  //   setAdress(address);
  // }, [wallet]);

  useEffect(() => {
    fetchUserData();
    checkProfileExist();
  }, [isConnected, address]);

  useEffect(() => {
    fetchUserData();
    checkProfileExist();
  }, [hasProfile]);

  useEffect(() => {
    fetchUserData();
  }, [profileChanged]);

  return (
    <PeepsContext.Provider
      value={{
        wallet,
        connecting,
        connect,
        disconnect,
        baseDappAddress,
        updateBaseDappAddress,
        currentUser,
        updateCurrentUser,
        userCreated,
        data,
        error,
        loading,
        notices,
        checkProfileExist,
        userData,
        unPin,
        PostActions,
        hasProfile,
        setHasProfile,
        userIpfsHash,
        refreshPost,
        setRefreshPost,
        pinFileToIPFS,
        profileChanged,
        setProfileChanged,
      }}
    >
      {children}
    </PeepsContext.Provider>
  );
};

export const usePeepsContext = () => useContext(PeepsContext);

export default PeepsProvider;
