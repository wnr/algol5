import { AlgolBattle, AlgolUndo } from "../../../../types";

export function battleUndo(battle: AlgolBattle): AlgolBattle {
  return {
    ...battle,
    state: (battle.state.undo as AlgolUndo).state
  };
}
