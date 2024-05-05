"use client";

import { useConnectWallet } from "@web3-onboard/react";
import {
  PostActionsContainer,
  PostBody,
  PostContainer,
  PostUser,
} from "../../components/Posts";
import { GET_NOTICES, TNotice, useNotices } from "../../components/useNotices";
import { useEffect, useState } from "react";
import { usePeepsContext } from "../../context";
import { Tab } from "@headlessui/react";
import classNames from "classnames";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { EditProfileForm } from "../../components/EditProfileForm";
import {useAccount} from "wagmi";
import {Avatar, NoProfileCard} from "../../components/UserLeft";
import { useRollups } from "../../useRollups";
import { ethers } from "ethers";
import configFile from "../../config.json";

const config: any = configFile;

interface Report {
  payload: string;
}

const Profile = ({ params }: { params: any }) => {
  const {isConnected,chainId,address} = useAccount();
  const { wallet, userData, userIpfsHash, hasProfile, profileChanged } = usePeepsContext();
  const [userProfileIpfsHash, setUserProfileIpfsHash] = useState(null);
  const [relationshipIpfsHash, setRelationshipIpfsHash] = useState(null);
  const [userProfileData, setUserProfileData] = useState({
    wallet: "",
    profilePicture: "",
    displayName: "",
    username: "",
    bio: "",
    createdAt: "",
    followers: "",
    following: ""
  });
  const [isFollow, setIsFollow] = useState(false);
  const [posts, setPosts] = useState<any>();
  const [postsData, setPostsData] = useState<any>();
  const [likedposts, setLikedPosts] = useState<any>();
  const [likedpostsData, setLikedPostsData] = useState<any>();
  const [followersList, setFollowersList] = useState<any>();
  const [followersListData, setFollowersListData] = useState<any>();
  const [hexData, setHexData] = useState<boolean>(false);
  const [postData, setPostData] = useState<boolean>(false);
  const [reports, setReports] = useState<string[]>([]);
    const [decodedReports, setDecodedReports] = useState<any>({});
    const [metadata, setMetadata] = useState<any>({});
  const rollups = useRollups("0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e");
  const defaultImage: string =
    "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg";

  const fetchProfileData = async () => {
    if (userProfileIpfsHash) {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${userProfileIpfsHash}`
        );
        if (res.data) {
          setUserProfileData(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchProfileUser = async () => {
    try {
      const res = await axios.get(
        `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_USER&metadata[keyvalues]["username"]={"value":"${params.id}","op":"eq"}&status=pinned`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
          },
        }
      );
      if (res.data.rows.length > 0) {
        setUserProfileIpfsHash(res.data.rows[0].ipfs_pin_hash);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unPin = async (IpfsHash: any) => {
    try {
      const res = await axios.delete(
        `https://api.pinata.cloud/pinning/unpin/${IpfsHash}`,
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
      toast.error("unpinning failed");
      return false;
    }
  };

  const pinPost = async (userData: any, profileData: any, action: string) => {
    try {
      if (action == "follow") {
        const follow_data = JSON.stringify({
          pinataOptions: {
            cidVersion: 0,
          },
          pinataMetadata: {
            name: "PEEPS_FOLLOW",
            keyvalues: {
              follower: `${userData?.username}`,
              following: `${profileData?.username}`,
            },
          },
          pinataContent: {
            relationship: true,
          },
        });

        const follow_res = await axios.post(
          "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          follow_data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
            },
          }
        );
        if (follow_res.data.IpfsHash) {
          toast.success(`${action} successful`);
        }
      }
      const current_username = userData?.username;
      const current_walletAddrress = userData.wallet;
      const current_displayName = userData.displayName;
      const current_profilePicture = userData.profilePicture;
      const current_bio = userData.bio;
      const current_following = userData.following;
      const current_followers = userData.followers;
      const current_createdAt = userData?.createdAt;

      try {
        const user_data = JSON.stringify({
          pinataOptions: {
            cidVersion: 0,
          },
          pinataMetadata: {
            name: "PEEPS_USER",
            keyvalues: {
              addr: current_walletAddrress,
              username: current_username,
            },
          },
          pinataContent: {
            username: current_username,
            wallet: current_walletAddrress,
            displayName: "",
            profilePicture: current_profilePicture,
            bio: current_bio,
            following:
              action == "follow"
                ? current_following + 1
                : action == "unfollow"
                ? current_following - 1
                : current_following,
            followers: current_followers,
            createdAt: current_createdAt,
          },
        });

        const user_res = await axios.post(
          "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          user_data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
            },
          }
        );
        if (user_res.data.IpfsHash) {
          toast.success("Repinning userData successful");
        }
      } catch (error) {
        console.log(error);
        toast.error("Repinning userData failed");
      }

      const profile_username = profileData?.username;
      const profile_walletAddrress = profileData.wallet;
      const profile_displayName = profileData.displayName;
      const profile_profilePicture = profileData.profilePicture;
      const profile_bio = profileData.bio;
      const profile_following = profileData.following;
      const profile_followers = profileData.followers;
      const profile_createdAt = profileData?.createdAt;

      try {
        const profile_data = JSON.stringify({
          pinataOptions: {
            cidVersion: 0,
          },
          pinataMetadata: {
            name: "PEEPS_USER",
            keyvalues: {
              addr: profile_walletAddrress,
              username: profile_username,
            },
          },
          pinataContent: {
            username: profile_username,
            wallet: profile_walletAddrress,
            displayName: "displayName",
            profilePicture: profile_profilePicture,
            bio: profile_bio,
            following: profile_following,
            followers:
              action == "follow"
                ? profile_followers + 1
                : action == "unfollow"
                ? profile_followers - 1
                : profile_followers,
            createdAt: profile_createdAt,
          },
        });

        const profile_res = await axios.post(
          "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          profile_data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
            },
          }
        );
        if (profile_res.data.IpfsHash) {
          toast.success("Repinning profileData successful");
        }
      } catch (error) {
        console.log(error);
        toast.error("Repinning profileData failed");
      }
    } catch (error) {
      console.log(error);
      toast.error(`${action} failed`);
    }
  };

  const followerUser = async () => {
    if (isConnected) {
      //unpin from ipfs
      const unPinResOne = await unPin(userIpfsHash);
      if (unPinResOne) {
        const unPinResTwo = await unPin(userProfileIpfsHash);
        if (unPinResTwo) {
          await pinPost(userData, userProfileData, "follow").then(() =>
            checkIfFollowing()
          );
        }
        // Then repin on ipfs
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

  const unfollowerUser = async () => {
    if (isConnected) {
      //unpin from ipfs
      const unPinResOne = await unPin(userIpfsHash);
      if (unPinResOne) {
        const unPinResTwo = await unPin(userProfileIpfsHash);
        if (unPinResTwo) {
          const unPinResThree = await unPin(relationshipIpfsHash);
          if (unPinResThree) {
            await pinPost(userData, userProfileData, "unfollow").then(() =>
              checkIfFollowing()
            );
          }
        }
        // Then repin on ipfs
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

  const checkIfFollowing = async () => {
    try {
      const res = await axios.get(
        `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_FOLLOW&metadata[keyvalues]={"follower":{"value":"${userData?.username}","op":"eq"},"following":{"value":"${params.id}","op":"eq"}}&status=pinned`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
          },
        }
      );
      if (res.data.rows.length > 0) {
        setIsFollow(true);
        setRelationshipIpfsHash(res.data.rows[0].ipfs_pin_hash);
      } else {
        setIsFollow(false);
      }
    } catch (error) {
      console.log(error);
      setIsFollow(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_POSTS&metadata[keyvalues]["addr"]={"value":"${userProfileData?.wallet}","op":"eq"}&status=pinned`,
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
          }
          // data.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
          setPostsData(data);
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
          userProfileData?.wallet
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
            setLikedPosts(data);
            let dataOne = [];
            for (let index = 0; index < data.length; index++) {
              const res2 = await axios.get(
                `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${data[index].ipfs_pin_hash}`
              );
              dataOne.push(res2.data);
            }
            // data.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
            setLikedPostsData(dataOne);
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
          userProfileData?.username
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
            setFollowersList(data);
            let dataOne = [];
            for (let index = 0; index < data.length; index++) {
              const res2 = await axios.get(
                `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${data[index].ipfs_pin_hash}`
              );
              dataOne.push(res2.data);
            }
            // data.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
            setFollowersListData(dataOne);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const depositEtherToPortal = async (amount: number) => {
    try {
      if (rollups && isConnected) {
        const data = ethers.utils.toUtf8Bytes(`Deposited (${amount}) ether.`);
        const txOverrides = { value: ethers.utils.parseEther(`${amount}`) };
        console.log("Ether to deposit: ", txOverrides);

        // const tx = await ...
        rollups.etherPortalContract.depositEther(
          "0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e",
          data,
          txOverrides
        );
      }
    } catch (e) {
      console.log(`${e}`);
    }
  };

  const transferEtherToPortal = async (amount: number) => {
    console.log("clicked")
    let ether_amount = ethers.utils.parseEther(String(amount)).toString();
    try {
      if (rollups && isConnected) {
        const input_obj = {
          method: "ether_transfer",
          args: {
            to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            amount: ether_amount,
          },
        };
        const data = JSON.stringify(input_obj);
        let payload = ethers.utils.toUtf8Bytes(data);
        await rollups.inputContract.addInput("0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e", payload);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const withdrawEther = async (amount: number) => {
    try {
      if (rollups && isConnected) {
        let ether_amount = ethers.utils.parseEther(String(amount)).toString();
        console.log("ether after parsing: ", ether_amount);
        const input_obj = {
          method: "ether_withdraw",
          args: {
            amount: ether_amount,
          },
        };
        const data = JSON.stringify(input_obj);
        let payload = ethers.utils.toUtf8Bytes(data);
        await rollups.inputContract.addInput("0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e", payload);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const inspectCall = async (str: string) => {
    console.log("This is the balance address",str)
    let payload = str;
    if (hexData) {
        const uint8array = ethers.utils.arrayify(payload);
        payload = new TextDecoder().decode(uint8array);
    }
    if (!isConnected){
        return;
    }
    
    let apiURL= ""

    if(config[`0x${chainId}`]?.inspectAPIURL) {
        apiURL = `${config[`0x${chainId}`].inspectAPIURL}/inspect`;
    } else {
        console.error(`No inspect interface defined for chain ${`0x${chainId}`}`);
        return;
    }
    
    let fetchData: Promise<Response>;
    if (postData) {
        const payloadBlob = new TextEncoder().encode(payload);
        fetchData = fetch(`${apiURL}`, { method: 'POST', body: payloadBlob });
    } else {
        fetchData = fetch(`${apiURL}/${payload}`);
    }
    fetchData
        .then(response => response.json())
        .then(data => {
            setReports(data.reports);
            setMetadata({status: data.status, exception_payload: data.exception_payload});
            console.log("Metadata:", data.reports);

            // Decode payload from each report
            const decode = data.reports.map((report: Report) => {
            return ethers.utils.toUtf8String(report.payload);
            });
            console.log("Decoded Reports:", decode);
            const reportData = JSON.parse(decode)
            console.log("Report data: ", reportData)
            setDecodedReports(reportData)
            console.log("Erc20 : ", decodedReports.erc20)
            //console.log(parseEther("1000000000000000000", "gwei"))
        });
};

  const tipUser = async() => {

  }

  // useEffect(() => {
  //   setInterval(() => {
  //     fetchPosts();
  //   }, 6000);
  // }, [wallet]);
  //
  // useEffect(() => {
  //   setInterval(() => {
  //     fetchLikePosts();
  //   }, 6000);
  // }, [userProfileData]);
  //
  // useEffect(() => {
  //   setInterval(() => {
  //     fetchFollowers();
  //   }, 6000);
  // }, [userProfileData]);

  useEffect(() => {
    checkIfFollowing();
  }, [userData]);

  useEffect(() => {}, [isFollow]);

  useEffect(() => {
    fetchProfileUser();
  }, [params.id]);

  useEffect(() => {
    fetchProfileData();
  }, [userProfileIpfsHash]);

  useEffect(() => {
    fetchProfileUser();
  }, [profileChanged]);

  useEffect(()=>{
    console.log("This is the address in the useeffect",address)
  inspectCall(`balance/${address?address:""}`)},[address])

  return (
    <section>
      {/*<div className={"prose text-4xl font-bold text-gray-400 px-2 py-6 mt-8"}>
        Your Profile
      </div>*/}
      {
        isConnected && !hasProfile
            ? <>
              <div
                  className={
                    "card card-bordered bg-base-200 p-4 flex flex-row items-center gap-x-4"
                  }
              >
                <Avatar profileImage={""}/>
                <div className="grow">
                  <h4 className="font-semibold text-sm text-gray-800 dark:text-white">
                    {"Anonymous"}
                  </h4>
                  <p className="text-sm text-gray-800 md:text-gray-500 dark:text-white md:dark:text-gray-500">
                    ...
                  </p>
                </div>
              </div>
              <NoProfileCard/>
            </>
            : <section>
              <div className="">
                <div className="hero min-h-60 bg-base-200">
                  <div className="hero-content text-center"></div>
                </div>
                <div className={"relative w-full px-4"}>
                  <div className={"absolute -top-12 z-10"}>
                    <div className="avatar">
                      <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <Image
                            width={100}
                            height={100}
                            src={
                              userProfileData?.profilePicture
                                  ? userProfileData?.profilePicture
                                  : defaultImage
                            }
                            alt=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className={"absolute top-2 right-2 z-[1]"}>
                    {params.id != userData?.username ? (
                        isFollow ? (
                            <div>
                              <button
                                className={"btn btn-primary rounded-box"}
                                onClick={unfollowerUser}
                            >
                              Unfollow
                            </button>
                            <button
                                className={"btn btn-primary rounded-box"}
                                onClick={()=>transferEtherToPortal(20)}
                            >
                              Tip
                            </button>
                            </div>
                        ) : (
                            <div>
                              <button
                                className={"btn btn-primary rounded-box"}
                                onClick={followerUser}
                            >
                              Follow
                            </button>
                            <button
                                className={"btn btn-primary rounded-box"}
                                onClick={()=>depositEtherToPortal(20)}
                            >
                              Tip
                            </button>
                            </div>
                        )
                    ) : (
                        <div><EditProfileForm />
                        <button
                                className={"btn btn-primary rounded-box"}
                                onClick={()=>depositEtherToPortal(20)}
                            >
                              Deposit
                            </button></div>
                    )}
                  </div>
                  <div className={"relative pt-20 pb-16 space-y-4 bg-base-100"}>
                    <div className={""}>
                      <div className={"font-bold text-2xl"}>
                        {userProfileData?.displayName}
                      </div>
                      <div>@{userProfileData?.username}</div>
                    </div>
                    <div className={""}>{userProfileData?.bio}</div>
                    <div>{new Date(userProfileData?.createdAt).toDateString()}</div>
                    <div>
                      <span>Followers: {userProfileData?.followers}</span> |
                      <span>Following: {userProfileData?.following}</span>
                    </div>
                    <div>
                      {decodedReports && decodedReports.ether &&(<span>Dapp Balance: {ethers.utils.formatEther(decodedReports.ether)}</span>)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Tabs - Posts, Followers, Likes*/}
              <div className={""}>
                <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded-xl p-1">
                    <Tab
                        className={({selected}) =>
                            classNames(
                                "rounded-lg px-8 py-2.5 font-medium leading-5",
                                "ring-white/60 focus:outline-none",
                                selected
                                    ? "bg-primary text-primary-content shadow"
                                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                            )
                        }
                    >
                      Posts
                    </Tab>
                    <Tab
                        className={({selected}) =>
                            classNames(
                                "rounded-lg px-8 py-2.5 font-medium leading-5",
                                "ring-white/60 focus:outline-none",
                                selected
                                    ? "bg-primary text-primary-content shadow"
                                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                            )
                        }
                    >
                      Likes
                    </Tab>
                    <Tab
                        className={({selected}) =>
                            classNames(
                                "rounded-lg px-8 py-2.5 font-medium leading-5",
                                "ring-white/60 focus:outline-none",
                                selected
                                    ? "bg-primary text-primary-content shadow"
                                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                            )
                        }
                    >
                      Followers
                    </Tab>
                  </Tab.List>
                  <Tab.Panels>
                    <Tab.Panel
                        className={classNames(
                            "rounded-xl p-6",
                            "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                        )}
                    >
                      {postsData ? (
                          postsData.map((eachPost: any, index: number) => (
                              <PostContainer key={index}>
                                {console.log(eachPost)}
                                <PostUser {...eachPost} />
                                <PostBody postMetaData={posts[index]}>
                                  {eachPost?.post_content}
                                </PostBody>
                                <PostActionsContainer
                                    postId={index}
                                    message={eachPost?.post_content}
                                    upload={eachPost?.post_media}
                                    postData={eachPost}
                                    postMetaData={posts}
                                />
                                {/*{<PostContainer></PostContainer>}*/}
                              </PostContainer>
                          ))
                      ) : (
                          <div>No posts</div>
                      )}
                    </Tab.Panel>
                    <Tab.Panel
                        className={classNames(
                            "rounded-xl p-6",
                            "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                        )}
                    >
                      {likedpostsData ? (
                          likedpostsData.map((eachPost: any, index: number) => (
                              <PostContainer key={index}>
                                <PostUser {...eachPost} />
                                <PostBody postMetaData={likedposts?.[index]}>
                                  {eachPost?.post_content}
                                </PostBody>
                                <PostActionsContainer
                                    postId={index}
                                    message={eachPost?.post_content}
                                    upload={eachPost?.post_media}
                                    postData={eachPost}
                                    postMetaData={posts}
                                />
                                {/*{<PostContainer></PostContainer>}*/}
                              </PostContainer>
                          ))
                      ) : (
                          <div>No posts</div>
                      )}
                    </Tab.Panel>
                    <Tab.Panel
                        className={classNames(
                            "rounded-xl p-6",
                            "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                        )}
                    >
                      {followersListData ? (
                          followersListData.map((eachFollower: any, index: number) => (
                              <Link href={`/profile/${eachFollower?.username}`}
                                    className={"card card-compact p-4 flex flex-row gap-x-3 bg-base-200"}>
                                <div className="avatar">
                                  <div
                                      className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-1 ring-offset-1">
                                    {
                                      eachFollower?.displayPicture
                                          ? <img src="" alt={""}/>
                                          : <span className="text-3xl"></span>
                                    }
                                  </div>
                                </div>
                                {eachFollower?.username}
                              </Link>
                          ))
                      ) : (
                          <div>No Posts</div>
                      )}
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </section>
      }
      {/* {console.log(currentAddress)}
      {console.log(JSON.parse(notices.reverse()[0].payload).posts)}
      {console.log(
        JSON.parse(notices.reverse()[0].payload).posts.filter(
          (it: any) => it.address === currentAddress
        )
      )} */}
      {/*{JSON.parse(notices?.reverse()[0].payload)
        .posts.filter((it: any) => it.address === currentAddress)
        .splice(0, endCursor)
        .map((eachNotice: any) => (
          // .filter((it) => JSON.parse(it.payload).posts.length > 0)
          <>
            <PostContainer key={eachNotice}>
               {console.log(eachNotice)}
              {console.log(wallet?.accounts[0])}
              <PostUser {...eachNotice} />
              <PostBody>{eachNotice?.content?.message}</PostBody>
              <PostActionsContainer />
            </PostContainer>
             <div className="divider"></div>
          </>
        ))}*/}
      {/*<section className="flex flex-row justify-center w-full mx-auto">
        <button
          title="load more button"
          type="button"
          className="btn btn-wide block"
          onClick={() => setEndCursor((endCursor) => endCursor + 20)}
        >
          Load more
        </button>
      </section>*/}
    </section>
  );
};

export default Profile;
