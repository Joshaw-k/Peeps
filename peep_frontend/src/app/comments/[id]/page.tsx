"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRollups } from "../../useRollups";
import { defaultDappAddress } from "../../utils/constants";
import { ethers } from "ethers";
import { useQuery, gql } from "@apollo/client";
import { CommentModal } from "../../components/commentModal";
import { FaRetweet } from "react-icons/fa6";
import { TNotice } from "../../components/useNotices";
import {
  PostActions,
  PostBody,
  PostContainer,
  PostUser,
} from "../../components/Posts";

// GraphQL query to retrieve notices given a cursor
const GET_NOTICES = gql`
  query GetNotices($cursor: String) {
    notices(first: 10, after: $cursor) {
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
const page = ({ params }) => {
  const [cursor, setCursor] = useState(null);
  console.log(params.id);

  const { loading, error, data } = useQuery(GET_NOTICES, {
    variables: { cursor },
    // pollInterval: 500,
  });

  // if (fetching) return <p>Loading...</p>;
  if (loading) return <p>Loading...</p>;
  // if (error) return <p>Oh no... {error.message}</p>;

  if (!data || !data.notices) return <p>No notices</p>;

  const notices: TNotice[] = data.notices.edges
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
    });

  if (notices.length < 1) {
    return <p>No Notices</p>;
  }
  const post = JSON.parse(notices.reverse()[0].payload).posts.find(
    (item) => item.id == params.id
  );
  console.log(post);
  return (
    <div>
      <PostContainer key={post}>
        {console.log(post)}
        <PostUser {...post} />
        <PostBody>{post?.content?.message}</PostBody>
        <PostActions
          postId={post.id}
          message={post?.content?.message}
          upload={post?.content?.uplooad}
          postData={post}
        />
        {/* {<PostContainer></PostContainer>} */}
      </PostContainer>
      <div className={"prose text-4xl font-bold text-gray-400 px-2 py-6 mt-8"}>
        Comments
      </div>
      {notices ? (
        <div>
          {post?.comments?.map((item) => (
            <>
              <PostContainer key={item}>
                {console.log(item)}
                <PostUser {...item} />
                <PostBody>{item?.content?.message}</PostBody>
                <PostActions
                  postId={item.id}
                  message={item?.content?.message}
                  upload={item?.content?.uplooad}
                  postData={item}
                />
                {/* {<PostContainer></PostContainer>} */}
              </PostContainer>
            </>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default page;
