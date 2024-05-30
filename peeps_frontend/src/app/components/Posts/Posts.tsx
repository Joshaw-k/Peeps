"use client";

import { ethers } from "ethers";
import React, { use, useEffect, useState } from "react";
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
import Image from "next/image";

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
  const [endCursor, setEndCursor] = useState(20);

  const [myPosts, setMyPosts] = useState<any>();
  const [myPostsData, setMyPostsData] = useState<any>();
  const [myLikedPosts, setMyLikedPosts] = useState<any>();
  const [myLikedPostsData, setMyLikedPostsData] = useState<any>();
  const [myFollowersList, setMyFollowersList] = useState<any>();
  const [myFollowersListData, setMyFollowersListData] = useState<any>();
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isPageError, setIsPageError] = useState<boolean>(false);
  const [pageLoadCount, setPageLoadCount] = useState<number>(0);
  const { posts, postsData, userData, postsNotice } = usePeepsContext();

  /*const notices: Notice[] = data
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
  : [];*/

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
          // setPosts(res.data.rows);
          let data = [];
          for (let index = 0; index < res.data.rows.length; index++) {
            const res1 = await axios.get(
              `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${res.data.rows[index].ipfs_pin_hash}`
            );
            data.push(res1.data);
            console.log(res1);
          }
          // data.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
          // setPostsData(data);
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

  // if (!data || !data.notices)
  if (postsNotice.length < 1)
    return (
      <EmptyPage
        icon={<MessageSquareText size={48} />}
        text={"No posts yet"}
      ></EmptyPage>
    );

  return (
    <>
      {/*{notices ? notices.length > 0 && <div>New messages</div> : null}*/}
      {
        postsNotice.length > 0 && postsNotice[0].payload !== undefined
          ? JSON.parse(postsNotice[0]?.payload)?.posts?.splice(0, endCursor)
                .map((eachNotice: any, index: number) => (
                    // .filter((it) => JSON.parse(it.payload).posts.length > 0)
                    <>
                      <PostContainer key={index}>
                        <PostUser {...eachNotice} />
                        <PostBody postMetaData={posts[index]}>
                          {eachNotice?.post_content}
                          {
                              eachNotice?.post_media && <Image
                                  src={eachNotice?.post_media}
                                  alt={"Post media"}
                                  width={100}
                                  height={100}
                                  className={"w-full"}
                              />
                          }
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
                      {/*<div className={"divider"}></div>*/}
                    </>
                ))
            : <div>No posts</div>
      }

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
