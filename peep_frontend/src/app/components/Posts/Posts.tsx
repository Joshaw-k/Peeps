"use client";

import { FaRetweet } from "react-icons/fa6";
import { ethers } from "ethers";
import React, { use, useEffect, useState } from "react";
import { useNoticesQuery } from "../../generated/graphql";
import { useQuery, gql } from "@apollo/client";
import { useRollups } from "../../useRollups";
import { defaultDappAddress } from "../../utils/constants";
import { CommentModal } from "../commentModal";
import { EmptyPage } from "../EmptyPage";
import { LucideWifiOff, MessageSquareText } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomToastUI } from "../ToastUI";
import toast from "react-hot-toast";
import axios from "axios";
import { usePeepsContext } from "../../context";
import {
  PostActionsContainer,
  PostBody,
  PostContainer,
  PostUser,
} from "./index";

import { useDebounce } from "@uidotdev/usehooks";

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

export const Post = () => {
  // const [result, reexecuteQuery] = useNoticesQuery();
  // const { data, fetching, error } = result;

  const [cursor, setCursor] = useState(null);
  const [endCursor, setEndCursor] = useState(20);

  const { loading, error, data } = useQuery(GET_NOTICES, {
    variables: { cursor },
    pollInterval: 2000,
  });

  // const [posts, setPosts] = useState<any>();
  // const [postsData, setPostsData] = useState<any>();
  const [myPosts, setMyPosts] = useState<any>();
  const [myPostsData, setMyPostsData] = useState<any>();
  const [myLikedPosts, setMyLikedPosts] = useState<any>();
  const [myLikedPostsData, setMyLikedPostsData] = useState<any>();
  const [myFollowersList, setMyFollowersList] = useState<any>();
  const [myFollowersListData, setMyFollowersListData] = useState<any>();
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isPageError, setIsPageError] = useState<boolean>(false);
  const [pageLoadCount, setPageLoadCount] = useState<number>(0);
  const { baseDappAddress, posts, postsData, refreshPost, rollupContracts, userData, updatePostsNotice } = usePeepsContext();
  // console.log(posts);

  // // if (fetching) return <p>Loading...</p>;
  // if (loading)
  //   return (
  //     <EmptyPage
  //       icon={<span className="loading loading-dots loading-lg"></span>}
  //       text={""}
  //     >
  //       <div className="text-xl">Loading...</div>
  //     </EmptyPage>
  //   );
  // // if (error) return <p>Oh no... {error.message}</p>;

  // if (!data || !data.notices)
  //   return (
  //     <EmptyPage
  //       icon={<MessageSquareText size={48} />}
  //       text={"No posts yet"}
  //     ></EmptyPage>
  //   );

  const notices: Notice[] = data
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

  // if (notices.length < 1) {
  //   return (
  //     <EmptyPage
  //       icon={<MessageSquareText size={48} />}
  //       text={"No posts yet"}
  //     ></EmptyPage>
  //   );
  // }

  // const rollups = useRollups(baseDappAddress);
  // const debouncedRollups = useDebounce(rollups, 1000);
  // const [hexInput, setHexInput] = useState<boolean>(false);
  //
  // useEffect(() => {
  //   console.log("debounced rollups not here...", rollupContracts);
  //   if (rollupContracts && !isPageLoading && userData?.wallet) {
  //     handlePostToDapp()
  //   }
  // }, [rollupContracts]);
  //
  // const addInput = async (str: string) => {
  //   console.log("rollups.....", rollups);
  //   console.log("rollupContracts", rollupContracts);
  //   console.log("Debounced rollup contracts", debouncedRollups);
  //   if (rollupContracts) {
  //     try {
  //       let payload = ethers.utils.toUtf8Bytes(str);
  //       console.log("Payload:::", payload);
  //       if (hexInput) {
  //         payload = ethers.utils.arrayify(str);
  //       }
  //       await rollupContracts.inputContract.addInput(baseDappAddress, payload);
  //       console.log("Inside the add input function");
  //     } catch (e) {
  //       console.log(`${e}`);
  //     }
  //   }
  // };
  //
  // const handlePostToDapp = async () => {
  //   console.log(userData, postsData);
  //   // construct the json payload to send to addInput
  //   const jsonPayload = {
  //     method: "recommendPost",
  //     data: {
  //       user: userData,
  //       likedPosts: myLikedPostsData,
  //       followersPosts: myFollowersListData,
  //       myPosts: myPostsData,
  //       posts: postsData
  //     },
  //   };
  //   await addInput(JSON.stringify(jsonPayload));
  //   console.log("handle Post to Dapp", jsonPayload);
  // };

  // update PostsNotice
  // if (notices.length > 0) {
  //   updatePostsNotice(notices);
  // }

  const fetchMyPosts = async () => {
    try {
      const res = await axios.get(
          `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_POSTS&metadata[keyvalues]["addr"]={"value":"${
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
    setIsPageLoading(true);
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
          setIsPageLoading(false);
          setIsPageError(false);
          pageLoadCount === 0 && setPageLoadCount((value) => value + 1);
          // if (data.length > 0) await handlePostToDapp();
        } else {
          setIsPageLoading(false);
          setIsPageError(false);
        }
      }
    } catch (error) {
      console.log(error);
      setIsPageLoading(false);
      setIsPageError(true);
    }
  };

  // useEffect(() => {
  //   // Increase the pageLoadCount by 1. This is used to calculate when the page loader should be displayed.
  //   if (pageLoadCount === 0) {
  //     fetchPosts();
  //   }
  //   setInterval(() => {
  //     fetchPosts();
  //   }, 6000);
  // }, []);

  // useEffect(() => {
  //   // console.log(userData?.wallet);
  //   // fetchLikePosts();
  //   // fetchFollowers();
  //   fetchMyPosts();
  //   // fetchPosts();
  // }, [userData?.wallet]);

  useEffect(() => {
    // fetchPosts();
  }, [refreshPost]);

  useEffect(() => {}, [postsData]);

  if (isPageLoading && pageLoadCount === 0)
    return (
      <EmptyPage
        icon={<span className="loading loading-dots loading-lg"></span>}
        text={""}
      >
        <div className="text-xl">Fetching posts...</div>
      </EmptyPage>
    );

  if (isPageError)
    return (
      <EmptyPage icon={<LucideWifiOff size={64} />} text={""}>
        <div className="text-xl">Error Fetching posts...</div>
      </EmptyPage>
    );

  return (
    <>
      {notices ? notices.length > 0 && <div>New messages</div> : null}
      {
        notices.length > 0 && notices[0].payload !== undefined
          ? JSON.parse(notices[0]?.payload)
              .splice(0, endCursor)
                .map((eachNotice: any, index: number) => (
                    // .filter((it) => JSON.parse(it.payload).posts.length > 0)
          <>
            <PostContainer key={index}>
              <PostUser {...eachNotice} />
              <PostBody postMetaData={posts[index]}>
                {eachNotice?.post_content}
              </PostBody>
              <PostActionsContainer
                  postId={index}
                  message={eachNotice?.post_content}
                  upload={eachNotice?.post_media}
                  postData={eachNotice}
                  postMetaData={posts}
              />
              {/*{<PostContainer></PostContainer>}*/}
            </PostContainer>
            <div className={"divider"}></div>
          </>
                ))
            : <div>No posts</div>
      }

      {/*<button onClick={handlePostToDapp}>Trigger wallet</button>*/}
      {/* <button onClick={() => reexecuteQuery({ requestPolicy: "network-only" })}>
        Reload
      </button> */}
      {/* <table>
        <thead>
          <tr>
            <th>Input Index</th>
            <th>Notice Index</th>
            <th>Input Payload</th>
            <th>Payload</th>
          </tr>
        </thead>
        <tbody>
          {notices.length === 0 && (
            <tr>
              <td colSpan={4}>no notices</td>
            </tr>
          )}
          {notices.map((n: any) => (
            <tr key={`${n.input.index}-${n.index}`}>
              <td>{n.input.index}</td>
              <td>{n.index}</td>
              <td>{n.input.payload}</td>
              <td>{n.payload}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
      {/* {notices
        ? JSON.parse(notices.reverse()[0].payload)
            .posts.reverse()
            .splice(0, endCursor) */}
      {/* .map((eachNotice: any) => (
              // .filter((it) => JSON.parse(it.payload).posts.length > 0) */}
      {/* <>
                <PostContainer key={eachNotice}> */}
      {/* {console.log(eachNotice)} */}
      {/* <PostUser {...eachNotice} />
                  <PostBody postId={eachNotice.id}>
                    {eachNotice?.content?.message}
                  </PostBody>
                  <PostActions
                    postId={eachNotice.id}
                    message={eachNotice?.content?.message}
                    upload={eachNotice?.content?.uplooad}
                    postData={eachNotice}
                  /> */}
      {/* {<PostContainer></PostContainer>} */}
      {/* </PostContainer> */}
      {/* <div className="divider"></div> */}
      {/* </>
            )) */}
      {/* : null} */}
      {/*<div>*/}
      {/*  {postsData ? (*/}
      {/*    postsData.map((post: any, index: number) => (*/}
      {/*      <div key={index}>*/}
      {/*        <p>{post.post_content}</p>*/}
      {/*        <button*/}
      {/*          className="bg-blue-500 p-3"*/}
      {/*          onClick={() => PostActions(post, posts[index], "like")}*/}
      {/*        >*/}
      {/*          like*/}
      {/*        </button>*/}
      {/*      </div>*/}
      {/*    ))*/}
      {/*  ) : (*/}
      {/*    <p>No posts</p>*/}
      {/*  )}*/}
      {/*</div>*/}

      {/*{postsData ? (
        postsData.map((eachPost: any, index: number) => (
          <PostContainer key={index}>
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
          </PostContainer>
        ))
      ) : (
        <div>No posts</div>
      )}*/}
      {postsData && postsData.length > 20 && (
        <section className="flex flex-row justify-center w-full mx-auto">
          <button
            title="load more button"
            type="button"
            className="btn btn-wide block"
            // onClick={() => setEndCursor((endCursor) => endCursor + 20)}
          >
            Load more
          </button>
        </section>
      )}
    </>
  );
};
