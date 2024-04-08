import React from "react";

type avatarProps = {
  src: string;
};

export const AvatarProfile = React.forwardRef((props: avatarProps, ref) => {
  return (
    <div className="avatar">
      <div className="w-32 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-2">
        <img alt="" src={props.src} className="bg-base-300" />
      </div>
    </div>
  );
});
