"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRollups } from "../../useRollups";
import { defaultDappAddress } from "../../utils/constants";
import { ethers } from "ethers";
import { useQuery, gql } from "@apollo/client";
import { CommentModal } from "../../components/commentModal";
import { FaRetweet } from "react-icons/fa6";
import { TNotice } from "../../components/useNotices";
import {
  PostActionsContainer,
  PostBody,
  PostContainer,
  PostUser,
} from "../../components/Posts";
import axios from "axios";
import toast from "react-hot-toast";

const Page = ({ params }: { params: any }) => {
  const [post, setPost] = useState<any>();
  const [postMetadata, setPostMetadata] = useState<any>();
  const [comments, setComments] = useState<any>();
  const [commentsData, setCommentsData] = useState<any>();

  const fetchPost = async () => {
    const res1 = await axios.get(
      `https://moccasin-many-grasshopper-363.mypinata.cloud/ipfs/${params.id}`
    );
    setPost(res1.data);
  };

  const fetchComments = async () => {
    try {
      const res1 = await axios.get(
        `https://api.pinata.cloud/data/pinList?hashContains=${params.id}`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkMjEwODYwOC01YzRhLTQ2MDQtOTJjMi1jNTkyMjg1ZGViNzYiLCJlbWFpbCI6ImF3aW5yaW40Ymxlc3NAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjJjYmE4MzNkYmM1MjQyNjFiNjU4Iiwic2NvcGVkS2V5U2VjcmV0IjoiZGE2ZWMwZDZlNjBmYmI0ZWY5MTdmOTkzMmFjZWEwZGUyNGFjZTU1NDZmYWQyMTNmYThmZTVlY2RhMDI2NDQ0OCIsImlhdCI6MTcxMTkwODAxNX0.3RVKCUnhqQlgvfy9lxmAa1ltR_sLHVhHSZtvNJj7aik`,
          },
        }
      );
      if (res1.data.rows.length > 0) {
        setPostMetadata(res1.data.rows);
        try {
          const res2 = await axios.get(
            `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_COMMENT&?metadata[keyvalues]={"parent_post_uuid":{"value":${res1.data.rows[0].metadata.keyvalues.parent_post_uuid},"op":"eq"}}
    &status=pinned`,
            {
              headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkMjEwODYwOC01YzRhLTQ2MDQtOTJjMi1jNTkyMjg1ZGViNzYiLCJlbWFpbCI6ImF3aW5yaW40Ymxlc3NAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjJjYmE4MzNkYmM1MjQyNjFiNjU4Iiwic2NvcGVkS2V5U2VjcmV0IjoiZGE2ZWMwZDZlNjBmYmI0ZWY5MTdmOTkzMmFjZWEwZGUyNGFjZTU1NDZmYWQyMTNmYThmZTVlY2RhMDI2NDQ0OCIsImlhdCI6MTcxMTkwODAxNX0.3RVKCUnhqQlgvfy9lxmAa1ltR_sLHVhHSZtvNJj7aik`,
              },
            }
          );
          if (res2.data) {
            if (res2.data.rows.length > 0) {
              setComments(res2.data.rows);
              let data = [];
              for (let index = 0; index < res2.data.rows.length; index++) {
                const res3 = await axios.get(
                  `https://moccasin-many-grasshopper-363.mypinata.cloud/ipfs/${res2.data.rows[index].ipfs_pin_hash}`
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

  useEffect(() => {
    // Increase the pageLoadCount by 1. This is used to calculate when the page loader should be displayed.
    setInterval(() => {
      fetchComments();
    }, 6000);
  }, []);

  useEffect(() => {
    fetchPost();
  }, []);
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
      <div className={"prose text-4xl font-bold text-gray-400 px-2 py-6 mt-8"}>
        Comments
      </div>
      {commentsData ? (
        <div>
          {commentsData?.map((item: any, index: number) => (
            <>
              <PostContainer key={item}>
                <PostUser {...item} />
                <PostBody postMetaData={null}>{item?.comment_content}</PostBody>
                <PostActionsContainer
                  postId={index}
                  message={item?.comment_content}
                  upload={item?.comment_media}
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
