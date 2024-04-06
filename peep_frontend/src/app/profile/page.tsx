"use client";

import { useConnectWallet } from "@web3-onboard/react";
import {
  PostActionsContainer,
  PostBody,
  PostContainer,
  PostUser,
} from "../components/Posts";
import { GET_NOTICES, TNotice, useNotices } from "../components/useNotices";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { usePeepsContext } from "../context";
import { EmptyPage } from "../components/EmptyPage";
import { LogIn, MessageSquareWarning } from "lucide-react";
import { FaToggleOff } from "react-icons/fa6";
import {Tab} from "@headlessui/react";
import classNames from "classnames";

const Profile = () => {
  // const { data, error, loading, notices } = useNotices();
  const [currentAddress, setCurrentAddress] = useState<string>("");
  // const [{ wallet }] = useConnectWallet();
  const { wallet } = usePeepsContext();
  const [endCursor, setEndCursor] = useState(20);

  useEffect(() => {
    console.log("Open A", wallet?.accounts[0]);
    setCurrentAddress(wallet?.accounts[0].address);
  }, [wallet?.accounts[0].address]);

  // fetch the list of users and from the latest notice. Get the address of a user username

  const [cursor, setCursor] = useState(null);

  const { loading, error, data } = useQuery(GET_NOTICES, {
    variables: { cursor },
    // pollInterval: 500,
  });

  if (!wallet) {
    return (
      <EmptyPage
        icon={<FaToggleOff size={48} />}
        text={"Connect wallet to see your posts"}
      ></EmptyPage>
    );
  }

  if (loading)
    return (
      <EmptyPage
        icon={<span className="loading loading-dots loading-lg"></span>}
        text={""}
      >
        <div className="text-xl">Loading...</div>
      </EmptyPage>
    );

  // if (!data || !data.notices)
  //   return (
  //     <EmptyPage
  //       icon={<FaToggleOff size={48} />}
  //       text={"You have not created any posts yet"}
  //     ></EmptyPage>
  //   );

  const notices: TNotice[] = data?.notices.edges
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

  if (notices?.length < 1)
    return (
      <EmptyPage
        icon={<MessageSquareWarning size={48} />}
        text={"You haven't made any post"}
      ></EmptyPage>
    );

  return (
    <section>
      {/*<div className={"prose text-4xl font-bold text-gray-400 px-2 py-6 mt-8"}>
        Your Profile
      </div>*/}

        <div className="">
            <div className="hero min-h-60 bg-base-200">
                <div className="hero-content text-center"></div>
            </div>
            <div className={"relative w-full px-4"}>
                <div className={"absolute -top-12 z-10"}>
                    <div className="avatar">
                        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"/>
                        </div>
                    </div>
                </div>
                <div className={"absolute top-2 right-2 z-[1]"}>
                    <button className={"btn btn-primary rounded-box"}>Edit Profile</button>
                </div>
                <div className={"relative pt-20 pb-16 space-y-4 bg-base-100"}>
                    <div className={""}>
                        <div className={"font-bold text-2xl"}>Mayowa Obisesan</div>
                        <div>@Blessed_mayowa</div>
                    </div>
                    <div className={""}>
                        Software Engineer | Art Lover | Quantum theory enthusiast
                    </div>
                    <div>Date Joined: May 2023</div>
                    <div>
                        <span>Followers: 144</span> |
                        <span>Following: 120</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Profile Tabs - Posts, Followers, Likes*/}
        <div className={""}>
            <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl p-1">
                    <Tab className={({ selected }) =>
                        classNames(
                            'rounded-lg px-8 py-2.5 font-medium leading-5',
                            'ring-white/60 focus:outline-none',
                            selected
                                ? 'bg-primary text-primary-content shadow'
                                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                        )}>Posts</Tab>
                    <Tab className={({ selected }) =>
                        classNames(
                            'rounded-lg px-8 py-2.5 font-medium leading-5',
                            'ring-white/60 focus:outline-none',
                            selected
                                ? 'bg-primary text-primary-content shadow'
                                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                        )}>Likes</Tab>
                    <Tab className={({ selected }) =>
                        classNames(
                            'rounded-lg px-8 py-2.5 font-medium leading-5',
                            'ring-white/60 focus:outline-none',
                            selected
                                ? 'bg-primary text-primary-content shadow'
                                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                        )}>Followers</Tab>
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel className={classNames(
                        'rounded-xl p-6',
                        'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                    )}>
                        Posts Content Panel
                    </Tab.Panel>
                    <Tab.Panel className={classNames(
                        'rounded-xl p-6',
                        'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                    )}>Likes Panel</Tab.Panel>
                    <Tab.Panel className={classNames(
                        'rounded-xl p-6',
                        'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                    )}>Followers Panel</Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
        {/* {console.log(currentAddress)}
      {console.log(JSON.parse(notices.reverse()[0].payload).posts)}
      {console.log(
        JSON.parse(notices.reverse()[0].payload).posts.filter(
          (it: any) => it.address === currentAddress
        )
      )} */}
        {/*{JSON.parse(notices?.reverse()[0].payload)
        .posts.filter((it: any) => it.address === currentAddress)
        .splice(0, endCursor)
        .map((eachNotice: any) => (
          // .filter((it) => JSON.parse(it.payload).posts.length > 0)
          <>
            <PostContainer key={eachNotice}>
               {console.log(eachNotice)}
              {console.log(wallet?.accounts[0])}
              <PostUser {...eachNotice} />
              <PostBody>{eachNotice?.content?.message}</PostBody>
              <PostActionsContainer />
            </PostContainer>
             <div className="divider"></div>
          </>
        ))}*/}
      {/*<section className="flex flex-row justify-center w-full mx-auto">
        <button
          title="load more button"
          type="button"
          className="btn btn-wide block"
          onClick={() => setEndCursor((endCursor) => endCursor + 20)}
        >
          Load more
        </button>
      </section>*/}
    </section>
  );
};

export default Profile;
