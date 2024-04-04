const viem = require("viem");
const TrendingAlgorithm = require("../getTrends");
const { userSchema, commentSchema, postSchema, likesSchema, trendingPostsSchema } = require("./schema");
const { search, create, insert, insertMultiple, removeMultiple, remove } = require("@orama/orama");

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;

// Test the peeps db
const userDB = await create({
  schema: userSchema,
  id: 'user-db'
});
const postDB = await create({
  schema: postSchema,
  id: 'post-db'
});
const commentDB = await create({
  schema: commentSchema,
  id: 'comment-db'
});
const likesDB = await create({
  schema: likesSchema,
  id: 'likes-db'
});
const trendingPostsDB = await create({
  schema: trendingPostsSchema,
  id: 'trending-posts-db'
});

const report = async (result) => {
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

const notice = async (result) => {
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

const updateTrendingPostsDB = async () => {
  const currentTrendingPosts = new TrendingAlgorithm().alltrendingPosts();
  let currentTrendingPostsArray = [];
  currentTrendingPosts.map((eachTrend) => {
    currentTrendingPostsArray.push({
      word: eachTrend[0],
      repostCount: eachTrend[1],
      createdAt: new Date().toLocaleDateString()
    });
  });
  const trendingPostsDBResultsId = await search(trendingPostsDB, {});
  await removeMultiple(trendingPostsDB, trendingPostsDBResultsId);
  await insertMultiple(trendingPostsDB, currentTrendingPostsArray);
}


const Action = async (payload, data, database) => {
  if (payload.method === "createPost") {
    if (payload.data.message == "" || null) {
      console.log("message cannot be empty");
      const result = JSON.stringify({
        error: String("Message:" + payload.data.message),
      });
      await report(result);
    }
    console.log("creating post...");
    // Create posts
    await insert(postDB, {
      address: user.address,
      user: {
        username: user.username,
        profilePic: user.profile_pic
      },
      content: {
        message: payload.data.message,
        upload: [].push(payload.data.upload),
        uploadType: ""  // image or video
      },
      comments: 0,
      reposts: 0,
      createdAt: new Date().toLocaleDateString()
    });
    await updateTrendingPostsDB();

    const postDBResults = await search(postDB, {});

    // const post = {
    //   id: 0,
    //   username: "",
    //   address: "",
    //   content: {
    //     message: "",
    //     upload: "",
    //   },
    //   comments: [],
    //   likes: [],
    //   reposts: [],
    //   date_posted: 0,
    // };
    // post.id = database.posts.length;
    // const user = database.users.find(
    //   (item) => item.address === data.metadata.msg_sender
    // );
    // post.username = user.username;
    // post.address = user.address;
    // post.content = {
    //   message: payload.data.message,
    //   upload: payload.data.upload,
    // };
    // post.date_posted = 0;
    // database.posts.push(post);
    // database.trendingWords = new TrendingAlgorithm().alltrendingPosts();
    // user?.posts.push(post.id);
    // database.trendingWords = new TrendingAlgorithm().alltrendingPosts();
    // const result = JSON.stringify(database);

    const result = JSON.stringify(postDBResults);
    await notice(result);
  } else if (payload.method === "editPost") {
    const post = database.posts.find((item) => item.id == payload.data.id);
    if (!post) {
      console.log("post id is incorrect");
      const result = JSON.stringify({
        error: String("Post_Id:" + payload.data.id),
      });
      await report(result);
    }
    if (payload.data.message == "" || null) {
      console.log("message cannot be empty");
      const result = JSON.stringify({
        error: String("Message:" + payload.data.message),
      });
      await report(result);
    }
    post.content.message = payload.data.message;
    const result = JSON.stringify(database);

    await notice(result);
  } else if (payload.method === "deletePost") {
    const post = database.posts.find((item) => item.id == payload.data.id);
    if (!post) {
      console.log("post id is incorrect");
      const result = JSON.stringify({
        error: String("Post_Id:" + payload.data.id),
      });
      await report(result);
    }
    const newDB = database.posts.filter((item) => item.id !== payload.data.id);
    database.posts = newDB;
    const result = JSON.stringify(database);
    await notice(result);
  } else if (payload.method === "likePost") {
    // Get the post Id to like
    const postDBSearchResults = await search(postDB, {
      where: {
        id: Number(payload.data.id)
      }
    });
    if (postDBSearchResults.count > 0) {
      console.log("Post does not exist");
      const result = JSON.stringify({
        error: String("Post_Id:" + payload.data.id),
      });
      await report(result);
      return;
    }

    const postIdToLike = postDBResults.hits.map((hit) => hit.document);

    await insert(likesDB, {
      postId: postIdToLike[0].id,
      createdAt: new Date().toLocaleDateString()
    });
    await updateTrendingPostsDB();

    const postDBResults = await search(postDB, {});
    const result = JSON.stringify(postDBResults);

    // const post = database.posts.find(
    //   (item) => item.id == Number(payload.data.id)
    // );
    // if (!post) {
    //   console.log("post id is incorrect");
    //   const result = JSON.stringify({
    //     error: String("Post_Id:" + payload.data.id),
    //   });
    //   await report(result);
    //   return;
    // }
    // const user = database.users.find(
    //   (item) => item.address === data.metadata.msg_sender
    // );
    // post.likes.push(user.id);
    // user.likes = user.likes + 1;
    // user.liked_posts.push(post.id);
    // database.trendingWords = new TrendingAlgorithm().alltrendingPosts();
    // const result = JSON.stringify(database);

    await notice(result);
  } else if (payload.method === "createProfile") {
    const userDBSearchResults = await search(userDB, {
      where: {
        address: data.metadata.msg_sender
      }
    });
    if (userDBSearchResults.count > 0) {
      console.log("User already has a profile");
      const result = JSON.stringify({
        error: String("UserAddress:" + data.metadata.msg_sender),
      });
      await report(result);
      return;
    }

    await insert(userDB, {
      address: data.metadata.msg_sender,
      username: payload.data.username,
      bio: payload.data.bio,
      profilePic: payload.data.profile_pic,
      dateJoined: new Date().toLocaleDateString(),
      createdAt: new Date().toLocaleDateString()
    });

    await updateTrendingPostsDB();
    const userDBResults = await search(userDB, {});
    const result = JSON.stringify(userDBResults);

    // const userExist = database.users.find(
    //   (item) => item.address == data.metadata.msg_sender
    // );
    // if (userExist) {
    //   console.log("User address already mapped to a profile");
    //   const result = JSON.stringify({
    //     error: String("UserAddress:" + data.metadata.msg_sender),
    //   });
    //   await report(result);
    //   return;
    // }
    // if (payload.data.username == "") {
    //   console.log("username cannot be empty or null");
    //   const result = JSON.stringify({
    //     error: String("Username:" + payload.data.username),
    //   });
    //   await report(result);
    //   return;
    // }
    // console.log("creating profile...");
    // const user = {
    //   id: 0,
    //   username: "",
    //   bio: "",
    //   address: "",
    //   profile_pic: "",
    //   posts: [],
    //   comments: [],
    //   reposts: [],
    //   likes: 0,
    //   liked_posts: [],
    //   date_joined: 0,
    // };
    // user.id = database.users.length;
    // user.username = payload.data.username;
    // user.address = data.metadata.msg_sender;
    // user.bio = payload.data.bio;
    // user.profile_pic = payload.data.profile_pic;
    // user.date_joined = 0;
    // database.users.push(user);
    // database.trendingWords = new TrendingAlgorithm().alltrendingPosts();
    // const result = JSON.stringify(database);

    await notice(result);
  } else if (payload.method === "editProfile") {
    const userDBSearchResults = await search(userDB, {
      where: {
        address: data.metadata.msg_sender
      }
    });
    // Remove the user before inserting the user
    await remove(userDB, userDBSearchResults);

    // Insert the user again
    await insert(userDB, {
      address: data.metadata.msg_sender,
      username: payload.data.username,
      bio: payload.data.bio,
      profilePic: payload.data.profile_pic,
      dateJoined: new Date().toLocaleDateString(),
      createdAt: new Date().toLocaleDateString()
    });

    const userDBResults = await search(userDB, {});
    const result = JSON.stringify(userDBResults);


    // if (userDBSearchResults.count > 0) {
    //   console.log("User does not exist");
    //   const result = JSON.stringify({
    //     error: String("UserAddress:" + data.metadata.msg_sender),
    //   });
    //   await report(result);
    //   return;
    // }

    // const user = database.users.find(
    //   (item) => item.address == data.metadata.msg_sender
    // );
    // if (!user) {
    //   console.log("User address doesn't exist");
    //   const result = JSON.stringify({
    //     error: String("UserAddress:" + data.metadata.msg_sender),
    //   });
    //   await report(result);
    // }
    // if (payload.data.username == "" || null) {
    //   console.log("username cannot be empty");
    //   const result = JSON.stringify({
    //     error: String("Username:" + payload.data.username),
    //   });
    //   await report(result);
    // }
    // if (payload.data.bio == "" || null) {
    //   console.log("bio cannot be empty");
    //   const result = JSON.stringify({
    //     error: String("Bio:" + payload.data.bio),
    //   });
    //   await report(result);
    // }
    // user.username = payload.data.username;
    // user.bio = payload.data.bio;
    // user.profile_pic = payload.data.profile_pic;
    // const result = JSON.stringify(database);

    await notice(result);
  } else if (payload.method === "deleteProfile") {
    const userDBSearchResults = await search(userDB, {
      where: {
        address: data.metadata.msg_sender
      }
    });
    // Remove the user before inserting the user
    await remove(userDB, userDBSearchResults);

    const userDBResults = await search(userDB, {});
    const result = JSON.stringify(userDBResults);

    // const user = database.users.find(
    //   (item) => item.address == data.metadata.msg_sender
    // );
    // if (!user) {
    //   console.log("User address doesn't exist");
    //   const result = JSON.stringify({
    //     error: String("UserAddress:" + data.metadata.msg_sender),
    //   });
    //   await report(result);
    // }
    // const newDB = database.users.filter((item) => item.id !== payload.data.id);
    // database.users = newDB;
    // const result = JSON.stringify(database);
    await notice(result);
  } else if (payload.method === "repost") {
    const post = database.posts.find((item) => item.id == payload.data.id);
    if (!post) {
      console.log("post id is incorrect");
      const result = JSON.stringify({
        error: String("Post_Id:" + payload.data.id),
      });
      await report(result);
    }
    const user = database.users.find(
      (item) => item.address === data.metadata.msg_sender
    );
    if (!user) {
      console.log("User address doesn't exist");
      const result = JSON.stringify({
        error: String("UserAddress:" + data.metadata.msg_sender),
      });
      await report(result);
    }
    post.reposts.push(user.id);
    user.reposts.push(post.id);
    const result = JSON.stringify(database);
    await notice(result);
  } else if (payload.method === "createComment") {
    const postDBSearchResult = await search(postDB, {
      where: {
        id: payload.data.post_id
      }
    });
    if (postDBSearchResult.count < 1) {
      console.log("Post does not exist");
      const result = JSON.stringify({
        error: String("Post_Id:" + payload.data.id),
      });
      await report(result);
    }
    const postDBSearchResultObject = postDBSearchResult.hits.map((hit) => hit.document);

    await insert(commentDB, {
      address: data.metadata.msg_sender,
      username: payload.data.username,
      postId: payload.data.id,
      post: postDBSearchResultObject[0],
      message: payload.data.message,
      upload: [].push(payload.data.upload),
      uploadType: '',
      createdAt: new Date().toLocaleDateString()
    });

    const commentDBResults = await search(commentDB, {});
    const result = JSON.stringify(commentDBResults);

    // const comment = {
    //   id: 0,
    //   post_id: 0,
    //   username: "",
    //   content: {
    //     message: "",
    //     upload: "",
    //   },
    //   comments: [],
    //   likes: 0,
    //   reposts: [],
    //   date_commented: 0,
    // };

    // const post = database.posts.find((item) => item.id == payload.data.post_id);
    // if (!post) {
    //   console.log("post id is incorrect");
    //   const result = JSON.stringify({
    //     error: String("Post_Id:" + payload.data.id),
    //   });
    //   await report(result);
    // }
    // const user = database.users.find(
    //   (item) => item.address === data.metadata.msg_sender
    // );
    // if (!user) {
    //   console.log("User address doesn't exist");
    //   const result = JSON.stringify({
    //     error: String("UserAddress:" + data.metadata.msg_sender),
    //   });
    //   await report(result);
    // }
    // if (payload.data.message == "" || null) {
    //   console.log("message cannot be empty");
    //   const result = JSON.stringify({
    //     error: String("Message:" + payload.data.message),
    //   });
    //   await report(result);
    // }
    // comment.id = database.comments.length;
    // comment.post_id = payload.data.post_id;
    // comment.username = user.username;
    // comment.content = {
    //   message: payload.data.message,
    //   upload: payload.data.upload,
    // };
    // comment.date_posted = 0;
    // database.comments.push(comment);
    // database.trendingWords = new TrendingAlgorithm().alltrendingPosts();
    // user.comments.push(comment);
    // post.comments.push(comment);
    // const result = JSON.stringify(database);

    await notice(result);
  } else if (payload.method === "deleteComment") {
    const comment = database.comments.find(
      (item) => item.id == payload.data.id
    );
    if (!comment) {
      console.log("comment id is incorrect");
      const result = JSON.stringify({
        error: String("Comment_Id:" + payload.data.id),
      });
      await report(result);
    }
    const newDB = database.comments.filter(
      (item) => item.id !== payload.data.id
    );
    database.comments = newDB;
    const result = JSON.stringify(database);
    await notice(result);
  } else {
    console.log("Incorrect method");
    const result = JSON.stringify({
      error: String("Method does not exist: " + payload.method),
    });
    await report(result);
  }
};
module.exports = { Action };
