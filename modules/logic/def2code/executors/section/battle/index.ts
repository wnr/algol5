import { FullDefAnon } from "../../../../../types";
import { updateUnitLayers } from "../../order/updateUnitLayers";
import { usesSpawn, referencesBattleVars } from "../sectionUtils";

export function executeNewBattle(
  gameDef: FullDefAnon,
  player: 1 | 2,
  action: string,
  ruleset: string
): string {
  let ret = "";
  ret += `let UNITDATA = setup2army(setup);
    ${updateUnitLayers(gameDef, 2, "newBattle", true)}`;

  return (
    ret +
    `return game.action[\`startTurn_\${ruleset}_1\`]({
    ${usesSpawn(gameDef) ? "NEXTSPAWNID: 1," : ""}
    ${
      referencesBattleVars(gameDef) ? "BATTLEVARS: {}, " : ""
    } TURN: 0, UNITDATA, UNITLAYERS
  });`
  );
}
