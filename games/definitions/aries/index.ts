// File generated by 'npm run export'

import { FullDef } from '../../types';
import { AriesArtifactLayer, AriesCommand, AriesGenerator, AriesLayer, AriesMark, AriesPhase, AriesTerrain, AriesUnit } from './_types';

import ariesAI from './ai';
import ariesBoard from './board';
import ariesSetup from './setup';
import ariesGraphics from './graphics';
import ariesInstruction from './instructions';
import ariesMeta from './meta';
import ariesFlow from './flow';
import ariesScripts from './scripts';
import ariesGenerators from './generators';

const ariesFullDef: FullDef<AriesArtifactLayer, AriesCommand, AriesGenerator, AriesLayer, AriesMark, AriesPhase, AriesTerrain, AriesUnit> = {
  AI: ariesAI,
  board: ariesBoard,
  setup: ariesSetup,
  graphics: ariesGraphics,
  instructions: ariesInstruction,
  generators: ariesGenerators,
  meta: ariesMeta,
  flow: ariesFlow,
  scripts: ariesScripts,
};

export default ariesFullDef;

export * from './_types';
