import {
  offsetPos,
  boardConnections,
  makeRelativeDirs,
  deduceInitialUnitData,
  boardLayers,
  collapseContent,
  defaultInstruction
} from "/Users/davidwaller/gitreps/algol5/modules/common";

const BOARD = boardLayers({ height: 8, width: 8 });

const emptyArtifactLayers = {
  eattargets: {},
  movetargets: {},
  canmove: {},
  cracks: {}
};

const connections = boardConnections({ height: 8, width: 8 });
const relativeDirs = makeRelativeDirs();
const TERRAIN = {
  water: {
    a1: { pos: "a1", x: 1, y: 1 },
    a2: { pos: "a2", x: 1, y: 2 },
    a7: { pos: "a7", x: 1, y: 7 },
    a8: { pos: "a8", x: 1, y: 8 },
    b1: { pos: "b1", x: 2, y: 1 },
    b8: { pos: "b8", x: 2, y: 8 },
    g1: { pos: "g1", x: 7, y: 1 },
    g8: { pos: "g8", x: 7, y: 8 },
    h1: { pos: "h1", x: 8, y: 1 },
    h2: { pos: "h2", x: 8, y: 2 },
    h7: { pos: "h7", x: 8, y: 7 },
    h8: { pos: "h8", x: 8, y: 8 }
  },
  nowater: {
    a3: { pos: "a3", x: 1, y: 3 },
    a4: { pos: "a4", x: 1, y: 4 },
    a5: { pos: "a5", x: 1, y: 5 },
    a6: { pos: "a6", x: 1, y: 6 },
    b2: { pos: "b2", x: 2, y: 2 },
    b3: { pos: "b3", x: 2, y: 3 },
    b4: { pos: "b4", x: 2, y: 4 },
    b5: { pos: "b5", x: 2, y: 5 },
    b6: { pos: "b6", x: 2, y: 6 },
    b7: { pos: "b7", x: 2, y: 7 },
    c1: { pos: "c1", x: 3, y: 1 },
    c2: { pos: "c2", x: 3, y: 2 },
    c3: { pos: "c3", x: 3, y: 3 },
    c4: { pos: "c4", x: 3, y: 4 },
    c5: { pos: "c5", x: 3, y: 5 },
    c6: { pos: "c6", x: 3, y: 6 },
    c7: { pos: "c7", x: 3, y: 7 },
    c8: { pos: "c8", x: 3, y: 8 },
    d1: { pos: "d1", x: 4, y: 1 },
    d2: { pos: "d2", x: 4, y: 2 },
    d3: { pos: "d3", x: 4, y: 3 },
    d4: { pos: "d4", x: 4, y: 4 },
    d5: { pos: "d5", x: 4, y: 5 },
    d6: { pos: "d6", x: 4, y: 6 },
    d7: { pos: "d7", x: 4, y: 7 },
    d8: { pos: "d8", x: 4, y: 8 },
    e1: { pos: "e1", x: 5, y: 1 },
    e2: { pos: "e2", x: 5, y: 2 },
    e3: { pos: "e3", x: 5, y: 3 },
    e4: { pos: "e4", x: 5, y: 4 },
    e5: { pos: "e5", x: 5, y: 5 },
    e6: { pos: "e6", x: 5, y: 6 },
    e7: { pos: "e7", x: 5, y: 7 },
    e8: { pos: "e8", x: 5, y: 8 },
    f1: { pos: "f1", x: 6, y: 1 },
    f2: { pos: "f2", x: 6, y: 2 },
    f3: { pos: "f3", x: 6, y: 3 },
    f4: { pos: "f4", x: 6, y: 4 },
    f5: { pos: "f5", x: 6, y: 5 },
    f6: { pos: "f6", x: 6, y: 6 },
    f7: { pos: "f7", x: 6, y: 7 },
    f8: { pos: "f8", x: 6, y: 8 },
    g2: { pos: "g2", x: 7, y: 2 },
    g3: { pos: "g3", x: 7, y: 3 },
    g4: { pos: "g4", x: 7, y: 4 },
    g5: { pos: "g5", x: 7, y: 5 },
    g6: { pos: "g6", x: 7, y: 6 },
    g7: { pos: "g7", x: 7, y: 7 },
    h3: { pos: "h3", x: 8, y: 3 },
    h4: { pos: "h4", x: 8, y: 4 },
    h5: { pos: "h5", x: 8, y: 5 },
    h6: { pos: "h6", x: 8, y: 6 }
  }
};
const roseDirs = [1, 2, 3, 4, 5, 6, 7, 8];
const orthoDirs = [1, 3, 5, 7];
const diagDirs = [2, 4, 6, 8];
let game: any = {};
type Links = {
  endturn?: "win" | "lose" | "draw" | "start1" | "start2";
  endMarks?: string[];
  endedBy?: "safeseal" | "sealseaten" | "starvation";
  commands: {
    move?: "move1" | "move2";
    eat?: "eat1" | "eat2";
  };
  marks: {
    selectunit?: { func: "selectunit1" | "selectunit2"; pos: string[] };
    selectmovetarget?: {
      func: "selectmovetarget1" | "selectmovetarget2";
      pos: string[];
    };
    selecteattarget?: {
      func: "selecteattarget1" | "selecteattarget2";
      pos: string[];
    };
  };
};
{
  const ownerNames = ["neutral", "my", "opp"];
  game.start1 = step => {
    const oldUnitLayers = step.UNITLAYERS;
    let UNITLAYERS = {
      units: oldUnitLayers.units,
      myunits: oldUnitLayers.oppunits,
      oppunits: oldUnitLayers.myunits,
      neutralunits: oldUnitLayers.neutralunits,
      seals: oldUnitLayers.seals,
      myseals: oldUnitLayers.oppseals,
      oppseals: oldUnitLayers.myseals,
      neutralseals: oldUnitLayers.neutralseals,
      bears: oldUnitLayers.bears,
      mybears: oldUnitLayers.oppbears,
      oppbears: oldUnitLayers.mybears,
      neutralbears: oldUnitLayers.neutralbears,
      holes: oldUnitLayers.holes,
      myholes: oldUnitLayers.oppholes,
      oppholes: oldUnitLayers.myholes,
      neutralholes: oldUnitLayers.neutralholes
    };
    let LINKS: Links = {
      commands: {},
      marks: {}
    };

    LINKS.marks.selectunit = {
      func: "selectunit1",
      pos: Object.keys(UNITLAYERS.myunits)
    };

    return {
      UNITDATA: step.UNITDATA,
      LINKS,
      name: "start",
      path: [],
      UNITLAYERS,
      ARTIFACTS: emptyArtifactLayers,
      MARKS: {},
      TURN: step.TURN + 1,
      NEXTSPAWNID: step.NEXTSPAWNID
    };
  };
  game.start1instruction = step => {
    return { text: "Select a unit to move" };
  };
  game.move1 = step => {
    let LINKS: Links = { commands: {}, marks: {} };
    let ARTIFACTS = {
      eattargets: step.ARTIFACTS.eattargets,
      movetargets: step.ARTIFACTS.movetargets,
      canmove: { ...step.ARTIFACTS.canmove },
      cracks: step.ARTIFACTS.cracks
    };
    let UNITLAYERS = step.UNITLAYERS;
    let UNITDATA = { ...step.UNITDATA };
    let NEXTSPAWNID = step.NEXTSPAWNID;
    let MARKS = step.MARKS;
    {
      let unitid = (UNITLAYERS.units[MARKS.selectunit] || {}).id;
      if (unitid) {
        UNITDATA[unitid] = {
          ...UNITDATA[unitid],
          pos: MARKS.selectmovetarget
        };
      }
    }
    for (let LOOPPOS in ARTIFACTS.cracks) {
      {
        let newunitid = "spawn" + NEXTSPAWNID++;
        UNITDATA[newunitid] = {
          pos: LOOPPOS,
          id: newunitid,
          group: "holes",
          owner: 0
        };
      }
    }
    UNITLAYERS = {
      units: {},
      myunits: {},
      oppunits: {},
      neutralunits: {},
      seals: {},
      myseals: {},
      oppseals: {},
      neutralseals: {},
      bears: {},
      mybears: {},
      oppbears: {},
      neutralbears: {},
      holes: {},
      myholes: {},
      oppholes: {},
      neutralholes: {}
    };
    for (let unitid in UNITDATA) {
      const currentunit = UNITDATA[unitid];
      const { group, pos, owner } = currentunit;
      const ownerPrefix = ownerNames[owner];
      UNITLAYERS.units[pos] = UNITLAYERS[group][pos] = UNITLAYERS[
        ownerPrefix + group
      ][pos] = UNITLAYERS[ownerPrefix + "units"][pos] = currentunit;
    }
    {
      for (let STARTPOS in UNITLAYERS.seals) {
        for (let DIR of roseDirs) {
          let MAX = 2;
          let POS = STARTPOS;
          let walkpositionstocount = Object.keys(TERRAIN.nowater)
            .filter(k => !UNITLAYERS.holes.hasOwnProperty(k))
            .reduce((m, k) => ({ ...m, [k]: {} }), {});
          let CURRENTCOUNT = 0;
          let LENGTH = 0;
          while (LENGTH < MAX && (POS = connections[POS][DIR])) {
            CURRENTCOUNT += walkpositionstocount[POS] ? 1 : 0;
            LENGTH++;
          }
          let TOTALCOUNT = CURRENTCOUNT;
          POS = STARTPOS;
          if (TOTALCOUNT > 0) {
            ARTIFACTS.canmove[POS] = {};
          }
        }
      }
    }

    if (
      Object.keys(ARTIFACTS.canmove).length !==
      Object.keys(UNITLAYERS.seals).length
    ) {
      let winner = 1;
      LINKS.endturn = winner === 1 ? "win" : winner ? "lose" : "draw";
      LINKS.endedBy = "safeseal";
      LINKS.endMarks = Object.keys(
        Object.keys(UNITLAYERS.seals)
          .filter(k => !ARTIFACTS.canmove.hasOwnProperty(k))
          .reduce((m, k) => ({ ...m, [k]: {} }), {})
      );
    } else if (Object.keys(UNITLAYERS.seals).length === 0) {
      let winner = 2;
      LINKS.endturn = winner === 1 ? "win" : winner ? "lose" : "draw";
      LINKS.endedBy = "sealseaten";
    } else {
      LINKS.endturn = "start2";
    }
    return {
      LINKS,
      path: step.path.concat("move"),
      MARKS: {},
      ARTIFACTS,
      TURN: step.TURN,
      UNITDATA,
      UNITLAYERS,

      NEXTSPAWNID
    };
  };
  game.move1instruction = () => defaultInstruction(1);
  game.eat1 = step => {
    let LINKS: Links = { commands: {}, marks: {} };
    let ARTIFACTS = {
      eattargets: step.ARTIFACTS.eattargets,
      movetargets: step.ARTIFACTS.movetargets,
      canmove: { ...step.ARTIFACTS.canmove },
      cracks: step.ARTIFACTS.cracks
    };
    let UNITLAYERS = step.UNITLAYERS;
    let UNITDATA = { ...step.UNITDATA };
    let MARKS = step.MARKS;
    delete UNITDATA[(UNITLAYERS.units[MARKS.selectunit] || {}).id];
    delete UNITDATA[(UNITLAYERS.units[MARKS.selecteattarget] || {}).id];
    UNITLAYERS = {
      units: {},
      myunits: {},
      oppunits: {},
      neutralunits: {},
      seals: {},
      myseals: {},
      oppseals: {},
      neutralseals: {},
      bears: {},
      mybears: {},
      oppbears: {},
      neutralbears: {},
      holes: {},
      myholes: {},
      oppholes: {},
      neutralholes: {}
    };
    for (let unitid in UNITDATA) {
      const currentunit = UNITDATA[unitid];
      const { group, pos, owner } = currentunit;
      const ownerPrefix = ownerNames[owner];
      UNITLAYERS.units[pos] = UNITLAYERS[group][pos] = UNITLAYERS[
        ownerPrefix + group
      ][pos] = UNITLAYERS[ownerPrefix + "units"][pos] = currentunit;
    }
    {
      for (let STARTPOS in UNITLAYERS.seals) {
        for (let DIR of roseDirs) {
          let MAX = 2;
          let POS = STARTPOS;
          let walkpositionstocount = Object.keys(TERRAIN.nowater)
            .filter(k => !UNITLAYERS.holes.hasOwnProperty(k))
            .reduce((m, k) => ({ ...m, [k]: {} }), {});
          let CURRENTCOUNT = 0;
          let LENGTH = 0;
          while (LENGTH < MAX && (POS = connections[POS][DIR])) {
            CURRENTCOUNT += walkpositionstocount[POS] ? 1 : 0;
            LENGTH++;
          }
          let TOTALCOUNT = CURRENTCOUNT;
          POS = STARTPOS;
          if (TOTALCOUNT > 0) {
            ARTIFACTS.canmove[POS] = {};
          }
        }
      }
    }

    if (
      Object.keys(ARTIFACTS.canmove).length !==
      Object.keys(UNITLAYERS.seals).length
    ) {
      let winner = 1;
      LINKS.endturn = winner === 1 ? "win" : winner ? "lose" : "draw";
      LINKS.endedBy = "safeseal";
      LINKS.endMarks = Object.keys(
        Object.keys(UNITLAYERS.seals)
          .filter(k => !ARTIFACTS.canmove.hasOwnProperty(k))
          .reduce((m, k) => ({ ...m, [k]: {} }), {})
      );
    } else if (Object.keys(UNITLAYERS.seals).length === 0) {
      let winner = 2;
      LINKS.endturn = winner === 1 ? "win" : winner ? "lose" : "draw";
      LINKS.endedBy = "sealseaten";
    } else {
      LINKS.endturn = "start2";
    }
    return {
      LINKS,
      path: step.path.concat("eat"),
      MARKS: {},
      ARTIFACTS,
      TURN: step.TURN,
      UNITDATA,
      UNITLAYERS,

      NEXTSPAWNID: step.NEXTSPAWNID
    };
  };
  game.eat1instruction = () => defaultInstruction(1);
  game.selectunit1 = (step, newMarkPos) => {
    let ARTIFACTS = {
      eattargets: step.ARTIFACTS.eattargets,
      movetargets: { ...step.ARTIFACTS.movetargets },
      canmove: step.ARTIFACTS.canmove,
      cracks: step.ARTIFACTS.cracks
    };
    let LINKS: Links = { commands: {}, marks: {} };
    let MARKS = { ...step.MARKS, selectunit: newMarkPos };
    let UNITLAYERS = step.UNITLAYERS;
    {
      let BLOCKS = {
        ...UNITLAYERS.seals,
        ...UNITLAYERS.bears,
        ...TERRAIN.water
      };

      for (let DIR of roseDirs) {
        let MAX = 2;
        let POS = MARKS.selectunit;
        let LENGTH = 0;
        while (LENGTH < MAX && (POS = connections[POS][DIR]) && !BLOCKS[POS]) {
          LENGTH++;
          if (!UNITLAYERS.holes[POS]) {
            ARTIFACTS.movetargets[POS] = { dir: DIR };
          }
        }
      }
    }
    LINKS.marks.selectmovetarget = {
      func: "selectmovetarget1",
      pos: Object.keys(ARTIFACTS.movetargets)
    };

    return {
      LINKS,
      path: step.path.concat(newMarkPos),
      name: "selectunit",
      ARTIFACTS,
      UNITLAYERS,
      UNITDATA: step.UNITDATA,
      TURN: step.TURN,
      MARKS,

      NEXTSPAWNID: step.NEXTSPAWNID
    };
  };
  game.selectunit1instruction = step => {
    return { text: "Select where to move" };
  };
  game.selectmovetarget1 = (step, newMarkPos) => {
    let ARTIFACTS = {
      eattargets: step.ARTIFACTS.eattargets,
      movetargets: step.ARTIFACTS.movetargets,
      canmove: step.ARTIFACTS.canmove,
      cracks: { ...step.ARTIFACTS.cracks }
    };
    let LINKS: Links = { commands: {}, marks: {} };
    let MARKS = { ...step.MARKS, selectmovetarget: newMarkPos };
    let UNITLAYERS = step.UNITLAYERS;
    {
      let BLOCKS = { [MARKS.selectunit]: 1 };

      let POS = MARKS.selectmovetarget;
      while (
        (POS =
          connections[POS][
            relativeDirs[
              (ARTIFACTS.movetargets[MARKS.selectmovetarget] || {}).dir
            ][5]
          ]) &&
        !BLOCKS[POS]
      ) {
        if (!UNITLAYERS.holes[POS]) {
          ARTIFACTS.cracks[POS] = {};
        }
      }
      if (BLOCKS[POS]) {
        ARTIFACTS.cracks[POS] = {};
      }
    }
    LINKS.commands.move = "move1";

    return {
      LINKS,
      path: step.path.concat(newMarkPos),
      name: "selectmovetarget",
      ARTIFACTS,
      UNITLAYERS,
      UNITDATA: step.UNITDATA,
      TURN: step.TURN,
      MARKS,

      NEXTSPAWNID: step.NEXTSPAWNID
    };
  };
  game.selectmovetarget1instruction = step => {
    return collapseContent({
      line: [{ text: "Press" }, { command: "move" }, { text: "to go here" }]
    });
  };
  game.selecteattarget1 = (step, newMarkPos) => {
    let LINKS: Links = { commands: {}, marks: {} };

    LINKS.commands.eat = "eat1";

    return {
      LINKS,
      path: step.path.concat(newMarkPos),
      name: "selecteattarget",
      ARTIFACTS: step.ARTIFACTS,
      UNITLAYERS: step.UNITLAYERS,
      UNITDATA: step.UNITDATA,
      TURN: step.TURN,
      MARKS: { ...step.MARKS, selecteattarget: newMarkPos },

      NEXTSPAWNID: step.NEXTSPAWNID
    };
  };
  game.selecteattarget1instruction = step => {
    return collapseContent({
      line: [{ text: "Press" }, { command: "eat" }, { text: "to, well, eat" }]
    });
  };
}
{
  const ownerNames = ["neutral", "opp", "my"];
  game.start2 = step => {
    const oldUnitLayers = step.UNITLAYERS;
    let UNITLAYERS = {
      units: oldUnitLayers.units,
      myunits: oldUnitLayers.oppunits,
      oppunits: oldUnitLayers.myunits,
      neutralunits: oldUnitLayers.neutralunits,
      seals: oldUnitLayers.seals,
      myseals: oldUnitLayers.oppseals,
      oppseals: oldUnitLayers.myseals,
      neutralseals: oldUnitLayers.neutralseals,
      bears: oldUnitLayers.bears,
      mybears: oldUnitLayers.oppbears,
      oppbears: oldUnitLayers.mybears,
      neutralbears: oldUnitLayers.neutralbears,
      holes: oldUnitLayers.holes,
      myholes: oldUnitLayers.oppholes,
      oppholes: oldUnitLayers.myholes,
      neutralholes: oldUnitLayers.neutralholes
    };
    let LINKS: Links = {
      commands: {},
      marks: {}
    };

    LINKS.marks.selectunit = {
      func: "selectunit2",
      pos: Object.keys(UNITLAYERS.myunits)
    };

    return {
      UNITDATA: step.UNITDATA,
      LINKS,
      name: "start",
      path: [],
      UNITLAYERS,
      ARTIFACTS: emptyArtifactLayers,
      MARKS: {},
      TURN: step.TURN + 1,
      NEXTSPAWNID: step.NEXTSPAWNID
    };
  };
  game.start2instruction = step => {
    return { text: "Select a unit to move" };
  };
  game.newBattle = () => {
    let UNITDATA = {
      unit1: { pos: "b2", x: 2, y: 2, id: "unit1", group: "seals", owner: 1 },
      unit2: { pos: "b7", x: 2, y: 7, id: "unit2", group: "seals", owner: 1 },
      unit3: { pos: "g2", x: 7, y: 2, id: "unit3", group: "bears", owner: 2 },
      unit4: { pos: "g7", x: 7, y: 7, id: "unit4", group: "bears", owner: 2 }
    };

    let UNITLAYERS = {
      units: {},
      myunits: {},
      oppunits: {},
      neutralunits: {},
      seals: {},
      myseals: {},
      oppseals: {},
      neutralseals: {},
      bears: {},
      mybears: {},
      oppbears: {},
      neutralbears: {},
      holes: {},
      myholes: {},
      oppholes: {},
      neutralholes: {}
    };
    for (let unitid in UNITDATA) {
      const currentunit = UNITDATA[unitid];
      const { group, pos, owner } = currentunit;
      const ownerPrefix = ownerNames[owner];
      UNITLAYERS.units[pos] = UNITLAYERS[group][pos] = UNITLAYERS[
        ownerPrefix + group
      ][pos] = UNITLAYERS[ownerPrefix + "units"][pos] = currentunit;
    }

    return game.start1({
      NEXTSPAWNID: 1,

      TURN: 0,
      UNITDATA,
      UNITLAYERS
    });
  };
  game.move2 = step => {
    let LINKS: Links = { commands: {}, marks: {} };
    let ARTIFACTS = {
      eattargets: step.ARTIFACTS.eattargets,
      movetargets: step.ARTIFACTS.movetargets,
      canmove: { ...step.ARTIFACTS.canmove },
      cracks: step.ARTIFACTS.cracks
    };
    let UNITLAYERS = step.UNITLAYERS;
    let UNITDATA = { ...step.UNITDATA };
    let NEXTSPAWNID = step.NEXTSPAWNID;
    let MARKS = step.MARKS;
    {
      let unitid = (UNITLAYERS.units[MARKS.selectunit] || {}).id;
      if (unitid) {
        UNITDATA[unitid] = {
          ...UNITDATA[unitid],
          pos: MARKS.selectmovetarget
        };
      }
    }
    for (let LOOPPOS in ARTIFACTS.cracks) {
      {
        let newunitid = "spawn" + NEXTSPAWNID++;
        UNITDATA[newunitid] = {
          pos: LOOPPOS,
          id: newunitid,
          group: "holes",
          owner: 0
        };
      }
    }
    UNITLAYERS = {
      units: {},
      myunits: {},
      oppunits: {},
      neutralunits: {},
      seals: {},
      myseals: {},
      oppseals: {},
      neutralseals: {},
      bears: {},
      mybears: {},
      oppbears: {},
      neutralbears: {},
      holes: {},
      myholes: {},
      oppholes: {},
      neutralholes: {}
    };
    for (let unitid in UNITDATA) {
      const currentunit = UNITDATA[unitid];
      const { group, pos, owner } = currentunit;
      const ownerPrefix = ownerNames[owner];
      UNITLAYERS.units[pos] = UNITLAYERS[group][pos] = UNITLAYERS[
        ownerPrefix + group
      ][pos] = UNITLAYERS[ownerPrefix + "units"][pos] = currentunit;
    }
    {
      for (let STARTPOS in UNITLAYERS.seals) {
        for (let DIR of roseDirs) {
          let MAX = 2;
          let POS = STARTPOS;
          let walkpositionstocount = Object.keys(TERRAIN.nowater)
            .filter(k => !UNITLAYERS.holes.hasOwnProperty(k))
            .reduce((m, k) => ({ ...m, [k]: {} }), {});
          let CURRENTCOUNT = 0;
          let LENGTH = 0;
          while (LENGTH < MAX && (POS = connections[POS][DIR])) {
            CURRENTCOUNT += walkpositionstocount[POS] ? 1 : 0;
            LENGTH++;
          }
          let TOTALCOUNT = CURRENTCOUNT;
          POS = STARTPOS;
          if (TOTALCOUNT > 0) {
            ARTIFACTS.canmove[POS] = {};
          }
        }
      }
    }

    if (
      Object.keys(ARTIFACTS.canmove).length !==
      Object.keys(UNITLAYERS.seals).length
    ) {
      let winner = 1;
      LINKS.endturn = winner === 2 ? "win" : winner ? "lose" : "draw";
      LINKS.endedBy = "safeseal";
      LINKS.endMarks = Object.keys(
        Object.keys(UNITLAYERS.seals)
          .filter(k => !ARTIFACTS.canmove.hasOwnProperty(k))
          .reduce((m, k) => ({ ...m, [k]: {} }), {})
      );
    } else if (Object.keys(UNITLAYERS.seals).length === 0) {
      let winner = 2;
      LINKS.endturn = winner === 2 ? "win" : winner ? "lose" : "draw";
      LINKS.endedBy = "sealseaten";
    } else {
      LINKS.endturn = "start1";
    }
    return {
      LINKS,
      path: step.path.concat("move"),
      MARKS: {},
      ARTIFACTS,
      TURN: step.TURN,
      UNITDATA,
      UNITLAYERS,

      NEXTSPAWNID
    };
  };
  game.move2instruction = () => defaultInstruction(2);
  game.eat2 = step => {
    let LINKS: Links = { commands: {}, marks: {} };
    let ARTIFACTS = {
      eattargets: step.ARTIFACTS.eattargets,
      movetargets: step.ARTIFACTS.movetargets,
      canmove: { ...step.ARTIFACTS.canmove },
      cracks: step.ARTIFACTS.cracks
    };
    let UNITLAYERS = step.UNITLAYERS;
    let UNITDATA = { ...step.UNITDATA };
    let MARKS = step.MARKS;
    delete UNITDATA[(UNITLAYERS.units[MARKS.selectunit] || {}).id];
    delete UNITDATA[(UNITLAYERS.units[MARKS.selecteattarget] || {}).id];
    UNITLAYERS = {
      units: {},
      myunits: {},
      oppunits: {},
      neutralunits: {},
      seals: {},
      myseals: {},
      oppseals: {},
      neutralseals: {},
      bears: {},
      mybears: {},
      oppbears: {},
      neutralbears: {},
      holes: {},
      myholes: {},
      oppholes: {},
      neutralholes: {}
    };
    for (let unitid in UNITDATA) {
      const currentunit = UNITDATA[unitid];
      const { group, pos, owner } = currentunit;
      const ownerPrefix = ownerNames[owner];
      UNITLAYERS.units[pos] = UNITLAYERS[group][pos] = UNITLAYERS[
        ownerPrefix + group
      ][pos] = UNITLAYERS[ownerPrefix + "units"][pos] = currentunit;
    }
    {
      for (let STARTPOS in UNITLAYERS.seals) {
        for (let DIR of roseDirs) {
          let MAX = 2;
          let POS = STARTPOS;
          let walkpositionstocount = Object.keys(TERRAIN.nowater)
            .filter(k => !UNITLAYERS.holes.hasOwnProperty(k))
            .reduce((m, k) => ({ ...m, [k]: {} }), {});
          let CURRENTCOUNT = 0;
          let LENGTH = 0;
          while (LENGTH < MAX && (POS = connections[POS][DIR])) {
            CURRENTCOUNT += walkpositionstocount[POS] ? 1 : 0;
            LENGTH++;
          }
          let TOTALCOUNT = CURRENTCOUNT;
          POS = STARTPOS;
          if (TOTALCOUNT > 0) {
            ARTIFACTS.canmove[POS] = {};
          }
        }
      }
    }

    if (
      Object.keys(ARTIFACTS.canmove).length !==
      Object.keys(UNITLAYERS.seals).length
    ) {
      let winner = 1;
      LINKS.endturn = winner === 2 ? "win" : winner ? "lose" : "draw";
      LINKS.endedBy = "safeseal";
      LINKS.endMarks = Object.keys(
        Object.keys(UNITLAYERS.seals)
          .filter(k => !ARTIFACTS.canmove.hasOwnProperty(k))
          .reduce((m, k) => ({ ...m, [k]: {} }), {})
      );
    } else if (Object.keys(UNITLAYERS.seals).length === 0) {
      let winner = 2;
      LINKS.endturn = winner === 2 ? "win" : winner ? "lose" : "draw";
      LINKS.endedBy = "sealseaten";
    } else {
      LINKS.endturn = "start1";
    }
    return {
      LINKS,
      path: step.path.concat("eat"),
      MARKS: {},
      ARTIFACTS,
      TURN: step.TURN,
      UNITDATA,
      UNITLAYERS,

      NEXTSPAWNID: step.NEXTSPAWNID
    };
  };
  game.eat2instruction = () => defaultInstruction(2);
  game.selectunit2 = (step, newMarkPos) => {
    let ARTIFACTS = {
      eattargets: { ...step.ARTIFACTS.eattargets },
      movetargets: { ...step.ARTIFACTS.movetargets },
      canmove: step.ARTIFACTS.canmove,
      cracks: step.ARTIFACTS.cracks
    };
    let LINKS: Links = { commands: {}, marks: {} };
    let MARKS = { ...step.MARKS, selectunit: newMarkPos };
    let UNITLAYERS = step.UNITLAYERS;
    {
      let BLOCKS = {
        ...UNITLAYERS.seals,
        ...UNITLAYERS.bears,
        ...TERRAIN.water
      };

      for (let DIR of roseDirs) {
        let MAX = 2;
        let POS = MARKS.selectunit;
        let LENGTH = 0;
        while (LENGTH < MAX && (POS = connections[POS][DIR]) && !BLOCKS[POS]) {
          LENGTH++;
          if (!UNITLAYERS.holes[POS]) {
            ARTIFACTS.movetargets[POS] = { dir: DIR };
          }
        }
      }
    }
    {
      let startconnections = connections[MARKS.selectunit];
      for (let DIR of roseDirs) {
        let POS = startconnections[DIR];
        if (POS && UNITLAYERS.seals[POS]) {
          ARTIFACTS.eattargets[POS] = {};
        }
      }
    }
    LINKS.marks.selectmovetarget = {
      func: "selectmovetarget2",
      pos: Object.keys(ARTIFACTS.movetargets)
    };

    LINKS.marks.selecteattarget = {
      func: "selecteattarget2",
      pos: Object.keys(ARTIFACTS.eattargets)
    };

    return {
      LINKS,
      path: step.path.concat(newMarkPos),
      name: "selectunit",
      ARTIFACTS,
      UNITLAYERS,
      UNITDATA: step.UNITDATA,
      TURN: step.TURN,
      MARKS,

      NEXTSPAWNID: step.NEXTSPAWNID
    };
  };
  game.selectunit2instruction = step => {
    return { text: "Select where to move" };
  };
  game.selectmovetarget2 = (step, newMarkPos) => {
    let ARTIFACTS = {
      eattargets: step.ARTIFACTS.eattargets,
      movetargets: step.ARTIFACTS.movetargets,
      canmove: step.ARTIFACTS.canmove,
      cracks: { ...step.ARTIFACTS.cracks }
    };
    let LINKS: Links = { commands: {}, marks: {} };
    let MARKS = { ...step.MARKS, selectmovetarget: newMarkPos };
    let UNITLAYERS = step.UNITLAYERS;
    {
      let BLOCKS = { [MARKS.selectunit]: 1 };

      let POS = MARKS.selectmovetarget;
      while (
        (POS =
          connections[POS][
            relativeDirs[
              (ARTIFACTS.movetargets[MARKS.selectmovetarget] || {}).dir
            ][5]
          ]) &&
        !BLOCKS[POS]
      ) {
        if (!UNITLAYERS.holes[POS]) {
          ARTIFACTS.cracks[POS] = {};
        }
      }
      if (BLOCKS[POS]) {
        ARTIFACTS.cracks[POS] = {};
      }
    }
    LINKS.commands.move = "move2";

    return {
      LINKS,
      path: step.path.concat(newMarkPos),
      name: "selectmovetarget",
      ARTIFACTS,
      UNITLAYERS,
      UNITDATA: step.UNITDATA,
      TURN: step.TURN,
      MARKS,

      NEXTSPAWNID: step.NEXTSPAWNID
    };
  };
  game.selectmovetarget2instruction = step => {
    return collapseContent({
      line: [{ text: "Press" }, { command: "move" }, { text: "to go here" }]
    });
  };
  game.selecteattarget2 = (step, newMarkPos) => {
    let LINKS: Links = { commands: {}, marks: {} };

    LINKS.commands.eat = "eat2";

    return {
      LINKS,
      path: step.path.concat(newMarkPos),
      name: "selecteattarget",
      ARTIFACTS: step.ARTIFACTS,
      UNITLAYERS: step.UNITLAYERS,
      UNITDATA: step.UNITDATA,
      TURN: step.TURN,
      MARKS: { ...step.MARKS, selecteattarget: newMarkPos },

      NEXTSPAWNID: step.NEXTSPAWNID
    };
  };
  game.selecteattarget2instruction = step => {
    return collapseContent({
      line: [{ text: "Press" }, { command: "eat" }, { text: "to, well, eat" }]
    });
  };
}
export default game;
