"use client";

import { calculateRepost } from "../utils";

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
    <div className="card w-full gap-y-1 rounded-box px-5 py-3 my-1 bg-gray-100">
      <div className="text-neutral-content font-bold">#{index}</div>
      <div className="font-bold">#{hashTag}</div>
      <div className="text-gray-600 text-sm">
        {calculateRepost(repostCount)}K repost
      </div>
    </div>
  );
};

export const Trending = () => {
  return (
    <section className={"px-4 mt-12 prose"}>
      <h2 className="">Trending Posts</h2>

      {trendingPosts.map((eachTrends) => (
        <TrendingCard
          index={eachTrends.index}
          hashTag={eachTrends.hashTag}
          repostCount={eachTrends.repostCount}
        ></TrendingCard>
      ))}
    </section>
  );
};
