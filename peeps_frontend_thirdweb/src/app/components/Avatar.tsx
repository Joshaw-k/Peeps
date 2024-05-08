import React from "react";

type avatarProps = {
    src: string;
};

export const AvatarProfile = React.forwardRef((props: avatarProps, ref: React.ForwardedRef<any>) => {
    return (
        <div className="avatar">
            <div className="w-24 lg:w-32 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-2">
                <img alt="" src={props.src} className="bg-base-300" ref={ref}/>
            </div>
        </div>
    );
});
AvatarProfile.displayName = "AvatarProfile";

export const AvatarProfileSmall = React.forwardRef((props: avatarProps, ref: React.ForwardedRef<any>) => {
  return (
    <div className="avatar placeholder">
      <div className="w-6 bg-base-300 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-2">
          {
              props.src !== ""
                  ? <img alt="" src={props.src} className="bg-base-300" ref={ref}/>
                  : <span className="text-xs"></span>
          }
      </div>
    </div>
  );
});
AvatarProfileSmall.displayName = "AvatarProfileSmall";