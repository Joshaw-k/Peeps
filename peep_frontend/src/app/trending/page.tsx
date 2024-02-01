"use client";

import {
  PostActions,
  PostBody,
  PostContainer,
  PostUser,
} from "../components/Posts";
import { usePeepsContext } from "../context";

const TrendingPosts = () => {
  const { notices, wallet } = usePeepsContext();

  if (!notices) return <div>Cannot fetch trends...</div>;
  if (notices?.length < 1) return <p>Cannot fetch trending posts</p>;

  return (
    <section>
      <div className={"prose text-4xl font-bold text-gray-400 px-2 py-6 mt-8"}>
        Trending Posts
      </div>
      {/* {console.log(currentAddress)}
          {console.log(JSON.parse(notices.reverse()[0].payload).posts)}
          {console.log(
            JSON.parse(notices.reverse()[0].payload).posts.filter(
              (it: any) => it.address === currentAddress
            )
          )} */}
      {notices.length > 0 &&
        JSON.parse(notices?.reverse()[0].payload).trending_posts?.map(
          (eachNotice: any) => (
            // .filter((it: any) => it.address === baseDappAddress)
            // .filter((it) => JSON.parse(it.payload).posts.length > 0)
            <>
              <PostContainer key={eachNotice}>
                {/* {console.log(eachNotice)} */}
                {console.log(wallet?.accounts[0])}
                <PostUser {...eachNotice} />
                <PostBody>{eachNotice?.content?.message}</PostBody>
                <PostActions
                  postId={eachNotice.id}
                  message={eachNotice?.content.message}
                  upload={""}
                  postData={eachNotice}
                />
              </PostContainer>
              {/* <div className="divider"></div> */}
            </>
          )
        )}
    </section>
  );
};

export default TrendingPosts;
