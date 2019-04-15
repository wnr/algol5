import { AlgolTurn, AlgolGame } from "../../../types";
import { tryToReachTurnEnd } from "./tryToReachTurnEnd";
import { newTurnFromRootStep } from "./newTurnFromRootStep";

// remove dead links in the step!
export function hydrateStepInTurn(
  game: AlgolGame,
  turn: AlgolTurn,
  stepId: string
): AlgolTurn {
  const step = turn.steps[stepId];
  const stepLinks = step.LINKS;
  if (stepLinks.endGame) {
    turn.canEnd = true;
    turn.gameEnds[stepLinks.endGame].push(stepId);
    turn.viableStepIds[stepId] = true;
  }
  if (stepLinks.endTurn) {
    const newTurn = tryToReachTurnEnd(
      game,
      newTurnFromRootStep(game.action[stepLinks.endTurn](step))
    );
    turn.canEnd = true;
    turn.viableStepIds[stepId] = true;
    if (newTurn.canEnd) {
      turn.nextTurns[stepId] = newTurn;
    } else {
      delete stepLinks.endTurn;
      stepLinks.endGame = "win";
      stepLinks.endedBy = "starvation";
      turn.gameEnds.win.push(stepId);
    }
  }
  const actionsToCheck = Object.keys(stepLinks.actions);
  while (actionsToCheck.length) {
    const action = actionsToCheck.shift();
    const nextStepId = stepId + "-" + action;
    if (!turn.steps[nextStepId]) {
      const func = stepLinks.actions[action];
      turn.steps[nextStepId] = game.action[func](step, action);
    }
    turn = hydrateStepInTurn(game, turn, nextStepId);
    if (turn.viableStepIds[nextStepId]) {
      turn.canEnd = true;
      turn.viableStepIds[stepId] = true;
    } else {
      delete stepLinks.actions[action];
      delete turn.steps[nextStepId];
    }
  }
  return turn;
}