"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {defaultDappAddress, PEEPS_USER_CACHE_NAME} from "../utils/constants";
import axios from "axios";
import toast from "react-hot-toast";
import {useRollups} from "../useRollups";
import {useDebounce} from "@uidotdev/usehooks";
import {ethers} from "ethers";
import {gql, useQuery} from "@apollo/client";
import {Address} from "thirdweb";
import {useActiveAccount, useActiveWalletChain, useActiveWalletConnectionStatus, useConnect} from "thirdweb/react";

import configFile from "../config.json";
const config: any = configFile;

interface IPeepsContext {
  baseDappAddress: string;
  updateBaseDappAddress: any;
  currentUser: ICurrentUser[];
  updateCurrentUser: any;
  userCreated: boolean;
  error: any;
  loading: any;
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
  rollupContracts: any;
  updateRollupContracts: any;
  postsNotice: any;
  updatePostsNotice: any;
  posts: any;
  postsData: any;
  myPosts: any;
  myPostsData: any;
  myLikedPosts: any;
  myLikedPostsData: any;
  myFollowersList: any;
  myFollowersListData: any;
  baseUserData: any,
  updateBaseUserData: any,
  activeAddress: any,
  walletStatus: string,
  walletBalance: string,
  updateWalletBalance: any,
  isPostModalOpen: boolean,
  setIsPostModalOpen: any,
  fetchBalance: any
}

const PeepsContext = createContext<IPeepsContext>({
  baseDappAddress: "",
  updateBaseDappAddress: null,
  currentUser: [
    {
      username: "",
      address: `0x${""}`,
      bio: "",
    },
  ],
  updateCurrentUser: null,
  userCreated: false,
  error: null,
  loading: null,
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
  rollupContracts: null,
  updateRollupContracts: null,
  postsNotice: null,
  updatePostsNotice: null,
  posts: [],
  postsData: [],
  myPosts: [],
  myPostsData: [],
  myLikedPosts: [],
  myLikedPostsData: [],
  myFollowersList: [],
  myFollowersListData: [],
  baseUserData: null,
  updateBaseUserData: null,
  activeAddress: "",
  walletStatus: "",
  walletBalance: "",
  updateWalletBalance: null,
  isPostModalOpen: false,
  setIsPostModalOpen: null,
  fetchBalance: null
});

export interface PeepsProviderProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

interface ICurrentUser {
  username: string;
  address: Address;
  bio: string;
}


type Notice = {
  id: string;
  index: number;
  input: any; //{index: number; epoch: {index: number; }
  payload: string;
};

// GraphQL query to retrieve notices given a cursor
const GET_NOTICES = gql`
  query GetNotices($cursor: String) {
    notices(first: 20, after: $cursor) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
  }
`;

export function isJsonString(str: string | null) {
  try {
    if (typeof str === "string") {
      JSON.parse(str);
    }
  } catch (e) {
    return false;
  }
  return true;
}

export const getCurrentUserCache = () => {

  const defaultCurrentUserCache = null;
  let currentUserCache = typeof window !== "undefined" ? window.localStorage.getItem(PEEPS_USER_CACHE_NAME) : null;
  if (typeof window !== "undefined") {
    if (!currentUserCache) {
      window.localStorage.setItem(PEEPS_USER_CACHE_NAME, JSON.stringify(defaultCurrentUserCache));
      currentUserCache = localStorage.getItem(PEEPS_USER_CACHE_NAME);
    }
  }
  // console.log(isJsonString(currentUserCache));
  // console.log(typeof currentUserCache);

  return isJsonString(currentUserCache) ? JSON.parse(currentUserCache!) : null;
}

export const updateCurrentUserCache = (rawData: any) => {
  // Save summary data to localStorage
  localStorage.setItem(PEEPS_USER_CACHE_NAME, JSON.stringify(rawData));
}

const PeepsProvider: React.FC<PeepsProviderProps> = ({
  children,
}: PeepsProviderProps) => {
  const [baseDappAddress, setBaseDappAddress] =
    useState<string>(defaultDappAddress);
  // const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  // const {address, isConnecting, isConnected} = useAccount();
  const [baseUserData, setBaseUserData] = useState(getCurrentUserCache() || null);
  const activeAccount = useActiveAccount();
  const {connect, isConnecting} = useConnect();
  const address = activeAccount?.address;
  const activeAddress = address;
  const walletStatus = useActiveWalletConnectionStatus();
  const walletStatusConnected = walletStatus === "connected";
  const chainId = useActiveWalletChain();
  const [currentUser, setCurrentUser] = useState<ICurrentUser[] | any>();
  const [userData, setUserData] = useState<any>();
  const [hasProfile, setHasProfile] = useState(false);
  const [userIpfsHash, setUserIpfsHash] = useState(null);
  const [refreshPost, setRefreshPost] = useState(false);
  const [profileChanged, setProfileChanged] = useState(false);
  const [rollupContracts, setRollupContracts] = useState({});
  const [posts, setPosts] = useState<any>([]);
  const [postsData, setPostsData] = useState<any>([]);
  const [myPosts, setMyPosts] = useState<any>([]);
  const [myPostsData, setMyPostsData] = useState<any>([]);
  const [myLikedPosts, setMyLikedPosts] = useState<any>([]);
  const [myLikedPostsData, setMyLikedPostsData] = useState<any>([]);
  const [myFollowersList, setMyFollowersList] = useState<any>([]);
  const [myFollowersListData, setMyFollowersListData] = useState<any>([]);
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);

  const [cursor, setCursor] = useState(null);
  const [endCursor, setEndCursor] = useState(20);

  const { loading, error, data } = useQuery(GET_NOTICES, {
    variables: { cursor },
    // pollInterval: 2000,
  });

  const inspectCall = async (str: string) => {
    let payload = str;

    if (!chainId) {
      return;
    }

    let apiURL = "";

    if (config[chainId.id]?.inspectAPIURL) {
      apiURL = `${config[chainId.id].inspectAPIURL}`;
    } else {
      console.error(`No inspect interface defined for chain ${chainId.id}`);
      return;
    }

    let fetchData: Promise<Response>;
    if (apiURL && payload) {
      fetch(`${apiURL}/${payload}`)
        .then((response) => response.json())
        .then((data) => {
          // console.log("balance before decode", data);
          // Decode payload from each report
          const decode = data.reports.map((report: Report) => {
            return ethers.utils.toUtf8String((report as any)?.payload);
          });
          // console.log("Decoded Reports:", decode);
          const reportData = JSON.parse(decode);
          // console.log("Report data erc20: ", typeof reportData.erc20)
          // console.log("Report data: ", reportData)
          // setBalance(
          //   reportData.erc20.length > 0
          //     ? ethers.utils.formatEther(reportData.erc20[0][1]).toString()
          //     : "0"
          // );
          updateWalletBalance(
            reportData.erc20.length > 0
              ? ethers.utils.formatEther(reportData.erc20[0][1]).toString()
              : "0"
          );
          // console.log("Ether : ", reportData.ether)
          console.log("Erc20 : ", reportData.erc20);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  useEffect(() => {
    if (activeAccount) {
      const getBalance = async () => {
        await inspectCall(
          `balance/${activeAccount.address ? activeAccount.address : ""}`
        );
      };
      getBalance();
    }
  }, [activeAddress]);

  const fetchBalance = async () => {
    if (activeAccount) {
      await inspectCall(
        `balance/${activeAccount.address ? activeAccount.address : ""}`
      );
    }
  };

  // const notices: Notice[] = data
  const postsNotice: Notice[] = data
      ? data.notices.edges
          .map((node: any) => {
            const n = node.node;
            let inputPayload = n?.input.payload;
            if (inputPayload) {
              try {
                inputPayload = ethers.utils.toUtf8String(inputPayload);
              } catch (e) {
                inputPayload = inputPayload + " (hex)";
              }
            } else {
              inputPayload = "(empty)";
            }
            let payload = n?.payload;
            if (payload) {
              try {
                payload = ethers.utils.toUtf8String(payload);
              } catch (e) {
                payload = payload + " (hex)";
              }
            } else {
              payload = "(empty)";
            }
            return {
              id: `${n?.id}`,
              index: parseInt(n?.index),
              payload: `${payload}`,
              input: n ? { index: n.input.index, payload: inputPayload } : {},
            };
          })
          .sort((b: any, a: any) => {
            if (a.input.index === b.input.index) {
              return b.index - a.index;
            } else {
              return b.input.index - a.input.index;
            }
          })
      : [];

  const userCreated = currentUser ? currentUser?.length > 0 : false;

  const rollups = useRollups(baseDappAddress);
  const debouncedRollups = useDebounce(rollups, 1000);
  const [hexInput, setHexInput] = useState<boolean>(false);

  useEffect(() => {
    // console.log("debounced rollups not here...", rollupContracts);
    if (rollupContracts && userData?.wallet) {
      handlePostToDapp()
    }
  }, [rollupContracts]);

  const addInput = async (str: string) => {
    if (rollupContracts) {
      try {
        let payload = ethers.utils.toUtf8Bytes(str);
        if (hexInput) {
          payload = ethers.utils.arrayify(str);
        }
        // await rollupContracts.inputContract.addInput(baseDappAddress, payload);
        await rollups?.inputContract.addInput(baseDappAddress, payload);
      } catch (e) {
        console.log(`${e}`);
      }
    }
  };

  const handlePostToDapp = async () => {
    // construct the json payload to send to addInput
    const jsonPayload = {
      method: "recommendPost",
      data: {
        user: userData,
        likedPosts: myLikedPostsData,
        followersPosts: myFollowersListData,
        myPosts: myPostsData,
        posts: postsData
      },
    };
    await addInput(JSON.stringify(jsonPayload));
    console.log("handle Post to Dapp", jsonPayload);
  };

  // FETCHES FOR LIKES, FOLLOWS AND MY POSTS ARE HERE

  const fetchMyPosts = async () => {
    try {
      // console.log("Fetch MY POSTS address: ", userData?.wallet, address);
      const res = await axios.get(
          `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_POSTS&metadata[keyvalues]["addr"]={"value":"${address}","op":"eq"}&status=pinned`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
            },
          }
      );
      // console.log("MYPosts", res);
      if (res.data) {
        if (res.data.rows.length > 0) {
          setMyPosts(res.data.rows);
          let data = [];
          for (let index = 0; index < res.data.rows.length; index++) {
            const res1 = await axios.get(
                `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${res.data.rows[index].ipfs_pin_hash}`
            );
            data.push(res1.data);
          }
          // data.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
          setMyPostsData(data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLikePosts = async () => {
    try {
      const res = await axios.get(
          `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_LIKES&metadata[keyvalues]["addr"]={"value":"${
              userData?.wallet
          }","op":"eq"}&status=pinned`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
            },
          }
      );

      if (res.data) {
        if (res.data.rows.length > 0) {
          let data = [];
          for (let index = 0; index < res.data.rows.length; index++) {
            const res1 = await axios.get(
                `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_POSTS&?metadata[keyvalues]["post_uuid"]={"value":"${res.data.rows[index].metadata?.keyvalues?.uuid}","op":"eq"}&status=pinned`,
                {
                  headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
                  },
                }
            );
            data.push(res1.data.rows[0]);
          }

          if (data.length > 0) {
            setMyLikedPosts(data);
            let dataOne = [];
            for (let index = 0; index < data.length; index++) {
              const res2 = await axios.get(
                  `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${data[index].ipfs_pin_hash}`
              );
              dataOne.push(res2.data);
            }
            // data.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
            setMyLikedPostsData(dataOne);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFollowers = async () => {
    try {
      const res = await axios.get(
          `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_FOLLOW&metadata[keyvalues]["following"]={"value":"${
              userData?.username
          }","op":"eq"}&status=pinned`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
            },
          }
      );

      if (res.data) {
        if (res.data.rows.length > 0) {
          let data = [];
          for (let index = 0; index < res.data.rows.length; index++) {
            const res1 = await axios.get(
                `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_USER&metadata[keyvalues]["username"]={"value":"${res.data.rows[index].metadata?.keyvalues?.follower}","op":"eq"}&status=pinned`,
                {
                  headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
                  },
                }
            );

            data.push(res1.data.rows[0]);
          }
          if (data.length > 0) {
            setMyFollowersList(data);
            let dataOne = [];
            for (let index = 0; index < data.length; index++) {
              const res2 = await axios.get(
                  `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${data[index].ipfs_pin_hash}`
              );
              dataOne.push(res2.data);
            }
            // data.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
            setMyFollowersListData(dataOne);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
          `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_POSTS&status=pinned`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
            },
          }
      );
      if (res.data) {
        if (res.data.rows.length > 0) {
          setPosts(res.data.rows);
          let data = [];
          for (let index = 0; index < res.data.rows.length; index++) {
            const res1 = await axios.get(
                `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${res.data.rows[index].ipfs_pin_hash}`
            );
            data.push(res1.data);
            // console.log(res1);
          }
          // data.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
          setPostsData(data);
        } else {
          // setIsPageLoading(false);
          // setIsPageError(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  // END OF FETCH FOR LIKES, FOLLOWS AND MY POSTS

  const updateBaseDappAddress = (newDappAddress: string) => {
    setBaseDappAddress(newDappAddress);
    console.log(baseDappAddress);
    console.log(newDappAddress);
  };

  const updateBaseUserData = (_newUserData: any) => {
    setBaseUserData(_newUserData);
    updateCurrentUserCache(_newUserData);
  }

  const updateCurrentUser = (_user: ICurrentUser) => {
    setCurrentUser(_user);
  };

  const updateRollupContracts = (_rollupsContracts: any) => {
    setRollupContracts(_rollupsContracts);
  }

  const updatePostsNotice = (_postNotice: any) => {
    // setPostsNotice(_postNotice);
  }

  const updateWalletBalance = (_walletBalance: string) => {
    setWalletBalance(_walletBalance);
  }

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
        console.error(error);
      }
    }
  };

  const pinFileToIPFS = async (files: any) => {
    try {
      let data = new FormData();
      data.append("file", files);
      data.append("pinataOptions", '{"cidVersion": 0}');
      data.append("pinataMetadata", '{"name": "peeps"}');
      toast.loading("Upload in progress.");
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
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
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
      console.error(error);
      // toast.success("unpinning failed");
      toast.error("Unable to complete request. Kindly try again.");
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
      console.error(error);
      // toast.error(`${action} failed`);
    }
  };

  const pinPost = async (postData: any, postMetaData: any, action: string) => {
    const likelist = postData?.post_likes;
    const post_creator = postMetaData.metadata?.keyvalues?.addr;
    const post_uuid = postMetaData.metadata?.keyvalues?.uuid;
    const username = postData?.post_username;
    const userDp = postData?.post_user_dp;
    const displayName = postData?.displayName;
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
            post_user_dp: userDp,
            post_displayName: displayName,
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
        await handlePostToDapp();
      } else {
        // toast.error(
        //   "Something went wrong at our end. We are working to resolve it as we speak."
        // );
        toast.error("Please try again in a few minutes.");
      }
    } else {
      // toast.error("Error, Can't make post!");
      toast.error("Please connect your wallet!");
    }
  };

  useEffect(() => {
    checkProfileExist();
    if (walletStatus === "connected") {
      fetchUserData();
    }
  }, [walletStatusConnected, activeAddress]);

  useEffect(() => {
    fetchPosts();
  }, [refreshPost]);

  useEffect(() => {
    if (walletStatusConnected) {
      fetchMyPosts();
      fetchLikePosts();
    }
  }, [activeAddress, walletStatusConnected]);

  return (
    <PeepsContext.Provider
      value={{
        baseDappAddress,
        updateBaseDappAddress,
        currentUser,
        updateCurrentUser,
        userCreated,
        error,
        loading,
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
        rollupContracts,
        updateRollupContracts,
        postsNotice,
        updatePostsNotice,
        posts,
        postsData,
        myPosts,
        myPostsData,
        myLikedPosts,
        myLikedPostsData,
        myFollowersList,
        myFollowersListData,
        baseUserData,
        updateBaseUserData,
        activeAddress,
        walletStatus,
        walletBalance,
        updateWalletBalance,
        isPostModalOpen,
        setIsPostModalOpen,
        fetchBalance
      }}
    >
      {children}
    </PeepsContext.Provider>
  );
};

export const usePeepsContext = () => useContext(PeepsContext);

export default PeepsProvider;
