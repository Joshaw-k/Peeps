"use client";

import { Post } from "./components/Posts";
import PostForm from "./components/PostForm";
import { useState } from "react";

export interface IInputProps {
  dappAddress: string;
}

export const Home = () => {
  const [dappAddress, setDappAddress] = useState<string>(
    "0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C"
  );
  return (
    // <section className={"grid grid-cols-12 py-8"}>
    //   <section className={"col-span-3"}>
    //     <UserLeft />
    //   </section>
    //   <section className={"col-span-6 px-4"}>
    //     <PostForm />
    //     <div
    //       className={"prose text-4xl font-bold text-gray-400 px-2 py-6 mt-8"}
    //     >
    //       Posts
    //     </div>
    //     <Post />
    //   </section> dappAddress={dappAddress}
    //   <section className={"col-span-3"}>
    //     <RightComponent />
    //   </section>
    // </section>
    <div>
      <PostForm dappAddress={dappAddress} />
      <div className={"prose text-4xl font-bold text-gray-400 px-2 py-6 mt-8"}>
        Posts
      </div>
      <Post />
    </div>
  );
};
