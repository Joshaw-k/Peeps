// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
const { ethers } = require("ethers");
const viem = require("viem");
const axios = require("axios");
const classifyText = require("./classifier");
require('dotenv').config()
console.log("PROCESS ENV:", process.env)

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);


const fetchUserPosts = async () => {
  try {
    const res = await axios.get(
        `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_POSTS&metadata[keyvalues]["addr"]={"value":"${userProfileData?.wallet}","op":"eq"}&status=pinned`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
          },
        }
    );
    if (res.data) {
      if (res.data.rows.length > 0) {
        setPosts(res.data.rows);
        let data = [];
        for (let index = 0; index < res.data.rows.length; index++) {
          const res1 = await axios.get(
              `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${res.data.rows[index].ipfs_pin_hash}`
          );
          data.push(res1.data);
        }
        // data.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        setPostsData(data);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchPosts = async () => {
  // setIsPageLoading(true);
  console.log("IPFS PUBLIC JWT", process.env.IPFS_PUBLIC_JWT);
  const IPFS_PUBLIC_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkMjEwODYwOC01YzRhLTQ2MDQtOTJjMi1jNTkyMjg1ZGViNzYiLCJlbWFpbCI6ImF3aW5yaW40Ymxlc3NAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjJjYmE4MzNkYmM1MjQyNjFiNjU4Iiwic2NvcGVkS2V5U2VjcmV0IjoiZGE2ZWMwZDZlNjBmYmI0ZWY5MTdmOTkzMmFjZWEwZGUyNGFjZTU1NDZmYWQyMTNmYThmZTVlY2RhMDI2NDQ0OCIsImlhdCI6MTcxMTkwODAxNX0.3RVKCUnhqQlgvfy9lxmAa1ltR_sLHVhHSZtvNJj7aik";
  const IPFS_PUBLIC_GATEWAY_URL="https://moccasin-many-grasshopper-363.mypinata.cloud"
  try {
    const res = await axios.get(
        `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_POSTS&status=pinned`,
        {
          headers: {
            Authorization: `Bearer ${IPFS_PUBLIC_JWT}`,
          },
        }
    );
    console.log("AXIOS GET RESULT:", res);
    if (res.data) {
      if (res.data.rows.length > 0) {
        // setPosts(res.data.rows);
        let data = [];
        for (let index = 0; index < res.data.rows.length; index++) {
          const res1 = await axios.get(
              `${IPFS_PUBLIC_GATEWAY_URL}/ipfs/${res.data.rows[index].ipfs_pin_hash}`
          );
          data.push(res1.data);
        }
        console.log(data);
        // data.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        // setPostsData(data);
        // setIsPageLoading(false);
        // setIsPageError(false);
        // pageLoadCount === 0 && setPageLoadCount((value) => value + 1);
      } else {
        // setIsPageLoading(false);
        // setIsPageError(false);
        console.log("No results");
      }
    }
  } catch (error) {
    console.log("ERROR OCCURRED: ", error);
    // setIsPageLoading(false);
    // setIsPageError(true);
  }
};

const createReport = async (result) => {
  let advance_req;
  const hexresult = viem.stringToHex(result);
  advance_req = await fetch(rollup_server + "/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      payload: hexresult,
    }),
  });
  const json = await advance_req?.json();
  console.log(
      "Received status " +
      advance_req?.status +
      " with body " +
      JSON.stringify(json)
  );
  return "accept";
};

const createNotice = async (result) => {
  let advance_req;
  const hexResult = viem.stringToHex(result);
  advance_req = await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: hexResult }),
  });
  const json = await advance_req?.json();
  console.log(
      "Received status " +
      advance_req?.status +
      " with body " +
      JSON.stringify(json)
  );
  return "accept";
};

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  // await fetchPosts();

  const payload = data.payload;
  console.log(payload);
  let jsonPayload = {};
  const payloadStr = viem.hexToString(payload);
  jsonPayload = JSON.parse(payloadStr);

  if (jsonPayload.method === "recommendPost") {
    console.log(jsonPayload.data);
    console.log(classifyText("How big is Microsoft?"))
  }

  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
