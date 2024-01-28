"use client";

import { Search } from "./Search";
import { Trending } from "./Trending";
import { usePathname } from "next/navigation";

export const RightComponent = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Display nothing if the page is not the profile, user or home page.
  if (segments[0] === "arcade") return null;
  if (segments[0] === "wallet") return null;
  if (segments[0] === "settings") return null;

  return (
    <section className="max-w-xs mx-auto">
      <Search />
      <section>
        <Trending></Trending>
      </section>
    </section>
  );
};
