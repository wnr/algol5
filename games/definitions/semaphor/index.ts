// File generated by 'npm run export'

import { FullDef } from '../../../types';
import { SemaphorArtifactLayer, SemaphorCommand, SemaphorGenerator, SemaphorLayer, SemaphorMark, SemaphorPhase, SemaphorTerrain, SemaphorUnit } from './_types';

import semaphorAI from './ai';
import semaphorBoard from './board';
import semaphorSetup from './setup';
import semaphorGraphics from './graphics';
import semaphorInstruction from './instructions';
import semaphorMeta from './meta';
import semaphorFlow from './flow';
import semaphorScripts from './scripts';
import semaphorGenerators from './generators';

const semaphorFullDef: FullDef<SemaphorArtifactLayer, SemaphorCommand, SemaphorGenerator, SemaphorLayer, SemaphorMark, SemaphorPhase, SemaphorTerrain, SemaphorUnit> = {
  AI: semaphorAI,
  board: semaphorBoard,
  setup: semaphorSetup,
  graphics: semaphorGraphics,
  instructions: semaphorInstruction,
  generators: semaphorGenerators,
  meta: semaphorMeta,
  flow: semaphorFlow,
  scripts: semaphorScripts,
};

export default semaphorFullDef;

export * from './_types';