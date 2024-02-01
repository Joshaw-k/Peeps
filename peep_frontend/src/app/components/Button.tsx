"use client";

interface IButton {
  type?: string | "button";
  classes?: string;
  children?: any;
  props?: any;
}

export const Button = ({ type, classes, children }: IButton) => {
  return <button>{children}</button>;
};

export const ButtonLoader = () => {
  return <span className="loading loading-spinner loading-md"></span>;
};
