// File generated by 'npm run export'

import { TransetDefinition } from "./_types";

import transetAI from "./ai";
import transetAnim from "./anim";
import transetBoard from "./board";
import transetSetupBook from "./setups";
import transetGraphics from "./graphics";
import transetInstruction from "./instructions";
import transetMeta from "./meta";
import transetPerformance from "./performance";
import transetFlow from "./flow";
import transetScripts from "./scripts";
import transetGenerators from "./generators";

const transetDefinition: TransetDefinition = {
  AI: transetAI,
  anim: transetAnim,
  board: transetBoard,
  setups: transetSetupBook,
  graphics: transetGraphics,
  instructions: transetInstruction,
  generators: transetGenerators,
  meta: transetMeta,
  performance: transetPerformance,
  flow: transetFlow,
  scripts: transetScripts,
};

export default transetDefinition;

export * from "./_types";
