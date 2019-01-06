// File generated by 'npm run export'

import { FullDef } from '../../../types';
import { ThreemusketeersArtifactLayer, ThreemusketeersCommand, ThreemusketeersGenerator, ThreemusketeersLayer, ThreemusketeersMark, ThreemusketeersPhase, ThreemusketeersTerrain, ThreemusketeersUnit } from './_types';

import threemusketeersAI from './ai';
import threemusketeersBoard from './board';
import threemusketeersSetup from './setup';
import threemusketeersGraphics from './graphics';
import threemusketeersInstruction from './instructions';
import threemusketeersMeta from './meta';
import threemusketeersFlow from './flow';
import threemusketeersScripts from './scripts';
import threemusketeersGenerators from './generators';

const threemusketeersFullDef: FullDef<ThreemusketeersArtifactLayer, ThreemusketeersCommand, ThreemusketeersGenerator, ThreemusketeersLayer, ThreemusketeersMark, ThreemusketeersPhase, ThreemusketeersTerrain, ThreemusketeersUnit> = {
  AI: threemusketeersAI,
  board: threemusketeersBoard,
  setup: threemusketeersSetup,
  graphics: threemusketeersGraphics,
  instructions: threemusketeersInstruction,
  generators: threemusketeersGenerators,
  meta: threemusketeersMeta,
  flow: threemusketeersFlow,
  scripts: threemusketeersScripts,
};

export default threemusketeersFullDef;

export * from './_types';
