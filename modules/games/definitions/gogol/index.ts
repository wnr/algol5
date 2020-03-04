// File generated by 'npm run export'

import { GogolDefinition } from "./_types";

import gogolAI from "./ai";
import gogolAnim from "./anim";
import gogolBoardBook from "./boards";
import gogolSetupBook from "./setups";
import gogolGraphics from "./graphics";
import gogolInstruction from "./instructions";
import gogolMeta from "./meta";
import gogolPerformance from "./performance";
import gogolFlow from "./flow";
import gogolScripts from "./scripts";
import gogolGenerators from "./generators";

const gogolDefinition: GogolDefinition = {
  AI: gogolAI,
  anim: gogolAnim,
  boards: gogolBoardBook,
  setups: gogolSetupBook,
  graphics: gogolGraphics,
  instructions: gogolInstruction,
  generators: gogolGenerators,
  meta: gogolMeta,
  performance: gogolPerformance,
  flow: gogolFlow,
  scripts: gogolScripts,
};

export default gogolDefinition;

export * from "./_types";
