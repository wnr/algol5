import { FullDefAnon } from "../../../../../types";
import { emptyUnitLayers } from "../../../../../common";
import {
  referencesBattleVars,
  referencesTurnVars,
  usesSpawn,
  orderUsage
} from "../sectionUtils";

export function executeStartEnd(
  gameDef: FullDefAnon,
  player: 1 | 2,
  action: string
): string {
  const startDef = gameDef.flow.startTurn;
  const unitLayerNames = Object.keys(emptyUnitLayers(gameDef));

  const usage = orderUsage(gameDef, player, action);

  return `
  ${!usage.UNITLAYERS ? "const oldUnitLayers = step.UNITLAYERS; " : ""}
  return {
    UNITDATA: step.UNITDATA,
    LINKS,
    name: "start",
    path: [],
    ${
      !usage.UNITLAYERS
        ? `UNITLAYERS: { 
        ${unitLayerNames
          .map(
            name =>
              name +
              ": oldUnitLayers." +
              (name.match(/^my/)
                ? "opp" + name.slice(2)
                : name.match(/^opp/)
                ? "my" + name.slice(3)
                : name)
          )
          .join(",\n")}
       },`
        : "UNITLAYERS,"
    }
    ${usage.ARTIFACTS ? "ARTIFACTS, " : "ARTIFACTS: emptyArtifactLayers, "}
    ${usage.MARKS ? "MARKS," : "MARKS: {},"}
    ${usage.TURN ? "TURN, " : "TURN: step.TURN + 1,"}
    ${usesSpawn(gameDef) ? "NEXTSPAWNID: step.NEXTSPAWNID, " : ""}
    ${
      referencesTurnVars(gameDef)
        ? usage.TURNVARS
          ? "TURNVARS, "
          : "TURNVARS: {}, "
        : ""
    }
    ${
      referencesBattleVars(gameDef)
        ? usage.BATTLEVARS
          ? "BATTLEVARS, "
          : "BATTLEVARS: step.BATTLEVARS, "
        : ""
    }
  };
  `;
}