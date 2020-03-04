import { GameId } from "./_names";
import gameDefs from "../../../games/dist/lib";
import fs from "fs-extra";
import path from "path";

const out = path.join(__dirname, "../../dist/apis");

export async function exportGameAPI(gameId: GameId) {
  const def = gameDefs[gameId];
  if (!def) {
    throw new Error(`Failed to find game ${gameId}`);
  }
  const setupBook = JSON.stringify(def.setups, null, 2);
  const boardBook = JSON.stringify(def.boards, null, 2);
  await fs.ensureDir(out);
  const me = path.join(out, gameId);
  await fs.emptyDir(me);
  await fs.writeFile(
    path.join(me, "static.ts"),
    `// Generated by "npm run exportGameAPIs"
import ${gameId} from "../../../../logic/dist/indiv/${gameId}";
import { makeStaticGameAPI } from "../../../src";

export const staticAPI = makeStaticGameAPI(${gameId}, ${setupBook}, ${boardBook});
export default staticAPI;
`
  );
  await fs.writeFile(
    path.join(me, "stateful.ts"),
    `// Generated by "npm run exportGameAPIs"
import ${gameId} from "../../../../logic/dist/indiv/${gameId}";
import { makeStatefulGameAPI } from "../../../src";

export const statefulAPI = makeStatefulGameAPI(${gameId}, ${setupBook}, ${boardBook});
export default statefulAPI;
`
  );
  console.log("Exporting api:s for", gameId);
}
