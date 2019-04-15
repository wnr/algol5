import { AlgolStep } from "./";

type StepId = string;

export type AlgolTurn = {
  steps: { [stepId: string]: AlgolStep };
  canEnd?: boolean;
  viableStepIds: { [stepId: string]: true };
  gameEnds: {
    win: StepId[];
    lose: StepId[];
    draw: StepId[];
  };
  currentStepId: StepId;
  nextTurns: { [stepId: string]: AlgolTurn };
};
