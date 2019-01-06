import {Flow} from '../../../types';
import { ThreemusketeersArtifactLayer, ThreemusketeersCommand, ThreemusketeersGenerator, ThreemusketeersLayer, ThreemusketeersMark, ThreemusketeersUnit } from './_types';

const threemusketeersFlow: Flow<ThreemusketeersArtifactLayer, ThreemusketeersCommand, ThreemusketeersGenerator, ThreemusketeersLayer, ThreemusketeersMark, ThreemusketeersUnit> = {
  startTurn: {
    link: "selectunit"
  },
  endGame: {
    musketeersinline: {
      condition: ["notempty", "musketeerline"],
      who: 2,
      show: "kings"
    },
    strandedmusketeers: {
      condition: ["same", ["sizeof", "strandedmusketeers"], 3],
      who: 1
    }
  },
  marks: {
    selectunit: {
      from: "myunits",
      runGenerator: "findmovetargets",
      link: "selectmovetarget"
    },
    selectmovetarget: {
      from: "movetargets",
      link: "move"
    }
  },
  commands: {
    move: {
      applyEffect: ["stompat", "selectunit", "selectmovetarget"],
      runGenerators: ["findmusketeerline", ["ifplayer", 2, "findstrandedmusketeers"]],
      link: "endturn"
    }
  }
};

export default threemusketeersFlow;
