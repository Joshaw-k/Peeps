"use client";

import { Post } from "./components/Posts";
import PostForm from "./components/PostForm";

export const Home = () => {
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
    //   </section>
    //   <section className={"col-span-3"}>
    //     <RightComponent />
    //   </section>
    // </section>
    <div>
      <PostForm />
      <div className={"prose text-4xl font-bold text-gray-400 px-2 py-6 mt-8"}>
        Posts
      </div>
      <Post />
    </div>
  );
};
