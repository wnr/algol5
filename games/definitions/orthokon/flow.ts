import {Flow} from '../../../types';
import { OrthokonArtifactLayer, OrthokonCommand, OrthokonGenerator, OrthokonLayer, OrthokonMark, OrthokonUnit } from './_types';

const orthokonFlow: Flow<OrthokonArtifactLayer, OrthokonCommand, OrthokonGenerator, OrthokonLayer, OrthokonMark, OrthokonUnit> = {
  startTurn: {
    link: "selectunit"
  },
  marks: {
    selectunit: {
      from: "myunits",
      runGenerator: "findmovetargets",
      link: "selectmovetarget"
    },
    selectmovetarget: {
      from: "movetargets",
      runGenerator: "findvictims",
      link: "move"
    }
  },
  commands: {
    move: {
      applyEffects: [
        ["moveat", "selectunit", "selectmovetarget"],
        ["setin", "victims", "owner", ["currentplayer"]]
      ],
      link: "endturn"
    }
  }
};

export default orthokonFlow;
