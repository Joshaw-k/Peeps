"use client";

import { Post } from "./components/Posts/Posts";
import PostForm from "./components/PostForm";
import { useState } from "react";
import {Tab} from "@headlessui/react";
import classNames from "classnames";
import {PostActionsContainer, PostBody, PostContainer, PostUser} from "./components/Posts";
import Link from "next/link";
import {PostExplore} from "./components/Posts/PostsExplore";
import {usePeepsContext} from "./context";

export interface IInputProps {
  dappAddress: string;
}

export const Home = () => {
  const [dappAddress, setDappAddress] = useState<string>(
    "0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C"
  );
  const {postsNotice} = usePeepsContext();

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
    <div className={"lg:py-0"}>
      <PostForm dappAddress={dappAddress} />
      {
        postsNotice.length > 0
            ? <div className={""}>
              {/* For you & Explore tabs */}
              <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl p-1">
                  <Tab
                      className={({selected}) =>
                          classNames(
                              "rounded-lg px-8 py-2.5 leading-5 prose text-xl lg:text-3xl font-semibold text-gray-400 lg:mt-8",
                              "ring-white/60 focus:outline-none",
                              selected
                                  ? "bg-primary text-primary-content shadow font-bold"
                                  : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                          )
                      }
                  >
                    For You
                  </Tab>
                  <Tab
                      className={({selected}) =>
                          classNames(
                              "rounded-lg px-8 py-2.5 leading-5 prose text-xl lg:text-3xl font-semibold text-gray-400 lg:mt-8",
                              "ring-white/60 focus:outline-none",
                              selected
                                  ? "bg-primary text-primary-content shadow font-bold"
                                  : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                          )
                      }
                  >
                    Explore
                  </Tab>
                  {/*<Tab
                        className={({selected}) =>
                            classNames(
                                "rounded-lg px-8 py-2.5 font-medium leading-5",
                                "ring-white/60 focus:outline-none",
                                selected
                                    ? "bg-primary text-primary-content shadow"
                                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                            )
                        }
                    >
                        Followers
                    </Tab>*/}
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel
                      className={classNames(
                          "rounded-xl p-6",
                          "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                      )}
                  >
                    <Post/>
                  </Tab.Panel>
                  <Tab.Panel
                      className={classNames(
                          "rounded-xl p-6",
                          "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                      )}
                  >
                    <PostExplore/>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
            : <>
              <div className={"prose text-xl lg:text-4xl font-bold text-gray-400 px-2 py-6 lg:mt-8"}>
                Posts
              </div>
              <Post/>
            </>
      }

    </div>
  );
};
