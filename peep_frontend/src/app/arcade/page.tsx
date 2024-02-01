import Image from "next/image";
import Link from "next/link";

const arcadeData = [
  {
    name: "Monster Hunting",
    slug: "monster-hunting",
    description: "",
    shortDescription: "All about monster hunting. Action packed",
    image: "",
    category: "action, adventure",
    minAge: 12,
    popularityStatus: "low",
  },
  {
    name: "Spin wheel",
    slug: "spin-wheel",
    description:
      "You know about the spin wheel. But this one is different. This wheel is a community wheel. There are default prizes on the wheel but these prizes changes with time as well. Interestingly, the community can decide what goes on the wheel. We limit the number of people that can spin this wheel globally using a computation on the social media network. The lower the traffic, the higher the number of spins and the higher the traffic, the lower the number of spins.",
    shortDescription:
      "A spin wheel for the web3 community. You can win amazing prices on this wheel for real. Real usdt, and other tokes can be won here. Even prizes set by the web3 community probably for a giveaway, etc. An algorithm computes what you win and how you win. You can spin once or multiple times, depending on the traffic on the platform.",
    image:
      "https://raw.githubusercontent.com/MayowaObisesan/ForImages/main/Screenshot%202024-01-31%20at%2020-47-56%20Screenshot.png",
    category: "arcade, casual",
    minAge: 0,
    popularityStatus: "high",
  },
  {
    name: "Arcade wars",
    slug: "arcade-wars",
    description: "",
    shortDescription: "All arcade games in one place",
    image: "",
    category: "adventure, casual",
    minAge: 0,
    popularityStatus: "low",
  },
  {
    name: "Planet diplomats",
    slug: "planet-diplomats",
    description: "",
    shortDescription:
      "Find the best diplomats in this planet and others. Trying to solve problems you can't even think of.",
    image: "",
    category: "adventure, casual",
    minAge: 0,
    popularityStatus: "low",
  },
  {
    name: "Temple run",
    slug: "temple-run",
    description:
      "The classic but on chain and with a twist. Play the same game you love and played on multiple devices finally on-chain. Cartesi makes it possible to run games like temple run on chain.",
    shortDescription:
      "The classic but on chain and with a twist. Play the same game you love and played on multiple devices finally on-chain.",
    image: "",
    category: "adventure, casual",
    minAge: 0,
    popularityStatus: "low",
  },
];

const Arcade = () => {
  return (
    <section>
      <section className="rounded-[40px]">
        <div className="hero min-h-[360px]">
          <div className="hero-content text-center">
            {/* <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div> */}
            <div className="prose text-primary-content max-w-full">
              <header className={"font-extrabold text-4xl leading-normal"}>
                Welcome to the
                <div className="font-bold text-9xl bg-clip-text bg-gradient-to-tl from-blue-600 to-violet-600 text-transparent">
                  Arcade
                </div>
              </header>
            </div>
          </div>
        </div>

        <div className="text-base text-center dark:text-white text-balance mx-auto pb-16 w-[80%]">
          The arcade is the first onchain game and social media platform in one
          place.
          <br />
          <br />
          Quickly juggle between the latest content and games that you can play
          from anywhere in the world.
        </div>
      </section>

      <section className="mt-8">
        <header className="py-8 font-semibold">
          Games currently available
        </header>
        <section className={"grid grid-cols-3 gap-2"}>
          {arcadeData.map((eachGame) => (
            <Link
              href={`/arcade/${eachGame.slug}`}
              className={"card bg-base-200"}
            >
              <div className="flex flex-col p-4">
                {eachGame.popularityStatus === "high" && (
                  <div className="absolute top-4 right-4 badge badge-lg text-xs text-white font-semibold badge-error bg-red-600 shadow-error shadow-lg">
                    hot
                  </div>
                )}
                <div
                  className={
                    "card-content flex flex-row justify-center items-center h-[320px] bg-base-300 text-gray-400 rounded-xl"
                  }
                >
                  <Image
                    className="outline-0"
                    src={eachGame.image}
                    alt=""
                    width={320}
                    height={320}
                  />
                  {/* <img src={eachGame.image} alt="" /> */}
                  {/* {eachGame.name} */}
                </div>
                <div className="card-title font-semibold px-2 py-4">
                  {eachGame.name}
                </div>
                <div className="card-title font-semibold px-2 py-2">
                  {eachGame.category.split(",").map((eachCategory) => (
                    <span
                      className={
                        "px-4 py-2 bg-zinc-300 dark:bg-base-300 text-xs rounded-xl"
                      }
                    >
                      {eachCategory}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </section>
      </section>
    </section>
  );
};

export default Arcade;
