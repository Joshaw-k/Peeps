"use client";

import { Post } from "../components/Posts";

const Profile = () => {
  return (
    <section>
      <div className={"prose text-4xl font-bold text-gray-400 px-2 py-6 mt-8"}>
        Your Profile
      </div>
      <Post></Post>
    </section>
  );
};

export default Profile;
