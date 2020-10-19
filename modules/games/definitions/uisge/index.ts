// File generated by 'npm run export'

import { UisgeDefinition } from "./_types";

import uisgeAI from "./ai";
import uisgeAnim from "./anim";
import uisgeBoardBook from "./boards";
import uisgeSetupBook from "./setups";
import uisgeGraphics from "./graphics";
import uisgeInstruction from "./instructions";
import uisgeMeta from "./meta";
import uisgePerformance from "./performance";
import uisgeFlow from "./flow";
import uisgeScripts from "./scripts";
import uisgeGenerators from "./generators";
import uisgeVariants from "./variants";

const uisgeDefinition: UisgeDefinition = {
  AI: uisgeAI,
  anim: uisgeAnim,
  boards: uisgeBoardBook,
  setups: uisgeSetupBook,
  graphics: uisgeGraphics,
  instructions: uisgeInstruction,
  generators: uisgeGenerators,
  meta: uisgeMeta,
  performance: uisgePerformance,
  flow: uisgeFlow,
  scripts: uisgeScripts,
  variants: uisgeVariants
};

export default uisgeDefinition;

export * from "./_types";