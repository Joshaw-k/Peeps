"use client";

import toast from "react-hot-toast";

interface IToast {
  t: any;
  icon?: any;
  title?: string;
  message: string;
  children?: any;
}

export const CustomToastUI = ({
  t,
  icon,
  title,
  message,
  children,
}: IToast) => {
  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white dark:bg-base-300 shadow-lg rounded-box pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-center py-2">
          {icon && (
            <div className="flex-shrink-0 pt-0.5">
              <div className="h-10 w-10 rounded-full">
                {/* <img
                className="h-full w-full rounded-full"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                alt=""
              /> */}
                {icon}
              </div>
            </div>
          )}
          <div className="ml-3 flex-1">
            {title && (
              <header className="text-sm font-medium text-gray-900">
                {title}
              </header>
            )}
            <div className="mt-1 text-sm text-gray-500">
              {message}
              {children}
            </div>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200 dark:border-base-100">
        <button
          type={"button"}
          title={"close toast button"}
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};
