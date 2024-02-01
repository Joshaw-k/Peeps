// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
const { ethers } = require("ethers");
const viem = require("viem");
const TrendingAlgorithm = require("../getTrends");
// const { TrendingAlgorithm } = require("../getTrends");
const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

const database = {
  users: [],
  posts: [],
  comments: [],
  trendingWords: [],
};

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));

  const payload = data.payload;
  let JSONpayload = {};
  // try {
  //   if(String(data.metadata.msg_sender).toLowerCase() === DAPP_ADDRESS_REALY.toLowerCase())
  // }

  const payloadStr = viem.hexToString(payload);
  JSONpayload = JSON.parse(JSON.parse(payloadStr));
  console.log(`received request ${JSON.stringify(JSONpayload)}`);
  console.log(database);

  let advance_req;

  if (JSONpayload.method === "createPost") {
    if (JSONpayload.data.message == "" || null) {
      console.log("message cannot be empty");
      const result = JSON.stringify({
        error: String("Message:" + JSONpayload.data.message),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    console.log("creating post...");
    const post = {
      id: 0,
      username: "",
      address: "",
      content: {
        message: "",
        upload: "",
      },
      comments: [],
      likes: [],
      reposts: [],
      date_posted: 0,
    };
    post.id = database.posts.length;
    const user = database.users.find(
      (item) => item.address === data.metadata.msg_sender
    );
    post.username = user.username;
    post.address = user.address;
    post.content = {
      message: JSONpayload.data.message,
      upload: JSONpayload.data.upload,
    };

    post.date_posted = 0;
    database.posts.push(post);
    user?.posts.push(post.id);
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexResult }),
    });
  } else if (JSONpayload.method === "editPost") {
    const post = database.posts.find((item) => item.id == JSONpayload.data.id);
    if (!post) {
      console.log("post id is incorrect");
      const result = JSON.stringify({
        error: String("Post_Id:" + JSONpayload.data.id),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    if (JSONpayload.data.message == "" || null) {
      console.log("message cannot be empty");
      const result = JSON.stringify({
        error: String("Message:" + JSONpayload.data.message),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    post.content.message = JSONpayload.data.message;
    const result = JSON.stringify(database);

    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexResult }),
    });
  } else if (JSONpayload.method === "deletePost") {
    const post = database.posts.find((item) => item.id == JSONpayload.data.id);
    if (!post) {
      console.log("post id is incorrect");
      const result = JSON.stringify({
        error: String("Post_Id:" + JSONpayload.data.id),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    const newDB = database.posts.filter(
      (item) => item.id !== JSONpayload.data.id
    );
    database.posts = newDB;
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexResult }),
    });
  } else if (JSONpayload.method === "likePost") {
    const post = database.posts.find(
      (item) => item.id == Number(JSONpayload.data.id)
    );
    if (!post) {
      console.log("post id is incorrect");
      const result = JSON.stringify({
        error: String("Post_Id:" + JSONpayload.data.id),
      });
      const hexresult = viem.stringToHex(result);

      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
      return;
    }
    const user = database.users.find(
      (item) => item.address === data.metadata.msg_sender
    );
    post.likes.push(user.id);
    user.likes = user.likes + 1;
    user.liked_posts.push(post.id);
    // console.log(new TrendingAlgorithm().alltrendingPosts());
    database.trendingWords = new TrendingAlgorithm().alltrendingPosts();
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexResult }),
    });
  } else if (JSONpayload.method === "createProfile") {
    const userExist = database.users.find(
      (item) => item.address == data.metadata.msg_sender
    );
    if (userExist) {
      console.log("User address already mapped to a profile");
      const result = JSON.stringify({
        error: String("UserAddress:" + data.metadata.msg_sender),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
      return;
    }
    if (JSONpayload.data.username == "") {
      console.log("username cannot be empty or null");
      const result = JSON.stringify({
        error: String("Username:" + JSONpayload.data.username),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
      return;
    }
    console.log("creating profile...");
    const user = {
      id: 0,
      username: "",
      bio: "",
      address: "",
      profile_pic: "",
      posts: [],
      comments: [],
      reposts: [],
      likes: 0,
      liked_posts: [],
      date_joined: 0,
    };
    user.id = database.users.length;
    user.username = JSONpayload.data.username;
    user.address = data.metadata.msg_sender;
    user.bio = JSONpayload.data.bio;
    user.profile_pic = JSONpayload.data.profile_pic;
    user.date_joined = 0;
    database.users.push(user);
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexResult }),
    });
  } else if (JSONpayload.method === "editProfile") {
    const user = database.users.find(
      (item) => item.address == data.metadata.msg_sender
    );
    if (!user) {
      console.log("User address doesn't exist");
      const result = JSON.stringify({
        error: String("UserAddress:" + data.metadata.msg_sender),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    if (JSONpayload.data.username == "" || null) {
      console.log("username cannot be empty");
      const result = JSON.stringify({
        error: String("Username:" + JSONpayload.data.username),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    if (JSONpayload.data.bio == "" || null) {
      console.log("bio cannot be empty");
      const result = JSON.stringify({
        error: String("Bio:" + JSONpayload.data.bio),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    user.username = JSONpayload.data.username;
    user.bio = JSONpayload.data.bio;
    user.profile_pic = JSONpayload.data.profile_pic;
    const result = JSON.stringify(database);

    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexResult }),
    });
  } else if (JSONpayload.method === "deleteProfile") {
    const user = database.users.find(
      (item) => item.address == data.metadata.msg_sender
    );
    if (!user) {
      console.log("User address doesn't exist");
      const result = JSON.stringify({
        error: String("UserAddress:" + data.metadata.msg_sender),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    const newDB = database.users.filter(
      (item) => item.id !== JSONpayload.data.id
    );
    database.users = newDB;
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexResult }),
    });
  } else if (JSONpayload.method === "repost") {
    const post = database.posts.find((item) => item.id == JSONpayload.data.id);
    if (!post) {
      console.log("post id is incorrect");
      const result = JSON.stringify({
        error: String("Post_Id:" + JSONpayload.data.id),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    const user = database.users.find(
      (item) => item.address === data.metadata.msg_sender
    );
    if (!user) {
      console.log("User address doesn't exist");
      const result = JSON.stringify({
        error: String("UserAddress:" + data.metadata.msg_sender),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    post.reposts.push(user.id);
    user.reposts.push(post.id);
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexResult }),
    });
  } else if (JSONpayload.method === "createComment") {
    const comment = {
      id: 0,
      post_id: 0,
      username: "",
      content: {
        message: "",
        upload: "",
      },
      comments: [],
      likes: 0,
      reposts: [],
      date_commented: 0,
    };

    const post = database.posts.find(
      (item) => item.id == JSONpayload.data.post_id
    );
    if (!post) {
      console.log("post id is incorrect");
      const result = JSON.stringify({
        error: String("Post_Id:" + JSONpayload.data.id),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    const user = database.users.find(
      (item) => item.address === data.metadata.msg_sender
    );
    if (!user) {
      console.log("User address doesn't exist");
      const result = JSON.stringify({
        error: String("UserAddress:" + data.metadata.msg_sender),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    if (JSONpayload.data.message == "" || null) {
      console.log("message cannot be empty");
      const result = JSON.stringify({
        error: String("Message:" + JSONpayload.data.message),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    comment.id = database.comments.length;
    comment.post_id = JSONpayload.data.post_id;
    comment.username = user.username;
    comment.content = {
      message: JSONpayload.data.message,
      upload: JSONpayload.data.upload,
    };
    comment.date_posted = 0;
    database.comments.push(comment);
    user.comments.push(comment);
    post.comments.push(comment);
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexResult }),
    });
  } else if (JSONpayload.method === "deleteComment") {
    const comment = database.comments.find(
      (item) => item.id == JSONpayload.data.id
    );
    if (!comment) {
      console.log("comment id is incorrect");
      const result = JSON.stringify({
        error: String("Comment_Id:" + JSONpayload.data.id),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    const newDB = database.comments.filter(
      (item) => item.id !== JSONpayload.data.id
    );
    database.comments = newDB;
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexResult }),
    });
  } else {
    console.log("Incorrect method");
    const result = JSON.stringify({
      error: String("Method does not exist: " + JSONpayload.method),
    });
    const hexresult = viem.stringToHex(result);
    await fetch(rollup_server + "/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        payload: hexresult,
      }),
    });
  }

  const json = await advance_req?.json();
  console.log(
    "Received status " +
      advance_req?.status +
      " with body " +
      JSON.stringify(json)
  );
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
