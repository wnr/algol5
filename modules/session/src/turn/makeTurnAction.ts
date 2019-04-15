import { AlgolGame, AlgolTurn } from "../../../types";

/*
Execute a command or add a mark. Will update turn.currentStepId,
and add the new step if not already there
*/
export function makeTurnAction(
  game: AlgolGame,
  turn: AlgolTurn,
  action: string
) {
  const { steps, currentStepId } = turn;
  const currentStep = steps[currentStepId];
  const newStepId = currentStepId + "-" + action;
  if (!steps[newStepId]) {
    const func = currentStep.LINKS.actions[action];
    steps[newStepId] = game.action[func](currentStep, action);
  }
  return {
    ...turn,
    currentStepId: newStepId
  };
}
