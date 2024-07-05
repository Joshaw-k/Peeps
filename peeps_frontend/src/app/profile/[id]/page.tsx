"use client";

import {
  PostActionsContainer,
  PostBody,
  PostContainer,
  PostUser,
} from "../../components/Posts";
import { useEffect, useState } from "react";
import { usePeepsContext } from "../../context";
import { Tab } from "@headlessui/react";
import classNames from "classnames";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { EditProfileForm } from "../../components/EditProfileForm";
import { Avatar, NoProfileCard } from "../../components/UserLeft";
import { useActiveWalletConnectionStatus } from "thirdweb/react";

const Profile = ({ params }: { params: any }) => {
  const {
    activeAddress,
    userData,
    userIpfsHash,
    hasProfile,
    profileChanged,
    myPosts,
    myPostsData,
    myLikedPosts,
    myFollowersList
  } = usePeepsContext();
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
  let [likedPosts, setLikedPosts] = useState<any>();
  const [likedPostsData, setLikedPostsData] = useState<any>();
  const [followersList, setFollowersList] = useState<any>();
  const [followersListData, setFollowersListData] = useState<any>();
  const walletStatus = useActiveWalletConnectionStatus();
  const walletStatusConnected = walletStatus === "connected";
  console.log("user profile IPFS hash", userProfileIpfsHash);

  const defaultImage: string = "";
  if (userData?.username === params.id) {
    likedPosts = myLikedPosts;
  }

  const fetchUserProfileData = async () => {
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
      console.log("Profile user", res);
      if (res.data.rows.length > 0) {
        // setUserProfileIpfsHash(res.data.rows[0].ipfs_pin_hash);
        try {
          const res2 = await axios.get(
            `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${res.data.rows[0].ipfs_pin_hash}`
          );
          if (res2.data) {
            setUserProfileData(res2.data);
          }
        } catch (error) {
          console.log(error);
        }
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
      // toast.success("unpinning successful");
      return true;
    } catch (error) {
      console.log(error);
      console.error("unpinning failed");
      toast.error("Unable to complete request. Kindly try again");
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
    // if (isConnected) {
    if (walletStatus === "connected") {
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
    // if (isConnected) {
    if (walletStatus) {
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
        // `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_POSTS&metadata[keyvalues]["addr"]={"value":"${address}","op":"eq"}&status=pinned`,
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
        `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_LIKES&metadata[keyvalues]["addr"]={"value":"${userProfileData?.wallet
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
        `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_FOLLOW&metadata[keyvalues]["following"]={"value":"${userProfileData?.username
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
    if (walletStatusConnected && userProfileData?.wallet) {
      fetchPosts();
      fetchLikePosts();
      fetchFollowers();
    }
  }, [params.id, walletStatusConnected, userProfileData?.wallet]);

  useEffect(() => {
    checkIfFollowing();
  }, [userData]);

  useEffect(() => {
    fetchProfileUser();
  }, [params.id, profileChanged]);

  // useEffect(() => {
  //   fetchUserProfileData();
  // }, [params.id, userProfileIpfsHash]);

  return (
    <section>
      {/*<div className={"prose text-4xl font-bold text-gray-400 px-2 py-6 mt-8"}>
        Your Profile
      </div>*/}
      {
        walletStatus === "connected" && !hasProfile
          ? <>
            <div
              className={
                "card card-bordered bg-gray-200 dark:bg-base-200 p-4 flex flex-row items-center gap-x-4 rounded-sm"
              }
            >
              <Avatar profileImage={""} />
              <div className="grow">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-white">
                  {"Anonymous"}
                </h4>
                <p className="text-sm text-gray-800 md:text-gray-500 dark:text-white md:dark:text-gray-500">
                  ...
                </p>
              </div>
            </div>
            <NoProfileCard />
          </>
          : <section>
            {
              userProfileData?.wallet === ""
                ? <div>
                  <div className="hero min-h-60 bg-gray-200 dark:bg-base-200 rounded-lg">
                    <div className="hero-content text-center"></div>
                  </div>
                  <div className={"relative w-full px-4"}>
                    <div className={"absolute -top-12 z-10"}>
                      <div className="avatar">
                        <div className="skeleton w-24 rounded-full ring ring-base-200 dark:ring-base-200 ring-offset-base-100 ring-offset-2"></div>
                      </div>
                    </div>
                    <div className={"absolute top-2 right-2 z-[1]"}>
                      <div className="skeleton w-32 h-12"></div>
                    </div>
                    <div className={"relative pt-20 pb-16 space-y-4 bg-transparent"}>
                      <div className={"space-y-3"}>
                        <div className={"skeleton h-8 w-48 font-bold text-2xl"}></div>
                        <div className="skeleton h-4 w-24"></div>
                      </div>
                      <div className={"skeleton w-96 h-6"}></div>
                      <div className={"skeleton w-52 h-4"}></div>
                      <div className="flex flex-row items-center gap-x-4">
                        <span className={"skeleton w-24 h-4"}></span>
                        <div className="skeleton w-2 h-2"></div>
                        <span className={"skeleton w-24 h-4"}></span>
                      </div>
                    </div>
                  </div>
                </div>
                : <div className="">
                  <div className="hero min-h-60 bg-gray-200 dark:bg-base-200 rounded-lg">
                    <div className="hero-content text-center"></div>
                  </div>
                  <div className={"relative w-full px-4"}>
                    <div className={"absolute -top-12 z-10"}>
                      <div className="avatar">
                        <div className="w-24 rounded-full ring ring-primary dark:ring-[#4563eb] ring-offset-base-100 ring-offset-2">
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
                          <button
                            className={"btn btn-primary dark:bg-[#4563eb] dark:border-0 rounded-box"}
                            onClick={unfollowerUser}
                          >
                            Unfollow
                          </button>
                        ) : (
                          <button
                            className={"btn btn-primary dark:bg-[#4563eb] dark:border-0 rounded-box"}
                            onClick={followerUser}
                          >
                            Follow
                          </button>
                        )
                      ) : (
                        <EditProfileForm />
                      )}
                    </div>
                    <div className={"relative pt-20 pb-16 space-y-4 bg-transparent"}>
                      <div className={""}>
                        <div className={"font-bold text-2xl"}>
                          {userProfileData?.displayName}
                        </div>
                        <div>@{userProfileData?.username}</div>
                      </div>
                      <div className={""}>{userProfileData?.bio}</div>
                      <div>{new Date(userProfileData?.createdAt).toDateString()}</div>
                      <div className="flex flex-row items-center gap-x-4">
                        <span>Followers: {userProfileData?.followers}</span>
                        <div className="w-2 h-2 rounded-full bg-base-200"></div>
                        <span>Following: {userProfileData?.following}</span>
                      </div>
                    </div>
                  </div>
                </div>
            }

            {/* Profile Tabs - Posts, Followers, Likes*/}
            <div className={""}>
              <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl p-1">
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        "rounded-lg px-8 py-2.5 font-medium leading-5",
                        "ring-white/60 focus:outline-none hover:bg-gray-300",
                        selected
                          ? "bg-primary dark:bg-[#4563eb] text-primary-content dark:text-white shadow"
                          : "text-base-content hover:bg-white/[0.12] dark:hover:text-white"
                      )
                    }
                  >
                    Posts
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        "rounded-lg px-8 py-2.5 font-medium leading-5",
                        "ring-white/60 focus:outline-none hover:bg-gray-300",
                        selected
                          ? "bg-primary dark:bg-[#4563eb] text-primary-content dark:text-white shadow"
                          : "text-base-content hover:bg-white/[0.12] dark:hover:text-white"
                      )
                    }
                  >
                    Likes
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        "rounded-lg px-8 py-2.5 font-medium leading-5",
                        "ring-white/60 focus:outline-none hover:bg-gray-300",
                        selected
                          ? "bg-primary dark:bg-[#4563eb] text-primary-content dark:text-white shadow"
                          : "text-base-content hover:bg-white/[0.12] dark:hover:text-white"
                      )
                    }
                  >
                    Followers
                  </Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel
                    className={classNames(
                      "rounded-xl py-3",
                      "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                    )}
                  >
                    {postsData ? (
                      postsData.map((eachPost: any, index: number) => (
                        <PostContainer key={index}>
                          {/*{console.log(eachPost)}*/}
                          <PostUser {...eachPost} />
                          <PostBody postMetaData={myPosts[index]}>
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
                      "rounded-xl p-3",
                      "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                    )}
                  >
                    {likedPostsData ? (
                      likedPostsData.map((eachPost: any, index: number) => (
                        <PostContainer key={index}>
                          <PostUser {...eachPost} />
                          <PostBody postMetaData={likedPosts?.[index]}>
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
                      <div>No Liked posts</div>
                    )}
                  </Tab.Panel>
                  <Tab.Panel
                    className={classNames(
                      "rounded-xl p-3",
                      "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                    )}
                  >
                    {followersListData ? (
                      followersListData.map((eachFollower: any, index: number) => (
                        <Link key={index} href={`/profile/${eachFollower?.username}`}
                          className={"card card-compact p-4 flex flex-row gap-x-3 bg-base-200"}>
                          <div className="avatar">
                            <div
                              className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-1 ring-offset-1">
                              {
                                eachFollower?.displayPicture
                                  ? <Image src="" alt={""} width={56} height={56} />
                                  : <span className="text-3xl"></span>
                              }
                            </div>
                          </div>
                          {eachFollower?.username}
                        </Link>
                      ))
                    ) : (
                      <div>No Followers yet</div>
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
