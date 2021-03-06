// File generated by 'npm run export'

import { EuclidDefinition } from "./_types";

import euclidAI from "./ai";
import euclidAnim from "./anim";
import euclidBoardBook from "./boards";
import euclidSetupBook from "./setups";
import euclidGraphics from "./graphics";
import euclidInstruction from "./instructions";
import euclidMeta from "./meta";
import euclidPerformance from "./performance";
import euclidFlow from "./flow";
import euclidScripts from "./scripts";
import euclidGenerators from "./generators";
import euclidVariants from "./variants";

const euclidDefinition: EuclidDefinition = {
  AI: euclidAI,
  anim: euclidAnim,
  boards: euclidBoardBook,
  setups: euclidSetupBook,
  graphics: euclidGraphics,
  instructions: euclidInstruction,
  generators: euclidGenerators,
  meta: euclidMeta,
  performance: euclidPerformance,
  flow: euclidFlow,
  scripts: euclidScripts,
  variants: euclidVariants
};

export default euclidDefinition;

export * from "./_types";
