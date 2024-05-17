// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
const { ethers } = require("ethers");
import { hexToString } from "viem";
import { Router } from "cartesi-router";
import { Wallet, Notice, Error_out } from "cartesi-wallet";
const trainClassifier = require("./postClassifier");
const createJSONFile = require("./createTrainJson");
const fs = require("node:fs");
const postArrayDifference = require("./utils");
const uniqueFromArray = require("./utils");
const TrendingAlgorithm = require("./getTrends");

const erc20PortalAddress = "0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB";
const dAppAddressRelayContract = "0xF5DE34d6BbC0446E2a45719E718efEbaaE179daE";

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

const wallet = new Wallet(new Map());

const router = new Router(wallet);

const outputFilePath = "trainDataOutput.json";
createJSONFile(outputFilePath);
console.log("JSON file created successfully", outputFilePath);

// trainClassifier();
let _nbc = undefined;

let modelTrained = false;

// Data to store in the dapp
let usersInterstDB = {};
let usersDB = {};
let noticeDB = {
  posts: [],
  trendingWords: [],
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

const send_request = async (output) => {
  if (output) {
    let endpoint;
    console.log("type of output", output.type);

    if (output.type == "notice") {
      endpoint = "/notice";
    } else if (output.type == "voucher") {
      endpoint = "/voucher";
    } else {
      endpoint = "/report";
    }

    console.log(`sending request ${typeof output}`);
    const response = await fetch(rollup_server + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(output),
    });
    console.debug(
      `received ${output.payload} status ${response.status} body ${response.body}`
    );
  } else {
    output.forEach((value) => {
      // send_request(value);
    });
  }
};

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  try {
    const payload = data.payload;
    console.log(payload);
    const msg_sender = data.metadata.msg_sender;
    console.log("msg sender is", msg_sender.toLowerCase());

    const payloadStr = hexToString(payload);
    // console.log("Payload string", payloadStr);

    // deposit erc20
    if (msg_sender.toLowerCase() === erc20PortalAddress.toLowerCase()) {
      console.log("Inside deposit function");
      try {
        return router.process("erc20_deposit", payload);
      } catch (e) {
        return new Error_out(`failed to process ERC20Deposit ${payload} ${e}`);
      }
    }

    if (msg_sender.toLowerCase() === dAppAddressRelayContract.toLowerCase()) {
      rollup_address = payload;
      router.set_rollup_address(rollup_address, "erc20_withdraw");
      console.log("Setting DApp address");
      return new Notice(
        JSON.stringify({"dappContract":`DApp address set up successfully to ${rollup_address}`})
      );
    }

    const jsonpayload = JSON.parse(payloadStr);
    // console.log("Payload string data", jsonpayload);
    
    try {
      if (jsonpayload.method === "recommendPost") {
        let jsonResult = {};
        try {
          jsonResult = require("./trainDataOutput.json");
        } catch (e) {
          jsonResult = {};
        }
    
        if (!modelTrained) {
          _nbc = trainClassifier();
          modelTrained = true;
        }
        const recommendedData = jsonpayload.data;
        const allPosts = recommendedData.posts || [];
        const myPosts = recommendedData.myPosts || [];
        const likedPosts = recommendedData.likedPosts || [];
        const personalPosts = myPosts.concat(likedPosts); // personalPosts is a combination of myPosts & likedPosts
        const userData = recommendedData.user;
        // const result = allPosts.map((value, index) => value - array2[index]);

        // Get the difference between allPosta and myPosts if both exists.
        const postMinus = postArrayDifference(allPosts, personalPosts);

        // Check if user has interests in the userDB
        // DETERMINE THE USER'S INTERESTS
        const thisUserInterests = usersInterstDB[userData.wallet];
        let _userInterests = [];
        personalPosts.map((eachMyPost) => {
          _userInterests.push(_nbc.predict(eachMyPost.post_content));
        });
        usersInterstDB[userData.wallet] = uniqueFromArray(_userInterests);

        // Check the posts that are in the user's interest from the postMinus Array.
        if (postMinus.length > 0) {
          // update each post with the category it belongs.
          postMinus.map((eachPostMinus) => {
            eachPostMinus["post_category"] = _nbc.predict(
              eachPostMinus.post_content
            );
          });
          const postMinusSimilarInterests = postMinus.filter((it) =>
            usersInterstDB[userData.wallet].includes(it.post_category)
          );

          // Prepare the notice to send to the frontend
          const _allPostsContentArray = allPosts.map(
            (eachAllPost) => eachAllPost.post_content
          );
          noticeDB.posts = [...postMinusSimilarInterests, ...personalPosts];
          noticeDB.trendingWords = new TrendingAlgorithm(
            _allPostsContentArray
          ).alltrendingPosts();
          // await createNotice(JSON.stringify(noticeDB));
          return new Notice(JSON.stringify(noticeDB));
        } else {
          await createNotice(JSON.stringify([]));
        }
      } else return router.process(jsonpayload.method, data);
    } catch (e) {
      return new Error_out(`failed to process command ${payloadStr} ${e}`);
    }
  } catch (e) {
    console.error(e);
    return new Error_out(`failed to process advance_request ${e}`);
  }
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  const url = hexToString(data.payload).split("/");
  console.log(url);
  return router.process(url[0], url[1]); // balance/account
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

      var typeq = rollup_req.request_type;
      console.log(typeq);
      var handler;
      if (typeq === "inspect_state") {
        handler = handlers.inspect_state;
      } else {
        handler = handlers.advance_state;
      }
      var output = await handler(rollup_req.data);
      finish.status = "accept";
      if (output instanceof Error_out) {
        finish.status = "reject";
      }
      // send the request
      await send_request(output);
    }
  }
})();
