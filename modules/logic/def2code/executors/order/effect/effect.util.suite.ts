import { executeOrder } from "../../../executors";
import { emptyFullDef, truthy, falsy } from "../../../../../common";
import { AlgolOrderAnon, AlgolStatementSuite } from "../../../../../types";

export const testSuite: AlgolStatementSuite<AlgolOrderAnon> = {
  title: "Effect - Util",
  func: executeOrder,
  defs: [
    {
      def: emptyFullDef,
      player: 1,
      action: "someaction",
      contexts: [
        {
          context: {
            UNITDATA: {
              unit1: { id: "unit1", pos: "a1" },
              unit2: { id: "unit2", pos: "b2" }
            },
            UNITLAYERS: {
              units: { a1: { id: "unit1" }, b2: { id: "unit2" } }
            },
            MARKS: { unit1mark: "a1", othermark: "c3", unit2mark: "b2" }
          },
          tests: [
            {
              expr: {
                effects: [
                  {
                    forposin: [{ single: "unit1mark" }, { killat: ["looppos"] }]
                  }
                ]
              },
              asserts: [
                {
                  sample: "UNITDATA.unit1",
                  res: falsy
                },
                {
                  sample: "UNITDATA.unit2",
                  res: truthy
                }
              ]
            },
            {
              expr: {
                effects: [{ multi: [{ killid: "unit2" }, { killid: "unit1" }] }]
              },
              asserts: [
                {
                  sample: "UNITDATA.unit1",
                  res: falsy
                },
                {
                  sample: "UNITDATA.unit2",
                  res: falsy
                }
              ]
            },
            {
              expr: {
                effects: [
                  {
                    foridin: [{ single: "unit1mark" }, { killid: ["loopid"] }]
                  }
                ]
              },
              asserts: [
                {
                  sample: "UNITDATA.unit1",
                  res: falsy
                },
                {
                  sample: "UNITDATA.unit2",
                  res: truthy
                }
              ]
            },
            {
              expr: {
                effects: [{ foridin: ["units", { killid: ["loopid"] }] }]
              },
              asserts: [
                {
                  sample: "UNITDATA",
                  res: {}
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
