"use client";
import React, { useEffect, useState } from "react";

import {
  PostActionsContainer,
  PostBody,
  PostContainer,
  PostUser,
} from "../../components/Posts";
import axios from "axios";
import toast from "react-hot-toast";
import { usePeepsContext } from "../../context";

const Page = ({ params }: { params: any }) => {
  const [post, setPost] = useState<any>();
  const [postMetadata, setPostMetadata] = useState<any>();
  const [comments, setComments] = useState<any>();
  const [commentsData, setCommentsData] = useState<any>();
  const { refreshPost } = usePeepsContext();

  const fetchPost = async () => {
    const res1 = await axios.get(
      `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${params.id}`
    );
    setPost(res1.data);
  };

  const fetchComments = async () => {
    try {
      const res1 = await axios.get(
        `https://api.pinata.cloud/data/pinList?hashContains=${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
          },
        }
      );
      if (res1.data.rows.length > 0) {
        setPostMetadata(res1.data.rows);
        try {
          const res2 = await axios.get(
            `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_COMMENT&metadata[keyvalues]={"parent_post_uuid":{"value":"${res1.data.rows[0]?.metadata?.keyvalues?.uuid}","op":"eq"}}&status=pinned`,
            {
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
              },
            }
          );
          if (res2.data) {
            if (res2.data.rows.length > 0) {
              setComments(res2.data.rows);

              let data = [];
              for (let index = 0; index < res2.data.rows.length; index++) {
                const res3 = await axios.get(
                  `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${res2.data.rows[index].ipfs_pin_hash}`
                );
                data.push(res3.data);
              }
              // data.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
              setCommentsData(data);
            }
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        toast.error("Could not find data with hash");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   // Increase the pageLoadCount by 1. This is used to calculate when the page loader should be displayed.
  //   setInterval(() => {
  //     fetchComments();
  //   }, 6000);
  // }, []);

  useEffect(() => {
    // Increase the pageLoadCount by 1. This is used to calculate when the page loader should be displayed.
    fetchComments();
    fetchPost();
  }, [refreshPost, params.id]);

  useEffect(() => {}, [post]);
  return (
    <div>
      {post && (
        <PostContainer key={post}>
          <PostUser {...post} />
          <PostBody postMetaData={postMetadata?.[0]}>
            {post?.post_content}
          </PostBody>
          <PostActionsContainer
            postId={0}
            message={post?.post_content}
            upload={post?.post_media}
            postData={post}
            postMetaData={postMetadata}
          />
        </PostContainer>
      )}
      <div className={"prose text-lg lg:text-4xl font-bold text-gray-400 px-2 lg:py-6 mt-8 lg:mt-8"}>
        Comments
      </div>
      {commentsData ? (
        <div>
          {commentsData?.map((item: any, index: number) => (
            <>
              <PostContainer key={item}>
                <PostUser {...item} />
                <PostBody postMetaData={null}>{item?.post_content}</PostBody>
                <PostActionsContainer
                  postId={index}
                  message={item?.post_content}
                  upload={item?.post_media}
                  postData={item}
                  postMetaData={comments}
                />
              </PostContainer>
            </>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Page;
