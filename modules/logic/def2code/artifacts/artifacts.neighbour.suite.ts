import { executeGenerator } from "./";
import { emptyFullDef, truthy, falsy } from "../../../common";
import { NeighbourDefAnon, TestSuite } from "../../../types";

export const testSuite: TestSuite<NeighbourDefAnon> = {
  title: "Artifacts - Neighbours",
  func: executeGenerator,
  defs: [
    {
      def: {
        ...emptyFullDef,
        board: {
          ...emptyFullDef.board,
          height: 3,
          width: 3
        }
      },
      player: 1,
      action: "someaction",
      contexts: [
        {
          context: {
            MARKS: { mymark: "a1", myothermark: "b1" },
            ARTIFACTS: {}
          },
          tests: [
            {
              expr: {
                type: "neighbour",
                dir: 1,
                start: "mymark",
                draw: { neighbours: { tolayer: "flarps" } }
              },
              sample: "ARTIFACTS.flarps",
              res: { a2: {} }
            },
            {
              expr: {
                type: "neighbour",
                dir: 1,
                start: "mymark",
                draw: {
                  neighbours: { tolayer: "flarps" },
                  start: { tolayer: "blarps" }
                }
              },
              sample: "ARTIFACTS",
              res: { flarps: { a2: {} }, blarps: { a1: {} } }
            },
            {
              expr: {
                type: "neighbour",
                dirs: ["ortho"],
                start: "mymark",
                draw: { neighbours: { tolayer: "flarps" } }
              },
              sample: "ARTIFACTS.flarps",
              res: { a2: {}, b1: {} }
            },
            {
              expr: {
                type: "neighbour",
                dir: 1,
                starts: { singles: ["mymark", "myothermark"] },
                draw: { neighbours: { tolayer: "flarps" } }
              },
              sample: "ARTIFACTS.flarps",
              res: { a2: {}, b2: {} }
            },
            {
              expr: {
                type: "neighbour",
                dirs: { list: [1, 3] },
                starts: { singles: ["mymark", "myothermark"] },
                draw: { neighbours: { tolayer: "flarps" } }
              },
              sample: "ARTIFACTS.flarps",
              res: { a2: {}, b1: {}, b2: {}, c1: {} }
            },
            {
              expr: {
                type: "neighbour",
                dirs: ["rose"],
                start: "mymark",
                draw: {
                  start: {
                    tolayer: "flarps",
                    include: { n: ["neighbourcount"] }
                  }
                }
              },
              sample: "ARTIFACTS.flarps",
              res: { a1: { n: 3 } },
              desc: "We can access neighbour count in start draw"
            }
          ]
        }
      ]
    }
  ]
};