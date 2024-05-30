"use client";

import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

import { useQuery, gql } from "@apollo/client";
import { EmptyPage } from "../EmptyPage";
import { LucideWifiOff, MessageSquareText } from "lucide-react";
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

export const PostExplore = () => {
    const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
    const [isPageError, setIsPageError] = useState<boolean>(false);
    const [pageLoadCount, setPageLoadCount] = useState<number>(0);
    const { posts, postsData } = usePeepsContext();

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
            {postsData ? (
                postsData.map((eachPost: any, index: number) => (
                    <PostContainer key={index}>
                        <PostUser {...eachPost} />
                        <PostBody postMetaData={posts[index]}>
                            {eachPost?.post_content}
                            {
                                eachPost?.post_media &&
                                <Image
                                    src={eachPost?.post_media}
                                    alt={"Post media"}
                                    width={100}
                                    height={100}
                                    className={"w-full rounded-lg mt-4 lg:rounded-box"}
                                />
                            }
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
            {postsData && postsData.length >= 10 && (
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
