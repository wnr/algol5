import {Generators} from '../../../types';
import { KriegArtifactLayer, KriegGenerator, KriegLayer } from './_types';

const kriegGenerators: Generators<KriegArtifactLayer, KriegGenerator, KriegLayer> = {
  findmovetargets: {
    type: "neighbour",
    start: "selectunit",
    unlessover: "units",
    dirs: ["ifelse", ["anyat", "southeast", ["start"]],
      [1, 3, 4, 5, 7],
      ["ifelse", ["anyat", "northwest", ["start"]],
        [1, 3, 5, 7, 8],
        [1, 3, 5, 7]
      ]
    ],
    draw: {
      neighbours: {
        tolayer: "movetargets"
      }
    }
  }
};

export default kriegGenerators;
