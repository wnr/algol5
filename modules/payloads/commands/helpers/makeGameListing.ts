import prettier from "prettier";
import fs from "fs-extra";
import path from "path";
import { GameId } from "../../../games/dist/list";
import meta from "../../../games/dist/meta";
import gameCompositeMap from "../../../payloads/dist/composites/games/games";
import { AlgolListing } from "../../../types";
import { gameSlug } from "../../../common/utils";

const outFolder = path.join(__dirname, "../../dist/listings/games");

export const makeGameListing = (gameId: GameId) => {
  const composite = gameCompositeMap[`${gameId}_small.png`];
  const listing: AlgolListing = {
    blurb: meta[gameId].tagline,
    preloads: [],
    url: `/games/${gameSlug(meta[gameId])}`,
    title: meta[gameId].name,
    hidden: meta[gameId].hidden,
    sort: meta[gameId].name,
    composite,
  };
  const code = `// generated by makeGameListing
import { AlgolListing } from '../../../../types'

export const ${gameId}: AlgolListing = ${JSON.stringify(listing)};

export default ${gameId}
`;
  fs.ensureDirSync(outFolder);
  fs.writeFileSync(
    path.join(outFolder, `${gameId}.ts`),
    prettier.format(code, { filepath: "foo.ts" })
  );
  console.log("Made listing for game", gameId);
};
