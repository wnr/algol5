// File generated by 'npm run export'

import { FullDef } from '../../../types';
import { DaggersArtifactLayer, DaggersCommand, DaggersGenerator, DaggersLayer, DaggersMark, DaggersPhase, DaggersTerrain, DaggersUnit } from './_types';

import daggersAI from './ai';
import daggersBoard from './board';
import daggersSetup from './setup';
import daggersGraphics from './graphics';
import daggersInstruction from './instructions';
import daggersMeta from './meta';
import daggersFlow from './flow';
import daggersScripts from './scripts';
import daggersGenerators from './generators';

const daggersFullDef: FullDef<DaggersArtifactLayer, DaggersCommand, DaggersGenerator, DaggersLayer, DaggersMark, DaggersPhase, DaggersTerrain, DaggersUnit> = {
  AI: daggersAI,
  board: daggersBoard,
  setup: daggersSetup,
  graphics: daggersGraphics,
  instructions: daggersInstruction,
  generators: daggersGenerators,
  meta: daggersMeta,
  flow: daggersFlow,
  scripts: daggersScripts,
};

export default daggersFullDef;

export * from './_types';
