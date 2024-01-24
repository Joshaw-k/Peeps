// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
const { ethers } = require("ethers");
const viem = require("viem")
const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

const database = {
  users: [],
  posts: [],
  comments: [],
}

const User = {
  username: "",
  address: "",
  profile_pic: "",
  posts: [],
  comments: [],
  reposts: [],
  likes: 0,
  liked_posts: [],
  date_joined: 0,
}

const Post = {
  id: 0,
  username: "",
  content: {
    message: "",
    upload: ""
  },
  comments: [],
  likes: 0,
  reposts: [],
  date_posted: 0
}

const Comment = {
  id: 0,
  post_id: 0,
  username: "",
  content: {
    message: "",
    upload: ""
  },
  comments: [],
  likes: 0,
  reposts: [],
  date_commented: 0
}

const createProfile = async (username, profile_pic = "", msg_sender) => {
  const user = new User
  user.username = username
  user.address = msg_sender
  user.profile_pic = profile_pic
  user.date_joined = 0
  database.users.push(user)
  const result = JSON.stringify({ username, msg_sender, profile_pic })
  const hexResult = viem.stringToHex(result)
  const advance_req = await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: hexResult })
  })
  return advance_req
}

const createPost = async (username, message, upload = "") => {
  const post = new Post
  post.id = database.posts.length
  post.username = username
  post.content = {
    message, upload
  }
  post.date_posted = 0
  database.posts.push(post)
  const result = JSON.stringify({ username, message, upload })
  const hexResult = viem.stringToHex(result)
  const advance_req = await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: hexResult })
  })
  return advance_req
}

const createComment = async (post_id, username, message, upload = "") => {
  const comment = new Comment
  comment.id = database.comments.length
  comment.post_id = post_id
  comment.username = username
  comment.content = {
    message, upload
  }
  comment.date_posted = 0
  database.posts.push(comment)
  const result = JSON.stringify({ post_id, username, message, upload })
  const hexResult = viem.stringToHex(result)
  const advance_req = await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: hexResult })
  })
  return advance_req

}
const editPost = async (id, message) => {
  const post = database.posts.find((item) => item.id == id)
  post.content.message = message
  const result = JSON.stringify({ id, message })
  const hexResult = viem.stringToHex(result)
  const advance_req = await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: hexResult })
  })
  return advance_req

}
const deletePost = async (id) => {
  const newDB = database.posts.map(item => {
    if (item.id == id) {
      return
    } else {
      return item
    }
  })
  database.posts = newDB
  const result = JSON.stringify({ id })
  const hexResult = viem.stringToHex(result)
  const advance_req = await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: hexResult })
  })
  return advance_req

}
const likePost = async (id) => {
  const post = database.posts.find((item) => item.id == id)
  post.likes = post.likes + 1
  const result = JSON.stringify({ id })
  const hexResult = viem.stringToHex(result)
  const advance_req = await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: hexResult })
  })
  return advance_req

}
const fetchPostsByAlgorithm = () => { }



async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
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
