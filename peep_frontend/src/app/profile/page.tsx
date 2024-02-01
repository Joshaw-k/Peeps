"use client";

import { useConnectWallet } from "@web3-onboard/react";
import {
  Post,
  PostActions,
  PostBody,
  PostContainer,
  PostUser,
} from "../components/Posts";
import { GET_NOTICES, TNotice, useNotices } from "../components/useNotices";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { usePeepsContext } from "../context";

const Profile = () => {
  // const { data, error, loading, notices } = useNotices();
  const [currentAddress, setCurrentAddress] = useState<string>("");
  // const [{ wallet }] = useConnectWallet();
  const { wallet } = usePeepsContext();

  useEffect(() => {
    console.log("Open A", wallet?.accounts[0]);
    setCurrentAddress(wallet?.accounts[0].address);
  }, [wallet?.accounts[0].address]);

  // fetch the list of users and from the latest notice. Get the address of a user username

  const [cursor, setCursor] = useState(null);

  const { loading, error, data } = useQuery(GET_NOTICES, {
    variables: { cursor },
    pollInterval: 500,
  });

  if (loading) return <p>Loading...</p>;

  if (!data || !data.notices) return <p>No notices</p>;

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

  return (
    <section>
      <div className={"prose text-4xl font-bold text-gray-400 px-2 py-6 mt-8"}>
        Your Profile
      </div>
      {/* {console.log(currentAddress)}
      {console.log(JSON.parse(notices.reverse()[0].payload).posts)}
      {console.log(
        JSON.parse(notices.reverse()[0].payload).posts.filter(
          (it: any) => it.address === currentAddress
        )
      )} */}
      {JSON.parse(notices?.reverse()[0].payload)
        .posts.filter((it: any) => it.address === currentAddress)
        .map((eachNotice: any) => (
          // .filter((it) => JSON.parse(it.payload).posts.length > 0)
          <>
            <PostContainer key={eachNotice}>
              {/* {console.log(eachNotice)} */}
              {console.log(wallet?.accounts[0])}
              <PostUser {...eachNotice} />
              <PostBody>{eachNotice?.content?.message}</PostBody>
              <PostActions />
            </PostContainer>
            {/* <div className="divider"></div> */}
          </>
        ))}
    </section>
  );
};

export default Profile;
