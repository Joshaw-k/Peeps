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
import { useAccount } from "wagmi";
import { useRollups } from "../useRollups";
import { useDebounce } from "@uidotdev/usehooks";
import { ethers } from "ethers";
import { gql, useQuery } from "@apollo/client";
// import {
//   SUMMARY_HISTORY_CACHE_NAME,
//   SUMMARY_SEARCH_CACHE_NAME,
// } from "../helpers/constants";

interface IPeepsContext {
  // wallet: any;
  // connecting: boolean;
  // connect: any;
  // disconnect: any;
  baseDappAddress: string;
  updateBaseDappAddress: any;
  currentUser: ICurrentUser[];
  updateCurrentUser: any;
  userCreated: boolean;
  // data: any;
  error: any;
  loading: any;
  // notices: any;
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
}

const PeepsContext = createContext<IPeepsContext>({
  // wallet: null,
  // connecting: false,
  // connect: null,
  // disconnect: null,
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
  // data: null,
  error: null,
  loading: null,
  // notices: null,
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

const PeepsProvider: React.FC<PeepsProviderProps> = ({
  children,
}: PeepsProviderProps) => {
  const [baseDappAddress, setBaseDappAddress] =
    useState<string>(defaultDappAddress);
  // const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const { address, isConnecting, isConnected } = useAccount();
  const [currentUser, setCurrentUser] = useState<ICurrentUser[] | any>();
  // const [profileExist, setProfileExist] = useState<ICurrentUser[] | any>();
  // const [address, setAdress] = useState<any>();
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
  // const [postsNotice, setPostsNotice] = useState<any>([]);

  const [cursor, setCursor] = useState(null);
  const [endCursor, setEndCursor] = useState(20);

  const { loading, error, data } = useQuery(GET_NOTICES, {
    variables: { cursor },
    pollInterval: 10000,
  });

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

  // if (!loading && notices && notices.length > 0) {
  //   setPostsNotice(notices);
  // }

  // const { data, notices, loading, error } = useNotices();
  // // const [currentUser, setCurrentUser] = useState();
  // const latestNotices = notices ? notices?.reverse()[0] : null;
  // const usersInLatestNotices = latestNotices
  //   ? JSON.parse(latestNotices.payload).users
  //   : [];

  const userCreated = currentUser ? currentUser?.length > 0 : false;

  const rollups = useRollups(baseDappAddress);
  const debouncedRollups = useDebounce(rollups, 1000);
  const [hexInput, setHexInput] = useState<boolean>(false);

  useEffect(() => {
    console.log("debounced rollups not here...", rollupContracts);
    if (rollupContracts && userData?.wallet) {
      handlePostToDapp()
    }
  }, [rollupContracts]);

  const addInput = async (str: string) => {
    console.log("rollups.....", rollups);
    console.log("rollupContracts", rollupContracts);
    console.log("Debounced rollup contracts", debouncedRollups);
    if (rollupContracts) {
      try {
        let payload = ethers.utils.toUtf8Bytes(str);
        console.log("Payload:::", payload);
        if (hexInput) {
          payload = ethers.utils.arrayify(str);
        }
        // await rollupContracts.inputContract.addInput(baseDappAddress, payload);
        await rollups?.inputContract.addInput(baseDappAddress, payload);
        console.log("Inside the add input function");
      } catch (e) {
        console.log(`${e}`);
      }
    }
  };

  const handlePostToDapp = async () => {
    // console.log(userData, postsData);
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
      console.log("Fetch MY POSTS address: ", userData?.wallet, address);
      const res = await axios.get(
        `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_POSTS&metadata[keyvalues]["addr"]={"value":"${address}","op":"eq"}&status=pinned`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
          },
        }
      );
      console.log("MYPosts", res);
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
        `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_LIKES&metadata[keyvalues]["addr"]={"value":"${userData?.wallet
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
          console.log(data);
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
            console.log(dataOne);
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
        `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_FOLLOW&metadata[keyvalues]["following"]={"value":"${userData?.username
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
      console.log(res);
      console.log(userData);
      if (res.data) {
        if (res.data.rows.length > 0) {
          setPosts(res.data.rows);
          let data = [];
          for (let index = 0; index < res.data.rows.length; index++) {
            const res1 = await axios.get(
              `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${res.data.rows[index].ipfs_pin_hash}`
            );
            data.push(res1.data);
            console.log(res1);
          }
          // data.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
          setPostsData(data);
          // setIsPageLoading(false);
          // setIsPageError(false);
          // pageLoadCount === 0 && setPageLoadCount((value) => value + 1);
          // if (data.length > 0) await handlePostToDapp();
        } else {
          // setIsPageLoading(false);
          // setIsPageError(false);
        }
      }
    } catch (error) {
      console.log(error);
      // setIsPageLoading(false);
      // setIsPageError(true);
    }
  };
  // END OF FETCH FOR LIKES, FOLLOWS AND MY POSTS

  const updateBaseDappAddress = (newDappAddress: string) => {
    setBaseDappAddress(newDappAddress);
    console.log(baseDappAddress);
    console.log(newDappAddress);
  };

  const updateCurrentUser = (_user: ICurrentUser) => {
    setCurrentUser(_user);
  };

  const updateRollupContracts = (_rollupsContracts: any) => {
    setRollupContracts(_rollupsContracts);
  }

  const updatePostsNotice = (_postNotice: any) => {
    // setPostsNotice(_postNotice);
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
        `https://api.pinata.cloud/pinning/unpin/${postMetaData?.ipfs_pin_hash
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
        await handlePostToDapp();
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
    fetchMyPosts();
    fetchLikePosts();
    fetchPosts();
  }, [isConnected, address, hasProfile, profileChanged, refreshPost]);

  // useEffect(() => {
  //   fetchUserData();
  //   checkProfileExist();
  // }, [hasProfile]);

  // useEffect(() => {
  //   fetchUserData();
  // }, [profileChanged]);

  return (
    <PeepsContext.Provider
      value={{
        // wallet,
        // connecting,
        // connect,
        // disconnect,
        baseDappAddress,
        updateBaseDappAddress,
        currentUser,
        updateCurrentUser,
        userCreated,
        // data,
        // error,
        loading,
        // notices,
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
      }}
    >
      {children}
    </PeepsContext.Provider>
  );
};

export const usePeepsContext = () => useContext(PeepsContext);

export default PeepsProvider;
