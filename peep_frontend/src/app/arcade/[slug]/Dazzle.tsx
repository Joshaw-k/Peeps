import {
  ArcadeHeroContainer,
  ArcadeHeroContent,
  ArcadeHeroContentContainer,
  ArcadeHeroImage,
} from "./page";

const gameData = {
  name: "Dazzle",
  slug: "planet-diplomats",
  description: "",
  shortDescription:
    "Find the best diplomats in this planet and others. Trying to solve problems you can't even think of.",
  image: "https://rolluplab.io/projects/dazzle/xnk08D3d_400x400.png",
  category: "adventure, casual",
  minAge: 0,
  popularityStatus: "low",
};

export const Dazzle = () => {
  return (
    <ArcadeHeroContainer>
      <ArcadeHeroContentContainer>
        <ArcadeHeroContent
          header={gameData.name}
          description={gameData.description || gameData.shortDescription}
        >
          <button className="btn btn-primary rounded-box">Play Now</button>
        </ArcadeHeroContent>
        <ArcadeHeroImage src={gameData.image} />
      </ArcadeHeroContentContainer>
    </ArcadeHeroContainer>
  );
};
