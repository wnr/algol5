// File generated by 'npm run export'

import { ShoveoffDefinition } from "./_types";

import shoveoffAI from "./ai";
import shoveoffAnim from "./anim";
import shoveoffBoardBook from "./boards";
import shoveoffSetupBook from "./setups";
import shoveoffGraphics from "./graphics";
import shoveoffInstruction from "./instructions";
import shoveoffMeta from "./meta";
import shoveoffPerformance from "./performance";
import shoveoffFlow from "./flow";
import shoveoffScripts from "./scripts";
import shoveoffGenerators from "./generators";

const shoveoffDefinition: ShoveoffDefinition = {
  AI: shoveoffAI,
  anim: shoveoffAnim,
  boards: shoveoffBoardBook,
  setups: shoveoffSetupBook,
  graphics: shoveoffGraphics,
  instructions: shoveoffInstruction,
  generators: shoveoffGenerators,
  meta: shoveoffMeta,
  performance: shoveoffPerformance,
  flow: shoveoffFlow,
  scripts: shoveoffScripts,
};

export default shoveoffDefinition;

export * from "./_types";
