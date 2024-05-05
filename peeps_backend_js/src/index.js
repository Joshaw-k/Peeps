// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
// const { ethers } = require("ethers");
const viem = require("viem");
const axios = require("axios");
// const classifyText = require("./classifier");
const trainClassifier = require("./postClassifier");
const createJSONFile = require("./createTrainJson");
const fs = require("node:fs");
const postArrayDifference = require("./utils");
const uniqueFromArray = require("./utils");
// require('dotenv').config()
console.log("PROCESS ENV:", process.env)

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

// LOAD TRAINED MODEL HERE
// Load Naive Bayes Text Classifier
// var Classifier = require('wink-naive-bayes-text-classifier');
// // Instantiate
// var nbc = Classifier();
// // Load wink nlp and its model
// const winkNLP = require('wink-nlp');
// // Load language model
// const model = require('wink-eng-lite-web-model');
// const readFilesLineByLine = require('./loadTrainData');
// const nlp = winkNLP(model);
// const its = nlp.its;
//
// const prepTask = function (text) {
//   const tokens = [];
//   nlp.readDoc(text)
//       .tokens()
//       // Use only words ignoring punctuations etc and from them remove stop words
//       .filter((t) => (t.out(its.type) === 'word' && !t.out(its.stopWordFlag)))
//       // Handle negation and extract stem of the word
//       .each((t) => tokens.push((t.out(its.negationFlag)) ? '!' + t.out(its.stem) : t.out(its.stem)));
//
//   return tokens;
// };
// nbc.definePrepTasks([prepTask]);
// // Configure behavior
// nbc.defineConfig({ considerOnlyPresence: true, smoothingFactor: 0.5 });
// // Train!
//
// // Example usage:
// const trainArray = [];
// const directoryPath = 'train-data';
// readFilesLineByLine(
//     directoryPath,
//     (line, name) => {
//       // console.log(`Line from file: ${line} - ${name}`);
//       // console.log(line, name);
//       nbc.learn(line, name);
//       // nbc.consolidate();
//       // trainArray.push([line, name]);
//     },
//     () => {
//       // console.log(trainArray.length);
//       // trainArray.map((eachTrainData, index) => {
//       //     if (index === trainArray.length - 1) console.log("done looping traindata");
//       //     nbc.learn(eachTrainData[0], eachTrainData[1]);
//       // });
//       console.log("printing");
//       nbc.consolidate();
//
//       console.log(nbc.predict('Is microsoft a 3 trillion dollar company'));
//       console.log(nbc.predict('What is the current value of Apples stock?'));
//     }
// );
// // // Consolidate all the training!!
// // nbc.consolidate();
// // // Start predicting...
// // console.log(nbc.predict('I would like to borrow 50000 to buy a new Audi R8 in New York'));
// // // -> autoloan
// // console.log(nbc.predict('I want to pay my car loan early'));
// // -> prepay

// classifyText("How big is microsoft?");

const outputFilePath = 'trainDataOutput.json';
createJSONFile(outputFilePath);
// trainClassifier();
let _nbc = undefined;

let modelTrained = false;

// Data to store in the dapp
let usersInterstDB = {};
let usersDB = {

};

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

function subtractArrays(array1, array2) {
  const maxLength = Math.max(array1.length, array2.length);

  // Pad the shorter array with zeroes to match the length of the longer array
  const paddedArray1 = array1.concat(Array(maxLength - array1.length).fill(0));
  const paddedArray2 = array2.concat(Array(maxLength - array2.length).fill(0));

  // Perform subtraction
  const result = [];
  for (let i = 0; i < maxLength; i++) {
    result.push(paddedArray1[i] - paddedArray2[i]);
  }

  return result;
}

async function handle_advance(data) {
  let jsonResult = {};
  try {
    jsonResult = require("./trainDataOutput.json");
  } catch (e) {
    jsonResult = {}
  }

  if (!modelTrained) {
    _nbc = trainClassifier();
    modelTrained = true;
  }

  console.log("Received advance request data " + JSON.stringify(data));
  // await fetchPosts();

  const payload = data.payload;
  console.log(payload);
  let jsonPayload = {};
  const payloadStr = viem.hexToString(payload);
  jsonPayload = JSON.parse(payloadStr);

  if (jsonPayload.method === "recommendPost") {
    console.log(jsonPayload.data);
    // fs.readdir("./", (err, files) => {
    //   if (err) {
    //     console.error('Error reading directory:', err);
    //     return;
    //   }
    //
    //   // Log each file and folder name
    //   files.forEach(file => {
    //     console.log(file);
    //   });
    // });
    // console.log(classifyText("How big is Microsoft?"))

    // Subtract currentUser posts from all posts
    const recommendedData = jsonPayload.data;
    const allPosts = recommendedData.posts || [];
    const myPosts = recommendedData.myPosts || [];
    const likedPosts = recommendedData.likedPosts || [];
    const personalPosts = myPosts.concat(likedPosts); // personalPosts is a combination of myPosts & likedPosts
    const userData = recommendedData.user;
    // const result = allPosts.map((value, index) => value - array2[index]);

    // Get the difference between allPosta and myPosts if both exists.
    const postMinus = postArrayDifference(allPosts, personalPosts);
    console.log("postMinus", postMinus);

    // Check that likedPosts is returned
    if (likedPosts.length > 0) {
      // Add liked posts to postMinus before detecting the user's interests
      // postMinus.concat(likedPosts);
    }

    // Check if user has interests in the userDB
    // DETERMINE THE USER'S INTERESTS
    const thisUserInterests = usersInterstDB[userData.wallet];
    // console.log("this user interests", thisUserInterests);
    // if (thisUserInterests === undefined) {
    // console.log("About to change userInterests")
    let _userInterests = [];
    personalPosts.map((eachMyPost) => {
      _userInterests.push(_nbc.predict(eachMyPost.post_content));
    });
    usersInterstDB[userData.wallet] = uniqueFromArray(_userInterests);
    // console.log("Gotten user Interests", _userInterests);
    // console.log("What are User's INterests", usersInterstDB[userData.wallet]);
    // }

    // Check the posts that are in the user's interest from the postMinus Array.
    if (postMinus.length > 0) {
      // update each post with the category it belongs.
      postMinus.map(eachPostMinus => {
        eachPostMinus["post_category"] = _nbc.predict(eachPostMinus.post_content);
      });
      console.log("post Minus", postMinus.length, postMinus);
      const postMinusSimilarInterests = postMinus.filter(it => usersInterstDB[userData.wallet].includes(it.post_category));
      // {
      //   // console.log(usersInterstDB[userData.wallet], it.post_content);
      //   // usersInterstDB[userData.wallet].includes(_nbc.predict(it.post_content))
      // }
      // .map((eachPostMinus) => {
      //   _nbc.predict(eachPostMinus);
      // });
      await createNotice(JSON.stringify([...postMinusSimilarInterests, ...personalPosts]));
      console.log("Inside post Minus similar interests", postMinusSimilarInterests);
    } else {
      /*const postMinusSimilarInterests = [
        {
          post_user: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
          post_id: 'b8683c99-99f8-489b-99cd-c7779dec98c3',
          post_username: 'Mayowa',
          post_displayName: 'Mayowa V1',
          post_content: 'Enjoy the irony.',
          post_media: '',
          post_comments: 0,
          post_repeeps: 0,
          post_likes: 0,
          createdAt: '2024-05-02T12:02:49.141Z',
        }
      ];
      postMinusSimilarInterests["post_category"] = _nbc.predict(postMinusSimilarInterests[0].post_content);
      await createNotice(JSON.stringify(postMinusSimilarInterests));*/
      await createNotice(JSON.stringify([]));
    }

    // Categorize the difference between allPosts and userPosts.
    // Only the post that match the user's preference is what is returned to the user as a priority with the other
    // posts as additions.
    // for (let i = 0; i < result.length; i++) {
    //   _nbc.predict(results[i].post_content)
    // }
  }
  // console.log(jsonResult);
  // console.log()
  // console.log(classifyText("How big is Microsoft?"))
  console.log(_nbc.predict("Bitcoin is unstable right now leading to market fluctuations"));

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
    // classifyText("How big is Microsoft?")

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
