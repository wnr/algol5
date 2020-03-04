// File generated by 'npm run export'

import { AtriumDefinition } from "./_types";

import atriumAI from "./ai";
import atriumAnim from "./anim";
import atriumBoardBook from "./boards";
import atriumSetupBook from "./setups";
import atriumGraphics from "./graphics";
import atriumInstruction from "./instructions";
import atriumMeta from "./meta";
import atriumPerformance from "./performance";
import atriumFlow from "./flow";
import atriumScripts from "./scripts";
import atriumGenerators from "./generators";

const atriumDefinition: AtriumDefinition = {
  AI: atriumAI,
  anim: atriumAnim,
  boards: atriumBoardBook,
  setups: atriumSetupBook,
  graphics: atriumGraphics,
  instructions: atriumInstruction,
  generators: atriumGenerators,
  meta: atriumMeta,
  performance: atriumPerformance,
  flow: atriumFlow,
  scripts: atriumScripts,
};

export default atriumDefinition;

export * from "./_types";
