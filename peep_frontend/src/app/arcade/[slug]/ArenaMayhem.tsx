import {
  ArcadeHeroContainer,
  ArcadeHeroContent,
  ArcadeHeroContentContainer,
  ArcadeHeroImage,
} from "./page";

const gameData = {
  name: "Arena mayhem",
  slug: "arena-mayhem",
  description: "",
  shortDescription: "All about monster hunting. Action packed",
  image: "https://rolluplab.io/projects/arena-mayhem/a2c864869023-The_Team.png",
  category: "action, adventure",
  minAge: 12,
  popularityStatus: "low",
};

export const ArenaMayhem = () => {
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
