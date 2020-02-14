import {
  offsetPos,
  boardConnections,
  makeRelativeDirs,
  setup2army,
  boardLayers,
  terrainLayers,
  collapseContent,
  defaultInstruction
} from "../../common";
const emptyObj = {};
const dimensions = { height: 5, width: 5 };
const BOARD = boardLayers(dimensions);
const iconMapping = { knights: "knight", bishops: "bishop" };
const connections = boardConnections({ height: 5, width: 5, offset: "knight" });
const relativeDirs = makeRelativeDirs(["knight"]);
const roseDirs = [1, 2, 3, 4, 5, 6, 7, 8];
const orthoDirs = [1, 3, 5, 7];
const diagDirs = [2, 4, 6, 8];
const knightDirs = [
  "d1f2r1",
  "d1f2r-1",
  "d3f2r1",
  "d3f2r-1",
  "d5f2r1",
  "d5f2r-1",
  "d7f2r1",
  "d7f2r-1"
];
let game = {
  gameId: "chameleon",
  action: {},
  instruction: {},
  commands: { move: {} },
  iconMap: { knights: "knight", bishops: "bishop" }
};
{
  const groupLayers = {
    knights: [
      ["units", "knights"],
      ["units", "myunits", "knights"],
      ["units", "oppunits", "knights"]
    ],
    bishops: [
      ["units", "bishops"],
      ["units", "myunits", "bishops"],
      ["units", "oppunits", "bishops"]
    ]
  };
  const TERRAIN = terrainLayers(
    5,
    5,
    { base: { "1": [{ rect: ["a1", "e1"] }], "2": [{ rect: ["a5", "e5"] }] } },
    1
  );
  game.action.startTurn1 = step => {
    let ARTIFACTS = {
      invaders: {}
    };
    const oldUnitLayers = step.UNITLAYERS;
    let UNITLAYERS = {
      units: oldUnitLayers.units,
      myunits: oldUnitLayers.oppunits,
      oppunits: oldUnitLayers.myunits,
      knights: oldUnitLayers.knights,
      bishops: oldUnitLayers.bishops
    };
    let LINKS = {
      marks: {},
      commands: {}
    };
    let filtersourcelayer = Object.entries(
      Object.keys(UNITLAYERS.oppunits)
        .concat(Object.keys(TERRAIN.mybase))
        .reduce((mem, k) => ({ ...mem, [k]: (mem[k] || 0) + 1 }), {})
    )
      .filter(([key, n]) => n === 2)
      .reduce((mem, [key]) => ({ ...mem, [key]: emptyObj }), {});
    let filtertargetlayer = ARTIFACTS.invaders;
    for (let POS in filtersourcelayer) {
      let filterObj = filtersourcelayer[POS];
      filtertargetlayer[POS] = filterObj;
    }
    for (const pos of Object.keys(UNITLAYERS.myunits)) {
      LINKS.marks[pos] = "selectunit1";
    }
    return {
      UNITDATA: step.UNITDATA,
      LINKS,
      UNITLAYERS,
      ARTIFACTS,
      MARKS: {},
      TURN: step.TURN + 1
    };
  };
  game.instruction.startTurn1 = step => {
    let ARTIFACTS = step.ARTIFACTS;
    let UNITLAYERS = step.UNITLAYERS;
    return collapseContent({
      line: [
        { select: "Select" },
        { text: "a" },
        { unittype: ["bishop", 1] },
        { text: "or" },
        { unittype: ["knight", 1] },
        Object.keys(ARTIFACTS.invaders).length === 0
          ? { text: "to move" }
          : collapseContent({
              line: [
                { text: "that can reach the" },
                {
                  unit: [
                    iconMapping[
                      (
                        UNITLAYERS.units[Object.keys(ARTIFACTS.invaders)[0]] ||
                        {}
                      ).group
                    ],
                    (UNITLAYERS.units[Object.keys(ARTIFACTS.invaders)[0]] || {})
                      .owner,
                    Object.keys(ARTIFACTS.invaders)[0]
                  ]
                },
                { text: "invader" }
              ]
            })
      ]
    });
  };
  game.action.move1 = step => {
    let LINKS = { marks: {}, commands: {} };
    let ARTIFACTS = {
      invaders: step.ARTIFACTS.invaders,
      morph: step.ARTIFACTS.morph,
      movetarget: step.ARTIFACTS.movetarget
    };
    let UNITLAYERS = step.UNITLAYERS;
    let UNITDATA = { ...step.UNITDATA };
    let MARKS = step.MARKS;
    if (ARTIFACTS.morph[MARKS.selectmovetarget]) {
      {
        let unitid = (UNITLAYERS.units[MARKS.selectunit] || {}).id;
        if (unitid) {
          UNITDATA[unitid] = {
            ...UNITDATA[unitid],
            group: UNITLAYERS.knights[MARKS.selectunit] ? "bishops" : "knights"
          };
        }
      }
    }
    delete UNITDATA[(UNITLAYERS.units[MARKS.selectmovetarget] || {}).id];
    {
      let unitid = (UNITLAYERS.units[MARKS.selectunit] || {}).id;
      if (unitid) {
        UNITDATA[unitid] = {
          ...UNITDATA[unitid],
          pos: MARKS.selectmovetarget
        };
      }
    }
    UNITLAYERS = {
      units: {},
      myunits: {},
      oppunits: {},
      knights: {},
      bishops: {}
    };
    for (let unitid in UNITDATA) {
      const currentunit = UNITDATA[unitid];
      const { group, pos, owner } = currentunit;
      for (const layer of groupLayers[group][owner]) {
        UNITLAYERS[layer][pos] = currentunit;
      }
    }
    if (
      Object.keys(ARTIFACTS.invaders).length === 0 ||
      ARTIFACTS.invaders[MARKS.selectmovetarget]
    ) {
      if (
        Object.keys(UNITLAYERS.myunits).length === 1 &&
        TERRAIN.oppbase[MARKS.selectmovetarget]
      ) {
        LINKS.endGame = "win";
        LINKS.endedBy = "loneInvader";
        LINKS.endMarks = Object.keys({ [MARKS.selectmovetarget]: 1 });
      } else if (TERRAIN.oppbase[MARKS.selectmovetarget]) {
        LINKS.starvation = {
          endGame: "win",
          endedBy: "persistentInvader",
          endMarks: Object.keys({ [MARKS.selectmovetarget]: 1 })
        };
        LINKS.endTurn = "startTurn2";
      } else {
        LINKS.endTurn = "startTurn2";
      }
    }
    return {
      LINKS,
      MARKS: {},
      ARTIFACTS,
      TURN: step.TURN,
      UNITDATA,
      UNITLAYERS
    };
  };
  game.instruction.move1 = () => defaultInstruction(1);
  game.action.selectunit1 = (step, newMarkPos) => {
    let ARTIFACTS = {
      invaders: step.ARTIFACTS.invaders,
      morph: {},
      movetarget: {}
    };
    let LINKS = { marks: {}, commands: {} };
    let MARKS = {
      selectunit: newMarkPos
    };
    let UNITLAYERS = step.UNITLAYERS;
    {
      let STARTPOS = MARKS.selectunit;
      let startconnections = connections[STARTPOS];
      for (let DIR of roseDirs) {
        let POS = startconnections[DIR];
        if (POS) {
          if (!UNITLAYERS.myunits[POS]) {
            ARTIFACTS[
              (diagDirs.indexOf(DIR) !== -1 && UNITLAYERS.knights[STARTPOS]) ||
              (orthoDirs.indexOf(DIR) !== -1 && UNITLAYERS.bishops[STARTPOS])
                ? "morph"
                : "movetarget"
            ][POS] = emptyObj;
          }
        }
      }
    }
    if (UNITLAYERS.knights[MARKS.selectunit]) {
      {
        let startconnections = connections[MARKS.selectunit];
        for (let DIR of knightDirs) {
          let POS = startconnections[DIR];
          if (POS) {
            if (!UNITLAYERS.myunits[POS]) {
              ARTIFACTS.movetarget[POS] = emptyObj;
            }
          }
        }
      }
    }
    if (UNITLAYERS.bishops[MARKS.selectunit]) {
      {
        let BLOCKS = UNITLAYERS.units;
        for (let DIR of diagDirs) {
          let POS = MARKS.selectunit;
          while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
            ARTIFACTS.movetarget[POS] = emptyObj;
          }
          if (BLOCKS[POS]) {
            if (!UNITLAYERS.myunits[POS]) {
              ARTIFACTS.movetarget[POS] = emptyObj;
            }
          }
        }
      }
    }
    for (const pos of Object.keys({
      ...ARTIFACTS.movetarget,
      ...ARTIFACTS.morph
    })) {
      LINKS.marks[pos] = "selectmovetarget1";
    }
    return {
      LINKS,
      ARTIFACTS,
      UNITLAYERS,
      UNITDATA: step.UNITDATA,
      TURN: step.TURN,
      MARKS
    };
  };
  game.instruction.selectunit1 = step => {
    let ARTIFACTS = step.ARTIFACTS;
    let MARKS = step.MARKS;
    let UNITLAYERS = step.UNITLAYERS;
    return Object.keys(ARTIFACTS.invaders).length === 0
      ? collapseContent({
          line: [
            { text: "Select where to move" },
            {
              unit: [
                iconMapping[(UNITLAYERS.units[MARKS.selectunit] || {}).group],
                (UNITLAYERS.units[MARKS.selectunit] || {}).owner,
                MARKS.selectunit
              ]
            }
          ]
        })
      : collapseContent({
          line: [
            { text: "Now" },
            {
              unit: [
                iconMapping[(UNITLAYERS.units[MARKS.selectunit] || {}).group],
                (UNITLAYERS.units[MARKS.selectunit] || {}).owner,
                MARKS.selectunit
              ]
            },
            { text: "must expel the" },
            {
              unit: [
                iconMapping[
                  (UNITLAYERS.units[Object.keys(ARTIFACTS.invaders)[0]] || {})
                    .group
                ],
                (UNITLAYERS.units[Object.keys(ARTIFACTS.invaders)[0]] || {})
                  .owner,
                Object.keys(ARTIFACTS.invaders)[0]
              ]
            },
            { text: "invader" }
          ]
        });
  };
  game.action.selectmovetarget1 = (step, newMarkPos) => {
    let LINKS = { marks: {}, commands: {} };
    LINKS.commands.move = "move1";
    return {
      LINKS,
      ARTIFACTS: step.ARTIFACTS,
      UNITLAYERS: step.UNITLAYERS,
      UNITDATA: step.UNITDATA,
      TURN: step.TURN,
      MARKS: { selectunit: step.MARKS.selectunit, selectmovetarget: newMarkPos }
    };
  };
  game.instruction.selectmovetarget1 = step => {
    let ARTIFACTS = step.ARTIFACTS;
    let MARKS = step.MARKS;
    let UNITLAYERS = step.UNITLAYERS;
    return collapseContent({
      line: [
        { text: "Press" },
        { command: "move" },
        { text: "to" },
        UNITLAYERS.units[MARKS.selectmovetarget]
          ? collapseContent({
              line: [
                { text: "make" },
                {
                  unit: [
                    iconMapping[
                      (UNITLAYERS.units[MARKS.selectunit] || {}).group
                    ],
                    (UNITLAYERS.units[MARKS.selectunit] || {}).owner,
                    MARKS.selectunit
                  ]
                },
                { text: "stomp" },
                {
                  unit: [
                    iconMapping[
                      (UNITLAYERS.units[MARKS.selectmovetarget] || {}).group
                    ],
                    (UNITLAYERS.units[MARKS.selectmovetarget] || {}).owner,
                    MARKS.selectmovetarget
                  ]
                },
                TERRAIN.mybase[MARKS.selectmovetarget]
                  ? { text: ", expelling the invader" }
                  : undefined,
                TERRAIN.oppbase[MARKS.selectmovetarget]
                  ? { text: "in her own base" }
                  : undefined
              ]
            })
          : collapseContent({
              line: [
                { text: "move" },
                {
                  unit: [
                    iconMapping[
                      (UNITLAYERS.units[MARKS.selectunit] || {}).group
                    ],
                    (UNITLAYERS.units[MARKS.selectunit] || {}).owner,
                    MARKS.selectunit
                  ]
                },
                TERRAIN.oppbase[MARKS.selectmovetarget]
                  ? { text: "to invade the opponent base at" }
                  : { text: "to" },
                { pos: MARKS.selectmovetarget }
              ]
            }),
        ARTIFACTS.morph[MARKS.selectmovetarget]
          ? collapseContent({
              line: [
                { text: ", turning it into a" },
                UNITLAYERS.knights[MARKS.selectunit]
                  ? { unittype: ["bishop", 1] }
                  : { unittype: ["knight", 1] }
              ]
            })
          : undefined
      ]
    });
  };
}
{
  const groupLayers = {
    knights: [
      ["units", "knights"],
      ["units", "oppunits", "knights"],
      ["units", "myunits", "knights"]
    ],
    bishops: [
      ["units", "bishops"],
      ["units", "oppunits", "bishops"],
      ["units", "myunits", "bishops"]
    ]
  };
  const TERRAIN = terrainLayers(
    5,
    5,
    { base: { "1": [{ rect: ["a1", "e1"] }], "2": [{ rect: ["a5", "e5"] }] } },
    2
  );
  game.action.startTurn2 = step => {
    let ARTIFACTS = {
      invaders: {}
    };
    const oldUnitLayers = step.UNITLAYERS;
    let UNITLAYERS = {
      units: oldUnitLayers.units,
      myunits: oldUnitLayers.oppunits,
      oppunits: oldUnitLayers.myunits,
      knights: oldUnitLayers.knights,
      bishops: oldUnitLayers.bishops
    };
    let LINKS = {
      marks: {},
      commands: {}
    };
    let filtersourcelayer = Object.entries(
      Object.keys(UNITLAYERS.oppunits)
        .concat(Object.keys(TERRAIN.mybase))
        .reduce((mem, k) => ({ ...mem, [k]: (mem[k] || 0) + 1 }), {})
    )
      .filter(([key, n]) => n === 2)
      .reduce((mem, [key]) => ({ ...mem, [key]: emptyObj }), {});
    let filtertargetlayer = ARTIFACTS.invaders;
    for (let POS in filtersourcelayer) {
      let filterObj = filtersourcelayer[POS];
      filtertargetlayer[POS] = filterObj;
    }
    for (const pos of Object.keys(UNITLAYERS.myunits)) {
      LINKS.marks[pos] = "selectunit2";
    }
    return {
      UNITDATA: step.UNITDATA,
      LINKS,
      UNITLAYERS,
      ARTIFACTS,
      MARKS: {},
      TURN: step.TURN
    };
  };
  game.instruction.startTurn2 = step => {
    let ARTIFACTS = step.ARTIFACTS;
    let UNITLAYERS = step.UNITLAYERS;
    return collapseContent({
      line: [
        { select: "Select" },
        { text: "a" },
        { unittype: ["bishop", 2] },
        { text: "or" },
        { unittype: ["knight", 2] },
        Object.keys(ARTIFACTS.invaders).length === 0
          ? { text: "to move" }
          : collapseContent({
              line: [
                { text: "that can reach the" },
                {
                  unit: [
                    iconMapping[
                      (
                        UNITLAYERS.units[Object.keys(ARTIFACTS.invaders)[0]] ||
                        {}
                      ).group
                    ],
                    (UNITLAYERS.units[Object.keys(ARTIFACTS.invaders)[0]] || {})
                      .owner,
                    Object.keys(ARTIFACTS.invaders)[0]
                  ]
                },
                { text: "invader" }
              ]
            })
      ]
    });
  };
  game.newBattle = () => {
    let UNITDATA = setup2army({
      knights: { "1": [{ rect: ["a1", "e1"] }], "2": [{ rect: ["a5", "e5"] }] }
    });
    let UNITLAYERS = {
      units: {},
      myunits: {},
      oppunits: {},
      knights: {},
      bishops: {}
    };
    for (let unitid in UNITDATA) {
      const currentunit = UNITDATA[unitid];
      const { group, pos, owner } = currentunit;
      for (const layer of groupLayers[group][owner]) {
        UNITLAYERS[layer][pos] = currentunit;
      }
    }
    return game.action.startTurn1({
      TURN: 0,
      UNITDATA,
      UNITLAYERS
    });
  };
  game.action.move2 = step => {
    let LINKS = { marks: {}, commands: {} };
    let ARTIFACTS = {
      invaders: step.ARTIFACTS.invaders,
      morph: step.ARTIFACTS.morph,
      movetarget: step.ARTIFACTS.movetarget
    };
    let UNITLAYERS = step.UNITLAYERS;
    let UNITDATA = { ...step.UNITDATA };
    let MARKS = step.MARKS;
    if (ARTIFACTS.morph[MARKS.selectmovetarget]) {
      {
        let unitid = (UNITLAYERS.units[MARKS.selectunit] || {}).id;
        if (unitid) {
          UNITDATA[unitid] = {
            ...UNITDATA[unitid],
            group: UNITLAYERS.knights[MARKS.selectunit] ? "bishops" : "knights"
          };
        }
      }
    }
    delete UNITDATA[(UNITLAYERS.units[MARKS.selectmovetarget] || {}).id];
    {
      let unitid = (UNITLAYERS.units[MARKS.selectunit] || {}).id;
      if (unitid) {
        UNITDATA[unitid] = {
          ...UNITDATA[unitid],
          pos: MARKS.selectmovetarget
        };
      }
    }
    UNITLAYERS = {
      units: {},
      myunits: {},
      oppunits: {},
      knights: {},
      bishops: {}
    };
    for (let unitid in UNITDATA) {
      const currentunit = UNITDATA[unitid];
      const { group, pos, owner } = currentunit;
      for (const layer of groupLayers[group][owner]) {
        UNITLAYERS[layer][pos] = currentunit;
      }
    }
    if (
      Object.keys(ARTIFACTS.invaders).length === 0 ||
      ARTIFACTS.invaders[MARKS.selectmovetarget]
    ) {
      if (
        Object.keys(UNITLAYERS.myunits).length === 1 &&
        TERRAIN.oppbase[MARKS.selectmovetarget]
      ) {
        LINKS.endGame = "win";
        LINKS.endedBy = "loneInvader";
        LINKS.endMarks = Object.keys({ [MARKS.selectmovetarget]: 1 });
      } else if (TERRAIN.oppbase[MARKS.selectmovetarget]) {
        LINKS.starvation = {
          endGame: "win",
          endedBy: "persistentInvader",
          endMarks: Object.keys({ [MARKS.selectmovetarget]: 1 })
        };
        LINKS.endTurn = "startTurn1";
      } else {
        LINKS.endTurn = "startTurn1";
      }
    }
    return {
      LINKS,
      MARKS: {},
      ARTIFACTS,
      TURN: step.TURN,
      UNITDATA,
      UNITLAYERS
    };
  };
  game.instruction.move2 = () => defaultInstruction(2);
  game.action.selectunit2 = (step, newMarkPos) => {
    let ARTIFACTS = {
      invaders: step.ARTIFACTS.invaders,
      morph: {},
      movetarget: {}
    };
    let LINKS = { marks: {}, commands: {} };
    let MARKS = {
      selectunit: newMarkPos
    };
    let UNITLAYERS = step.UNITLAYERS;
    {
      let STARTPOS = MARKS.selectunit;
      let startconnections = connections[STARTPOS];
      for (let DIR of roseDirs) {
        let POS = startconnections[DIR];
        if (POS) {
          if (!UNITLAYERS.myunits[POS]) {
            ARTIFACTS[
              (diagDirs.indexOf(DIR) !== -1 && UNITLAYERS.knights[STARTPOS]) ||
              (orthoDirs.indexOf(DIR) !== -1 && UNITLAYERS.bishops[STARTPOS])
                ? "morph"
                : "movetarget"
            ][POS] = emptyObj;
          }
        }
      }
    }
    if (UNITLAYERS.knights[MARKS.selectunit]) {
      {
        let startconnections = connections[MARKS.selectunit];
        for (let DIR of knightDirs) {
          let POS = startconnections[DIR];
          if (POS) {
            if (!UNITLAYERS.myunits[POS]) {
              ARTIFACTS.movetarget[POS] = emptyObj;
            }
          }
        }
      }
    }
    if (UNITLAYERS.bishops[MARKS.selectunit]) {
      {
        let BLOCKS = UNITLAYERS.units;
        for (let DIR of diagDirs) {
          let POS = MARKS.selectunit;
          while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
            ARTIFACTS.movetarget[POS] = emptyObj;
          }
          if (BLOCKS[POS]) {
            if (!UNITLAYERS.myunits[POS]) {
              ARTIFACTS.movetarget[POS] = emptyObj;
            }
          }
        }
      }
    }
    for (const pos of Object.keys({
      ...ARTIFACTS.movetarget,
      ...ARTIFACTS.morph
    })) {
      LINKS.marks[pos] = "selectmovetarget2";
    }
    return {
      LINKS,
      ARTIFACTS,
      UNITLAYERS,
      UNITDATA: step.UNITDATA,
      TURN: step.TURN,
      MARKS
    };
  };
  game.instruction.selectunit2 = step => {
    let ARTIFACTS = step.ARTIFACTS;
    let MARKS = step.MARKS;
    let UNITLAYERS = step.UNITLAYERS;
    return Object.keys(ARTIFACTS.invaders).length === 0
      ? collapseContent({
          line: [
            { text: "Select where to move" },
            {
              unit: [
                iconMapping[(UNITLAYERS.units[MARKS.selectunit] || {}).group],
                (UNITLAYERS.units[MARKS.selectunit] || {}).owner,
                MARKS.selectunit
              ]
            }
          ]
        })
      : collapseContent({
          line: [
            { text: "Now" },
            {
              unit: [
                iconMapping[(UNITLAYERS.units[MARKS.selectunit] || {}).group],
                (UNITLAYERS.units[MARKS.selectunit] || {}).owner,
                MARKS.selectunit
              ]
            },
            { text: "must expel the" },
            {
              unit: [
                iconMapping[
                  (UNITLAYERS.units[Object.keys(ARTIFACTS.invaders)[0]] || {})
                    .group
                ],
                (UNITLAYERS.units[Object.keys(ARTIFACTS.invaders)[0]] || {})
                  .owner,
                Object.keys(ARTIFACTS.invaders)[0]
              ]
            },
            { text: "invader" }
          ]
        });
  };
  game.action.selectmovetarget2 = (step, newMarkPos) => {
    let LINKS = { marks: {}, commands: {} };
    LINKS.commands.move = "move2";
    return {
      LINKS,
      ARTIFACTS: step.ARTIFACTS,
      UNITLAYERS: step.UNITLAYERS,
      UNITDATA: step.UNITDATA,
      TURN: step.TURN,
      MARKS: { selectunit: step.MARKS.selectunit, selectmovetarget: newMarkPos }
    };
  };
  game.instruction.selectmovetarget2 = step => {
    let ARTIFACTS = step.ARTIFACTS;
    let MARKS = step.MARKS;
    let UNITLAYERS = step.UNITLAYERS;
    return collapseContent({
      line: [
        { text: "Press" },
        { command: "move" },
        { text: "to" },
        UNITLAYERS.units[MARKS.selectmovetarget]
          ? collapseContent({
              line: [
                { text: "make" },
                {
                  unit: [
                    iconMapping[
                      (UNITLAYERS.units[MARKS.selectunit] || {}).group
                    ],
                    (UNITLAYERS.units[MARKS.selectunit] || {}).owner,
                    MARKS.selectunit
                  ]
                },
                { text: "stomp" },
                {
                  unit: [
                    iconMapping[
                      (UNITLAYERS.units[MARKS.selectmovetarget] || {}).group
                    ],
                    (UNITLAYERS.units[MARKS.selectmovetarget] || {}).owner,
                    MARKS.selectmovetarget
                  ]
                },
                TERRAIN.mybase[MARKS.selectmovetarget]
                  ? { text: ", expelling the invader" }
                  : undefined,
                TERRAIN.oppbase[MARKS.selectmovetarget]
                  ? { text: "in her own base" }
                  : undefined
              ]
            })
          : collapseContent({
              line: [
                { text: "move" },
                {
                  unit: [
                    iconMapping[
                      (UNITLAYERS.units[MARKS.selectunit] || {}).group
                    ],
                    (UNITLAYERS.units[MARKS.selectunit] || {}).owner,
                    MARKS.selectunit
                  ]
                },
                TERRAIN.oppbase[MARKS.selectmovetarget]
                  ? { text: "to invade the opponent base at" }
                  : { text: "to" },
                { pos: MARKS.selectmovetarget }
              ]
            }),
        ARTIFACTS.morph[MARKS.selectmovetarget]
          ? collapseContent({
              line: [
                { text: ", turning it into a" },
                UNITLAYERS.knights[MARKS.selectunit]
                  ? { unittype: ["bishop", 2] }
                  : { unittype: ["knight", 2] }
              ]
            })
          : undefined
      ]
    });
  };
}
export default game;
