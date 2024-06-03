"use client";

import Link from "next/link";
import { calculateRepost } from "../utils";
import { isJsonString, usePeepsContext } from "../context";
import { EmptyPage } from "./EmptyPage";
import { TrendingUp } from "lucide-react";
import { Search } from "./Search";

// Trending works by performing a calculation on the cartesi machine and returning a notice for the trends every 4 minutes or less.
// The time to return the trend is fixed, but it can change based on the volume of content on the platform.
// A computation will run in the cartesi machine to process all the posts on the platform and then find the trending posts from those posts.
// Based on reoccuring words, hash tags, etc.

const trendingPosts = [
  {
    index: 1,
    location: "Nigeria",
    hashTag: "Finally",
    repostCount: 45000,
  },
  {
    index: 2,
    location: "UK",
    hashTag: "Protocol",
    repostCount: 12000,
  },
  {
    index: 3,
    location: "Nigeria",
    hashTag: "Blockchain",
    repostCount: 38000,
  },
  {
    index: 4,
    location: "Nigeria",
    hashTag: "Cartesi",
    repostCount: 17000,
  },
];

interface ITweet {
  index: number;
  hashTag: string;
  repostCount: number;
}

const TrendingCard = ({ index, hashTag, repostCount }: ITweet) => {
  return (
    <Link
      href={`/trending/${hashTag.toLowerCase()}`}
      className="card w-full gap-y-1 rounded-box px-5 py-3 my-1 bg-gray-100 hover:bg-gray-200 dark:bg-base-300 dark:hover:bg-base-300 transition-colors no-underline"
    >
      <div className="text-neutral-content font-bold dark:text-gray-700">
        #{index}
      </div>
      <div className="font-bold">{hashTag}</div>
      <div className="text-gray-600 text-sm">{repostCount} repeep</div>
    </Link>
  );
};

export const Trending = () => {
  const { loading, postsNotice } = usePeepsContext();

  if (loading)
    return (
      <EmptyPage
        icon={<span className="loading loading-dots loading-lg"></span>}
        text={""}
      >
        <div className="text-xl">Loading...</div>
      </EmptyPage>
    );

  /*if (!data || !data.notices)
    return (
      <EmptyPage
        icon={<TrendingUp size={48} />}
        text={"No trending posts..."}
      ></EmptyPage>
    );*/

  if (postsNotice?.length < 1)
    return (
      <>
        <div className="md:hidden">
          <Search />
          </div>
        <EmptyPage
          icon={<TrendingUp size={48} />}
          text={"Nothing is trending at the moment"}
        ></EmptyPage>
      </>
    );

  return (
    <section className={"px-2 lg:px-4 mt-4 lg:mt-12 prose"}>
      <div className="md:hidden">
        <Search />
        </div>
      <h2 className="">Trending Posts</h2>
      {console.log(postsNotice, isJsonString(postsNotice.reverse()[0]?.payload))}

      {
      (postsNotice.length > 0 && isJsonString(postsNotice.reverse()[0]?.payload))
       && (JSON.parse(postsNotice.reverse()[0]?.payload)?.trendingWords?.map(
        (eachTrends: any, index: number) => (
          <TrendingCard
            key={eachTrends[0]}
            index={index + 1}
            hashTag={eachTrends[0]}
            repostCount={eachTrends[1]}
          ></TrendingCard>
        )
      ))
      }
    </section>
  );
};
