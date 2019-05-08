import { AlgolEffectActionDefAnon, FullDefAnon } from "../../types";
import { expressionPossibilities } from "..";

export function actionGenerators(
  gameDef: FullDefAnon,
  player: 1 | 2,
  action: string
): string[] {
  const def: AlgolEffectActionDefAnon =
    gameDef.flow.commands[action] ||
    gameDef.flow.marks[action] ||
    (action === "startTurn" && gameDef.flow.startTurn) ||
    {}; // To allow tests to reference non-existing things

  return (def.runGenerators || [])
    .concat(def.runGenerator || [])
    .reduce(
      (mem, genName) =>
        mem.concat(expressionPossibilities(genName, player, action)),
      []
    );
}
