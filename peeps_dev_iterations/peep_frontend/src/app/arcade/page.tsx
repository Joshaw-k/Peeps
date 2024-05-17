"use client";

// import { ArcadeWars } from "./arcadeWars";
// import { SpinWheel } from "./spinWheels/page";
// import { SpinWheel } from "./spinWheels/page";

export default function Page({ params }: { params: { slug: string } }) {
  // if (params.slug === "spin-wheel") {
  //   // return <SpinWheel />;
  // } else if (params.slug === "arcade-wars") {
  //   // return <ArcadeWars />;
  // }

  return <div>Nested page: {params.slug}</div>;
}
