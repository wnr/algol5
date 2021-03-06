// File generated by 'npm run export'

import { MurusgallicusDefinition } from "./_types";

import murusgallicusAI from "./ai";
import murusgallicusAnim from "./anim";
import murusgallicusBoardBook from "./boards";
import murusgallicusSetupBook from "./setups";
import murusgallicusGraphics from "./graphics";
import murusgallicusInstruction from "./instructions";
import murusgallicusMeta from "./meta";
import murusgallicusPerformance from "./performance";
import murusgallicusFlow from "./flow";
import murusgallicusScripts from "./scripts";
import murusgallicusGenerators from "./generators";
import murusgallicusVariantsBook from "./variants";

const murusgallicusDefinition: MurusgallicusDefinition = {
  AI: murusgallicusAI,
  anim: murusgallicusAnim,
  boards: murusgallicusBoardBook,
  setups: murusgallicusSetupBook,
  graphics: murusgallicusGraphics,
  instructions: murusgallicusInstruction,
  generators: murusgallicusGenerators,
  meta: murusgallicusMeta,
  performance: murusgallicusPerformance,
  flow: murusgallicusFlow,
  scripts: murusgallicusScripts,
  variants: murusgallicusVariantsBook,
};

export default murusgallicusDefinition;

export * from "./_types";
