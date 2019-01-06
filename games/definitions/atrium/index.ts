// File generated by 'npm run export'

import { FullDef } from '../../../types';
import { AtriumArtifactLayer, AtriumCommand, AtriumGenerator, AtriumLayer, AtriumMark, AtriumPhase, AtriumTerrain, AtriumUnit } from './_types';

import atriumAI from './ai';
import atriumBoard from './board';
import atriumSetup from './setup';
import atriumGraphics from './graphics';
import atriumInstruction from './instructions';
import atriumMeta from './meta';
import atriumFlow from './flow';
import atriumScripts from './scripts';
import atriumGenerators from './generators';

const atriumFullDef: FullDef<AtriumArtifactLayer, AtriumCommand, AtriumGenerator, AtriumLayer, AtriumMark, AtriumPhase, AtriumTerrain, AtriumUnit> = {
  AI: atriumAI,
  board: atriumBoard,
  setup: atriumSetup,
  graphics: atriumGraphics,
  instructions: atriumInstruction,
  generators: atriumGenerators,
  meta: atriumMeta,
  flow: atriumFlow,
  scripts: atriumScripts,
};

export default atriumFullDef;

export * from './_types';