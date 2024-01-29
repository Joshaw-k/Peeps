import React from "react";

export const AvatarProfile = React.forwardRef((props, ref) => {
  return (
    <div className="avatar">
      <div className="w-32 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-2">
        <img alt="" src={props.src} className="bg-base-300" ref={ref} />
      </div>
    </div>
  );
});
