import { emptyFullDef } from "../../common";
import { AlgolValAnon } from "../../types";
import { run, ParserTest } from "./utils";

import * as test from "tape";

const tests: ParserTest<AlgolValAnon>[] = [
  {
    def: emptyFullDef,
    player: 1,
    action: "someaction",
    contexts: [
      {
        context: {},
        tests: [
          { expr: "foo", res: "foo" },
          { expr: ["player"], res: 1 },
          { expr: ["otherplayer"], res: 2 },
          { expr: { value: { value: { value: 5 } } }, res: 5 },
          { expr: 7, res: 7 },
          { expr: { minus: [6, 3, { value: 2 }] }, res: 1 },
          { expr: { playercase: [{ playercase: [777, 2] }, 666] }, res: 777 },
          { expr: { ifactionelse: ["someaction", 1, 666] }, res: 1 },
          {
            expr: { ifactionelse: ["otheraction", 1, { value: 666 }] },
            res: 666
          },
          { expr: { prod: [{ minus: [5, 3] }, 5, 3] }, res: 30 },
          {
            expr: { indexlist: [{ minus: [2, 1] }, "foo", { value: "bar" }] },
            res: "bar"
          },
          { expr: { ifelse: [["true"], { value: 1 }, 2] }, res: 1 },
          { expr: { ifelse: [["false"], 1, { value: 2 }] }, res: 2 },
          { expr: { if: [["true"], "foo"] }, res: "foo" },
          { expr: { if: [["false"], "foo"] }, res: undefined }
        ]
      },
      { context: { DIR: 666 }, tests: [{ expr: ["dir"], res: 666 }] },
      {
        context: { TURNVARS: { foo: 666 } },
        tests: [{ expr: { turnvar: { value: "foo" } }, res: 666 }]
      },
      {
        context: { BATTLEVARS: { foo: 666 } },
        tests: [{ expr: { battlevar: { value: "foo" } }, res: 666 }]
      },
      {
        context: { MARKS: { somemark: "wee" } },
        tests: [{ expr: { sizeof: { single: "somemark" } }, res: 1 }]
      },
      {
        context: {
          MARKS: { mymark: "a1" },
          UNITLAYERS: { units: { a1: { id: 666 } } }
        },
        tests: [{ expr: { idat: "mymark" }, res: 666 }]
      },
      {
        context: {
          WALKLENGTH: 1,
          DIR: 2,
          STOPREASON: "tripped",
          TOTALCOUNT: 3,
          NEIGHBOURCOUNT: 4,
          MAX: 5,
          STEP: 6,
          LOOPID: 7,
          turn: { turn: 8 }
        },
        tests: [
          { expr: ["walklength"], res: 1 },
          { expr: ["dir"], res: 2 },
          { expr: ["stopreason"], res: "tripped" },
          { expr: ["totalcount"], res: 3 },
          { expr: ["neighbourcount"], res: 4 },
          { expr: ["max"], res: 5 },
          { expr: ["step"], res: 6 },
          { expr: ["loopid"], res: 7 },
          { expr: ["turn"], res: 8 }
        ]
      }
    ]
  },
  {
    def: emptyFullDef,
    player: 2,
    action: "someaction",
    contexts: [
      {
        context: {},
        tests: [
          { expr: ["player"], res: 2 },
          { expr: ["otherplayer"], res: 1 },
          { expr: { playercase: [666, { value: "yes" }] }, res: "yes" }
        ]
      }
    ]
  },
  {
    def: {
      ...emptyFullDef,
      board: {
        ...emptyFullDef.board,
        terrain: {
          flurp: []
        }
      }
    },
    player: 1,
    action: "someaction",
    contexts: [
      {
        context: {
          TERRAIN: { flurp: { a1: { foo: "bar" } } },
          MARKS: { there: "a1" }
        },
        tests: [{ expr: { read: ["flurp", "there", "foo"] }, res: "bar" }]
      },
      {
        context: {
          TERRAIN: { flurp: { a1: { wee: 5 }, b2: { wee: 2 } } }
        },
        tests: [
          { expr: { harvest: ["flurp", { value: "wee" }] }, res: 7 },
          { expr: { sizeof: "flurp" }, res: 2 }
        ]
      }
    ]
  }
];

test("new expression - values", t => {
  run(tests, "val", t);
  t.end();
});
