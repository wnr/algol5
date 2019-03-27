import { executeSection } from "..";
import { emptyFullDef, truthy, falsy } from "../../../../../common";
import { AlgolStatementSuite, AlgolSection } from "../../../../../types";

export const testSuite: AlgolStatementSuite<AlgolSection> = {
  title: "Section - Start - End",
  func: executeSection,
  defs: [
    {
      def: {
        ...emptyFullDef,
        flow: {
          ...emptyFullDef.flow,
          startTurn: {}
        },
        graphics: {
          ...emptyFullDef.graphics,
          icons: {
            flurps: "bishop",
            gnurps: "king"
          }
        }
      },
      player: 1,
      action: "somemark",
      contexts: [
        {
          context: {
            step: { TURN: 7 },
            ARTIFACTS: "localArtifacts",
            UNITDATA: "localUnitData",
            UNITLAYERS: "localUnitLayers",
            MARKS: "localMarks",
            LINKS: "localLinks"
          },
          tests: [
            {
              expr: "startEnd",
              asserts: [
                {
                  sample: "returnVal",
                  res: truthy,
                  desc: "A new step was saved as root"
                },
                {
                  sample: "returnVal.ARTIFACTS",
                  res: "localArtifacts"
                },
                {
                  sample: "returnVal.UNITLAYERS",
                  res: "localUnitLayers"
                },
                {
                  sample: "returnVal.UNITDATA",
                  res: "localUnitData"
                },
                {
                  sample: "returnVal.MARKS",
                  res: "localMarks"
                },
                {
                  sample: "returnVal.LINKS",
                  res: "localLinks"
                },
                {
                  sample: "returnVal.name",
                  res: "start"
                },
                {
                  sample: "returnVal.path",
                  res: []
                },
                {
                  sample: "returnVal.NEXTSPAWNID",
                  res: falsy
                },
                {
                  sample: "returnVal.TURN",
                  res: 8
                }
              ]
            }
          ]
        }
      ]
    },
    {
      def: {
        ...emptyFullDef,
        flow: {
          ...emptyFullDef.flow,
          startTurn: {
            link: { if: [{ same: [["turn"], 1] }, "endturn"] }
          },
          commands: {
            somecmnd: {
              applyEffect: { spawnat: ["somemark", "gnurps"] }
            }
          }
        }
      },
      action: "start",
      player: 2,
      contexts: [
        {
          context: {
            ARTIFACTS: "localArtifacts",
            UNITDATA: "localUnitData",
            UNITLAYERS: "localUnitLayers",
            MARKS: "localMarks",
            LINKS: "localLinks",
            TURN: "localTurnNumber",
            step: {
              NEXTSPAWNID: "oldNextSpawnId"
            }
          },
          tests: [
            {
              expr: "startEnd",
              asserts: [
                {
                  sample: "returnVal.TURN",
                  res: "localTurnNumber"
                },
                {
                  sample: "returnVal.NEXTSPAWNID",
                  res: "oldNextSpawnId"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
