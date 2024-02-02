"use client";

import Image from "next/image";
import { ArcadeWars } from "./arcadeWars";
import { SpinWheel } from "./spinWheels/page";
import { ArenaMayhem } from "./ArenaMayhem";
import { Dazzle } from "./Dazzle";
// import { SpinWheel } from "./spinWheels/page";

export const ArcadeHeroImage = ({ src }: { src: any }) => {
  return (
    <Image
      alt={""}
      src={src}
      className="flex-grow-0 max-w-xs h-[320px] rounded-box object-cover"
      width={640}
      height={320}
    />
  );
};

export const ArcadeHeroContentContainer = ({ children }: any) => {
  return (
    <div className="hero-content w-full flex-col lg:flex-row lg:justify-start">
      {children}
    </div>
  );
};

export const ArcadeHeroContent = ({ header, description, children }: any) => {
  return (
    <div className="flex-1 w-full px-4">
      <h1 className="text-6xl text-balance font-bold">{header}</h1>
      <p className="py-6">{description}</p>
      {children}
    </div>
  );
};

export const ArcadeHeroContainer = ({ children }: any) => {
  return (
    <div className="hero flex flex-col place-items-center justify-center min-h-[400px]">
      {children}
    </div>
  );
};

export default function Page({ params }: { params: { slug: string } }) {
  if (params.slug === "spin-wheel") {
    return <SpinWheel />;
  } else if (params.slug === "arcade-wars") {
    return <ArcadeWars />;
  } else if (params.slug === "arena-mayhem") {
    return <ArenaMayhem />;
  } else if (params.slug === "planet-diplomats") {
    return <Dazzle />;
  }

  return (
    <ArcadeHeroContainer>
      <ArcadeHeroContentContainer>
        <ArcadeHeroImage src={""} />
        <ArcadeHeroContent description={""}>
          Nested page: {params.slug}
        </ArcadeHeroContent>
      </ArcadeHeroContentContainer>
    </ArcadeHeroContainer>
  );
}
