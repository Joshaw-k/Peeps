"use client";

import { useRef, useState } from "react";

const PostForm = () => {
  const postTextField = useRef(null);
  const [postText, setPostText] = useState<string>("");

  return (
    <div className="bg-base-200 rounded-box focus-within:ring-2 focus-within:ring-primary">
      <textarea
        placeholder="Write something"
        className="textarea textarea-lg border-0 w-full resize-none bg-transparent focus:outline-0"
        ref={postTextField}
        onChange={(e) => setPostText(e.target.value)}
      ></textarea>
      <div className="flex flex-row px-2 py-2">
        <span className="flex-1"></span>
        <button
          title="Submit post"
          type="submit"
          disabled={postText.length < 1}
          className="flex-grow-0 btn btn-sm btn-primary rounded-xl disabled:btn-disabled"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default PostForm;
