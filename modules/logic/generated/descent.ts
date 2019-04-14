import {
  offsetPos,
  boardConnections,
  makeRelativeDirs,
  deduceInitialUnitData,
  boardLayers,
  collapseContent,
  defaultInstruction
} from "/Users/davidwaller/gitreps/algol5/modules/common";
import {
  AlgolStepLinks,
  AlgolGame
} from "/Users/davidwaller/gitreps/algol5/modules/types";
const emptyObj = {};
const BOARD = boardLayers({ height: 4, width: 4 });

const emptyArtifactLayers = { movetargets: {}, digtargets: {}, winline: {} };

const connections = boardConnections({ height: 4, width: 4 });
const relativeDirs = makeRelativeDirs([]);
const TERRAIN = {};
const roseDirs = [1, 2, 3, 4, 5, 6, 7, 8];
const orthoDirs = [1, 3, 5, 7];
const diagDirs = [2, 4, 6, 8];
let game: Partial<AlgolGame> = { action: {}, instruction: {} };
{
  const groupLayers = {
    pawns: [
      ["units", "neutralunits", "pawns"],
      ["units", "myunits", "pawns", "mypawns"],
      ["units", "oppunits", "pawns", "opppawns"]
    ],
    knights: [
      ["units", "neutralunits", "knights"],
      ["units", "myunits", "knights", "myknights"],
      ["units", "oppunits", "knights", "oppknights"]
    ],
    rooks: [
      ["units", "neutralunits", "rooks"],
      ["units", "myunits", "rooks", "myrooks"],
      ["units", "oppunits", "rooks", "opprooks"]
    ]
  };
  game.action.start1 = step => {
    const oldUnitLayers = step.UNITLAYERS;
    let UNITLAYERS = {
      units: oldUnitLayers.units,
      myunits: oldUnitLayers.oppunits,
      oppunits: oldUnitLayers.myunits,
      neutralunits: oldUnitLayers.neutralunits,
      pawns: oldUnitLayers.pawns,
      mypawns: oldUnitLayers.opppawns,
      opppawns: oldUnitLayers.mypawns,
      knights: oldUnitLayers.knights,
      myknights: oldUnitLayers.oppknights,
      oppknights: oldUnitLayers.myknights,
      rooks: oldUnitLayers.rooks,
      myrooks: oldUnitLayers.opprooks,
      opprooks: oldUnitLayers.myrooks
    };
    let LINKS: AlgolStepLinks = {
      actions: {}
    };

    for (const pos of Object.keys(UNITLAYERS.myunits)) {
      LINKS.actions[pos] = "selectunit1";
    }

    return {
      UNITDATA: step.UNITDATA,
      LINKS,
      UNITLAYERS,
      ARTIFACTS: emptyArtifactLayers,
      MARKS: {},
      TURN: step.TURN + 1,
      NEXTSPAWNID: step.NEXTSPAWNID,
      TURNVARS: {}
    };
  };
  game.instruction.start1 = step => {
    return { text: "Select a unit to move and dig with" };
  };
  game.action.move1 = step => {
    let LINKS: AlgolStepLinks = { actions: {} };
    let ARTIFACTS = {
      movetargets: step.ARTIFACTS.movetargets,
      digtargets: {}
    };
    let UNITLAYERS = step.UNITLAYERS;
    let TURNVARS = { ...step.TURNVARS };

    let UNITDATA = { ...step.UNITDATA };
    let NEXTSPAWNID = step.NEXTSPAWNID;
    let MARKS = step.MARKS;
    TURNVARS.movedto = MARKS.selectmovetarget;
    TURNVARS.heightfrom = (UNITLAYERS.units[MARKS.selectunit] || {}).group;
    TURNVARS.heightto = (UNITLAYERS.units[MARKS.selectmovetarget] || {}).group;
    {
      let unitid = (UNITLAYERS.units[MARKS.selectunit] || {}).id;
      if (unitid) {
        UNITDATA[unitid] = {
          ...UNITDATA[unitid],
          group: TURNVARS["heightto"]
        };
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
    {
      let newunitid = "spawn" + NEXTSPAWNID++;
      UNITDATA[newunitid] = {
        pos: MARKS.selectunit,
        id: newunitid,
        group: TURNVARS["heightfrom"],
        owner: 0
      };
    }
    UNITLAYERS = {
      units: {},
      myunits: {},
      oppunits: {},
      neutralunits: {},
      pawns: {},
      mypawns: {},
      opppawns: {},
      knights: {},
      myknights: {},
      oppknights: {},
      rooks: {},
      myrooks: {},
      opprooks: {}
    };
    for (let unitid in UNITDATA) {
      const currentunit = UNITDATA[unitid];
      const { group, pos, owner } = currentunit;
      for (const layer of groupLayers[group][owner]) {
        UNITLAYERS[layer][pos] = currentunit;
      }
    }
    {
      let startconnections = connections[TURNVARS["movedto"]];
      for (let DIR of roseDirs) {
        let POS = startconnections[DIR];
        if (POS && UNITLAYERS.neutralunits[POS]) {
          ARTIFACTS.digtargets[POS] = emptyObj;
        }
      }
    }
    for (const pos of Object.keys(ARTIFACTS.digtargets)) {
      LINKS.actions[pos] = "selectdigtarget1";
    }

    return {
      LINKS,
      MARKS: {},
      ARTIFACTS,
      TURN: step.TURN,
      UNITDATA,
      UNITLAYERS,
      TURNVARS,

      NEXTSPAWNID
    };
  };
  game.instruction.move1 = step => {
    return { text: "Now select an empty neighbouring square to dig" };
  };
  game.action.dig1 = step => {
    let LINKS: AlgolStepLinks = { actions: {} };
    let ARTIFACTS = {
      movetargets: step.ARTIFACTS.movetargets,
      digtargets: step.ARTIFACTS.digtargets,
      winline: {}
    };
    let UNITLAYERS = step.UNITLAYERS;
    let UNITDATA = { ...step.UNITDATA };
    let MARKS = step.MARKS;
    if (UNITLAYERS.pawns[MARKS.selectdigtarget]) {
      delete UNITDATA[(UNITLAYERS.units[MARKS.selectdigtarget] || {}).id];
    } else {
      {
        let unitid = (UNITLAYERS.units[MARKS.selectdigtarget] || {}).id;
        if (unitid) {
          UNITDATA[unitid] = {
            ...UNITDATA[unitid],
            group: UNITLAYERS.knights[MARKS.selectdigtarget]
              ? "pawns"
              : "knights"
          };
        }
      }
    }
    UNITLAYERS = {
      units: {},
      myunits: {},
      oppunits: {},
      neutralunits: {},
      pawns: {},
      mypawns: {},
      opppawns: {},
      knights: {},
      myknights: {},
      oppknights: {},
      rooks: {},
      myrooks: {},
      opprooks: {}
    };
    for (let unitid in UNITDATA) {
      const currentunit = UNITDATA[unitid];
      const { group, pos, owner } = currentunit;
      for (const layer of groupLayers[group][owner]) {
        UNITLAYERS[layer][pos] = currentunit;
      }
    }
    {
      for (let STARTPOS in UNITLAYERS.myunits) {
        let allowedsteps = UNITLAYERS.myrooks[STARTPOS]
          ? UNITLAYERS.myrooks
          : UNITLAYERS.myknights[STARTPOS]
          ? UNITLAYERS.myknights
          : UNITLAYERS.mypawns;

        for (let DIR of roseDirs) {
          let walkedsquares = [];
          let POS = "faux";
          connections.faux[DIR] = STARTPOS;
          while ((POS = connections[POS][DIR]) && allowedsteps[POS]) {
            walkedsquares.push(POS);
          }
          let WALKLENGTH = walkedsquares.length;
          for (let walkstepper = 0; walkstepper < WALKLENGTH; walkstepper++) {
            POS = walkedsquares[walkstepper];
            if (WALKLENGTH > 2) {
              ARTIFACTS.winline[POS] = emptyObj;
            }
          }
        }
      }
    }

    if (Object.keys(ARTIFACTS.winline).length !== 0) {
      let winner = 1;
      LINKS.endGame = winner === 1 ? "win" : winner ? "lose" : "draw";
      LINKS.endedBy = "madeline";
      LINKS.endMarks = Object.keys(ARTIFACTS.winline);
    } else {
      LINKS.endturn = "start2";
    }
    return {
      LINKS,
      MARKS: {},
      ARTIFACTS,
      TURN: step.TURN,
      UNITDATA,
      UNITLAYERS,
      TURNVARS: step.TURNVARS,

      NEXTSPAWNID: step.NEXTSPAWNID
    };
  };
  game.instruction.dig1 = () => defaultInstruction(1);
  game.action.selectunit1 = (step, newMarkPos) => {
    let ARTIFACTS = {
      movetargets: {}
    };
    let LINKS: AlgolStepLinks = { actions: {} };
    let MARKS = {
      selectunit: newMarkPos
    };
    let UNITLAYERS = step.UNITLAYERS;
    {
      let startconnections = connections[MARKS.selectunit];
      for (let DIR of roseDirs) {
        let POS = startconnections[DIR];
        if (
          POS &&
          (UNITLAYERS.rooks[MARKS.selectunit]
            ? !UNITLAYERS.pawns[POS]
            : UNITLAYERS.pawns[MARKS.selectunit]
            ? !UNITLAYERS.rooks[POS]
            : true)
        ) {
          if (UNITLAYERS.neutralunits[POS]) {
            ARTIFACTS.movetargets[POS] = emptyObj;
          }
        }
      }
    }
    for (const pos of Object.keys(ARTIFACTS.movetargets)) {
      LINKS.actions[pos] = "selectmovetarget1";
    }

    return {
      LINKS,
      ARTIFACTS,
      UNITLAYERS,
      UNITDATA: step.UNITDATA,
      TURN: step.TURN,
      MARKS,
      TURNVARS: step.TURNVARS,

      NEXTSPAWNID: step.NEXTSPAWNID
    };
  };
  game.instruction.selectunit1 = step => {
    return { text: "Select where to move this unit" };
  };
  game.action.selectmovetarget1 = (step, newMarkPos) => {
    let LINKS: AlgolStepLinks = { actions: {} };

    LINKS.actions.move = "move1";

    return {
      LINKS,
      ARTIFACTS: step.ARTIFACTS,
      UNITLAYERS: step.UNITLAYERS,
      UNITDATA: step.UNITDATA,
      TURN: step.TURN,
      MARKS: {
        selectunit: step.MARKS.selectunit,
        selectmovetarget: newMarkPos
      },
      TURNVARS: step.TURNVARS,

      NEXTSPAWNID: step.NEXTSPAWNID
    };
  };
  game.instruction.selectmovetarget1 = step => {
    let MARKS = step.MARKS;

    let UNITLAYERS = step.UNITLAYERS;

    return collapseContent({
      line: [
        { text: "Press" },
        { command: "move" },
        { text: "to" },
        (UNITLAYERS.units[MARKS.selectunit] || {}).group ===
        (UNITLAYERS.units[MARKS.selectmovetarget] || {}).group
          ? { text: "walk" }
          : UNITLAYERS.rooks[MARKS.selectunit] ||
            UNITLAYERS.pawns[MARKS.selectmovetarget]
          ? { text: "descend" }
          : { text: "climb" },
        { text: "from" },
        { pos: MARKS.selectunit },
        { text: "to" },
        { pos: MARKS.selectmovetarget }
      ]
    });
  };
  game.action.selectdigtarget1 = (step, newMarkPos) => {
    let LINKS: AlgolStepLinks = { actions: {} };

    LINKS.actions.dig = "dig1";

    return {
      LINKS,
      ARTIFACTS: step.ARTIFACTS,
      UNITLAYERS: step.UNITLAYERS,
      UNITDATA: step.UNITDATA,
      TURN: step.TURN,
      MARKS: { selectdigtarget: newMarkPos },
      TURNVARS: step.TURNVARS,

      NEXTSPAWNID: step.NEXTSPAWNID
    };
  };
  game.instruction.selectdigtarget1 = step => {
    let MARKS = step.MARKS;

    let UNITLAYERS = step.UNITLAYERS;

    return UNITLAYERS.rooks[MARKS.selectdigtarget]
      ? collapseContent({
          line: [
            { text: "Press" },
            { command: "dig" },
            { text: "to lower" },
            { pos: MARKS.selectdigtarget },
            { text: "from level 3 to level 2" }
          ]
        })
      : UNITLAYERS.knights[MARKS.selectdigtarget]
      ? collapseContent({
          line: [
            { text: "Press" },
            { command: "dig" },
            { text: "to lower" },
            { pos: MARKS.selectdigtarget },
            { text: "from level 2 to level 1" }
          ]
        })
      : collapseContent({
          line: [
            { text: "Press" },
            { command: "dig" },
            { text: "to destroy" },
            { pos: MARKS.selectdigtarget }
          ]
        });
  };
}
{
  const groupLayers = {
    pawns: [
      ["units", "neutralunits", "pawns"],
      ["units", "oppunits", "pawns", "opppawns"],
      ["units", "myunits", "pawns", "mypawns"]
    ],
    knights: [
      ["units", "neutralunits", "knights"],
      ["units", "oppunits", "knights", "oppknights"],
      ["units", "myunits", "knights", "myknights"]
    ],
    rooks: [
      ["units", "neutralunits", "rooks"],
      ["units", "oppunits", "rooks", "opprooks"],
      ["units", "myunits", "rooks", "myrooks"]
    ]
  };
  game.action.start2 = step => {
    const oldUnitLayers = step.UNITLAYERS;
    let UNITLAYERS = {
      units: oldUnitLayers.units,
      myunits: oldUnitLayers.oppunits,
      oppunits: oldUnitLayers.myunits,
      neutralunits: oldUnitLayers.neutralunits,
      pawns: oldUnitLayers.pawns,
      mypawns: oldUnitLayers.opppawns,
      opppawns: oldUnitLayers.mypawns,
      knights: oldUnitLayers.knights,
      myknights: oldUnitLayers.oppknights,
      oppknights: oldUnitLayers.myknights,
      rooks: oldUnitLayers.rooks,
      myrooks: oldUnitLayers.opprooks,
      opprooks: oldUnitLayers.myrooks
    };
    let LINKS: AlgolStepLinks = {
      actions: {}
    };

    for (const pos of Object.keys(UNITLAYERS.myunits)) {
      LINKS.actions[pos] = "selectunit2";
    }

    return {
      UNITDATA: step.UNITDATA,
      LINKS,
      UNITLAYERS,
      ARTIFACTS: emptyArtifactLayers,
      MARKS: {},
      TURN: step.TURN + 1,
      NEXTSPAWNID: step.NEXTSPAWNID,
      TURNVARS: {}
    };
  };
  game.instruction.start2 = step => {
    return { text: "Select a unit to move and dig with" };
  };
  game.newBattle = () => {
    let UNITDATA = {
      unit1: { pos: "a2", x: 1, y: 2, id: "unit1", group: "rooks", owner: 0 },
      unit2: { pos: "a3", x: 1, y: 3, id: "unit2", group: "rooks", owner: 0 },
      unit3: { pos: "b2", x: 2, y: 2, id: "unit3", group: "rooks", owner: 0 },
      unit4: { pos: "b3", x: 2, y: 3, id: "unit4", group: "rooks", owner: 0 },
      unit5: { pos: "c2", x: 3, y: 2, id: "unit5", group: "rooks", owner: 0 },
      unit6: { pos: "c3", x: 3, y: 3, id: "unit6", group: "rooks", owner: 0 },
      unit7: { pos: "d2", x: 4, y: 2, id: "unit7", group: "rooks", owner: 0 },
      unit8: { pos: "d3", x: 4, y: 3, id: "unit8", group: "rooks", owner: 0 },
      unit9: { pos: "b4", x: 2, y: 4, id: "unit9", group: "rooks", owner: 0 },
      unit10: { pos: "c1", x: 3, y: 1, id: "unit10", group: "rooks", owner: 0 },
      unit11: { pos: "a1", x: 1, y: 1, id: "unit11", group: "rooks", owner: 1 },
      unit12: { pos: "c4", x: 3, y: 4, id: "unit12", group: "rooks", owner: 1 },
      unit13: { pos: "d1", x: 4, y: 1, id: "unit13", group: "rooks", owner: 1 },
      unit14: { pos: "a4", x: 1, y: 4, id: "unit14", group: "rooks", owner: 2 },
      unit15: { pos: "b1", x: 2, y: 1, id: "unit15", group: "rooks", owner: 2 },
      unit16: { pos: "d4", x: 4, y: 4, id: "unit16", group: "rooks", owner: 2 }
    };

    let UNITLAYERS = {
      units: {},
      myunits: {},
      oppunits: {},
      neutralunits: {},
      pawns: {},
      mypawns: {},
      opppawns: {},
      knights: {},
      myknights: {},
      oppknights: {},
      rooks: {},
      myrooks: {},
      opprooks: {}
    };
    for (let unitid in UNITDATA) {
      const currentunit = UNITDATA[unitid];
      const { group, pos, owner } = currentunit;
      for (const layer of groupLayers[group][owner]) {
        UNITLAYERS[layer][pos] = currentunit;
      }
    }

    return game.action.start1({
      NEXTSPAWNID: 1,

      TURN: 0,
      UNITDATA,
      UNITLAYERS
    });
  };
  game.action.move2 = step => {
    let LINKS: AlgolStepLinks = { actions: {} };
    let ARTIFACTS = {
      movetargets: step.ARTIFACTS.movetargets,
      digtargets: {}
    };
    let UNITLAYERS = step.UNITLAYERS;
    let TURNVARS = { ...step.TURNVARS };

    let UNITDATA = { ...step.UNITDATA };
    let NEXTSPAWNID = step.NEXTSPAWNID;
    let MARKS = step.MARKS;
    TURNVARS.movedto = MARKS.selectmovetarget;
    TURNVARS.heightfrom = (UNITLAYERS.units[MARKS.selectunit] || {}).group;
    TURNVARS.heightto = (UNITLAYERS.units[MARKS.selectmovetarget] || {}).group;
    {
      let unitid = (UNITLAYERS.units[MARKS.selectunit] || {}).id;
      if (unitid) {
        UNITDATA[unitid] = {
          ...UNITDATA[unitid],
          group: TURNVARS["heightto"]
        };
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
    {
      let newunitid = "spawn" + NEXTSPAWNID++;
      UNITDATA[newunitid] = {
        pos: MARKS.selectunit,
        id: newunitid,
        group: TURNVARS["heightfrom"],
        owner: 0
      };
    }
    UNITLAYERS = {
      units: {},
      myunits: {},
      oppunits: {},
      neutralunits: {},
      pawns: {},
      mypawns: {},
      opppawns: {},
      knights: {},
      myknights: {},
      oppknights: {},
      rooks: {},
      myrooks: {},
      opprooks: {}
    };
    for (let unitid in UNITDATA) {
      const currentunit = UNITDATA[unitid];
      const { group, pos, owner } = currentunit;
      for (const layer of groupLayers[group][owner]) {
        UNITLAYERS[layer][pos] = currentunit;
      }
    }
    {
      let startconnections = connections[TURNVARS["movedto"]];
      for (let DIR of roseDirs) {
        let POS = startconnections[DIR];
        if (POS && UNITLAYERS.neutralunits[POS]) {
          ARTIFACTS.digtargets[POS] = emptyObj;
        }
      }
    }
    for (const pos of Object.keys(ARTIFACTS.digtargets)) {
      LINKS.actions[pos] = "selectdigtarget2";
    }

    return {
      LINKS,
      MARKS: {},
      ARTIFACTS,
      TURN: step.TURN,
      UNITDATA,
      UNITLAYERS,
      TURNVARS,

      NEXTSPAWNID
    };
  };
  game.instruction.move2 = step => {
    return { text: "Now select an empty neighbouring square to dig" };
  };
  game.action.dig2 = step => {
    let LINKS: AlgolStepLinks = { actions: {} };
    let ARTIFACTS = {
      movetargets: step.ARTIFACTS.movetargets,
      digtargets: step.ARTIFACTS.digtargets,
      winline: {}
    };
    let UNITLAYERS = step.UNITLAYERS;
    let UNITDATA = { ...step.UNITDATA };
    let MARKS = step.MARKS;
    if (UNITLAYERS.pawns[MARKS.selectdigtarget]) {
      delete UNITDATA[(UNITLAYERS.units[MARKS.selectdigtarget] || {}).id];
    } else {
      {
        let unitid = (UNITLAYERS.units[MARKS.selectdigtarget] || {}).id;
        if (unitid) {
          UNITDATA[unitid] = {
            ...UNITDATA[unitid],
            group: UNITLAYERS.knights[MARKS.selectdigtarget]
              ? "pawns"
              : "knights"
          };
        }
      }
    }
    UNITLAYERS = {
      units: {},
      myunits: {},
      oppunits: {},
      neutralunits: {},
      pawns: {},
      mypawns: {},
      opppawns: {},
      knights: {},
      myknights: {},
      oppknights: {},
      rooks: {},
      myrooks: {},
      opprooks: {}
    };
    for (let unitid in UNITDATA) {
      const currentunit = UNITDATA[unitid];
      const { group, pos, owner } = currentunit;
      for (const layer of groupLayers[group][owner]) {
        UNITLAYERS[layer][pos] = currentunit;
      }
    }
    {
      for (let STARTPOS in UNITLAYERS.myunits) {
        let allowedsteps = UNITLAYERS.myrooks[STARTPOS]
          ? UNITLAYERS.myrooks
          : UNITLAYERS.myknights[STARTPOS]
          ? UNITLAYERS.myknights
          : UNITLAYERS.mypawns;

        for (let DIR of roseDirs) {
          let walkedsquares = [];
          let POS = "faux";
          connections.faux[DIR] = STARTPOS;
          while ((POS = connections[POS][DIR]) && allowedsteps[POS]) {
            walkedsquares.push(POS);
          }
          let WALKLENGTH = walkedsquares.length;
          for (let walkstepper = 0; walkstepper < WALKLENGTH; walkstepper++) {
            POS = walkedsquares[walkstepper];
            if (WALKLENGTH > 2) {
              ARTIFACTS.winline[POS] = emptyObj;
            }
          }
        }
      }
    }

    if (Object.keys(ARTIFACTS.winline).length !== 0) {
      let winner = 2;
      LINKS.endGame = winner === 2 ? "win" : winner ? "lose" : "draw";
      LINKS.endedBy = "madeline";
      LINKS.endMarks = Object.keys(ARTIFACTS.winline);
    } else {
      LINKS.endturn = "start1";
    }
    return {
      LINKS,
      MARKS: {},
      ARTIFACTS,
      TURN: step.TURN,
      UNITDATA,
      UNITLAYERS,
      TURNVARS: step.TURNVARS,

      NEXTSPAWNID: step.NEXTSPAWNID
    };
  };
  game.instruction.dig2 = () => defaultInstruction(2);
  game.action.selectunit2 = (step, newMarkPos) => {
    let ARTIFACTS = {
      movetargets: {}
    };
    let LINKS: AlgolStepLinks = { actions: {} };
    let MARKS = {
      selectunit: newMarkPos
    };
    let UNITLAYERS = step.UNITLAYERS;
    {
      let startconnections = connections[MARKS.selectunit];
      for (let DIR of roseDirs) {
        let POS = startconnections[DIR];
        if (
          POS &&
          (UNITLAYERS.rooks[MARKS.selectunit]
            ? !UNITLAYERS.pawns[POS]
            : UNITLAYERS.pawns[MARKS.selectunit]
            ? !UNITLAYERS.rooks[POS]
            : true)
        ) {
          if (UNITLAYERS.neutralunits[POS]) {
            ARTIFACTS.movetargets[POS] = emptyObj;
          }
        }
      }
    }
    for (const pos of Object.keys(ARTIFACTS.movetargets)) {
      LINKS.actions[pos] = "selectmovetarget2";
    }

    return {
      LINKS,
      ARTIFACTS,
      UNITLAYERS,
      UNITDATA: step.UNITDATA,
      TURN: step.TURN,
      MARKS,
      TURNVARS: step.TURNVARS,

      NEXTSPAWNID: step.NEXTSPAWNID
    };
  };
  game.instruction.selectunit2 = step => {
    return { text: "Select where to move this unit" };
  };
  game.action.selectmovetarget2 = (step, newMarkPos) => {
    let LINKS: AlgolStepLinks = { actions: {} };

    LINKS.actions.move = "move2";

    return {
      LINKS,
      ARTIFACTS: step.ARTIFACTS,
      UNITLAYERS: step.UNITLAYERS,
      UNITDATA: step.UNITDATA,
      TURN: step.TURN,
      MARKS: {
        selectunit: step.MARKS.selectunit,
        selectmovetarget: newMarkPos
      },
      TURNVARS: step.TURNVARS,

      NEXTSPAWNID: step.NEXTSPAWNID
    };
  };
  game.instruction.selectmovetarget2 = step => {
    let MARKS = step.MARKS;

    let UNITLAYERS = step.UNITLAYERS;

    return collapseContent({
      line: [
        { text: "Press" },
        { command: "move" },
        { text: "to" },
        (UNITLAYERS.units[MARKS.selectunit] || {}).group ===
        (UNITLAYERS.units[MARKS.selectmovetarget] || {}).group
          ? { text: "walk" }
          : UNITLAYERS.rooks[MARKS.selectunit] ||
            UNITLAYERS.pawns[MARKS.selectmovetarget]
          ? { text: "descend" }
          : { text: "climb" },
        { text: "from" },
        { pos: MARKS.selectunit },
        { text: "to" },
        { pos: MARKS.selectmovetarget }
      ]
    });
  };
  game.action.selectdigtarget2 = (step, newMarkPos) => {
    let LINKS: AlgolStepLinks = { actions: {} };

    LINKS.actions.dig = "dig2";

    return {
      LINKS,
      ARTIFACTS: step.ARTIFACTS,
      UNITLAYERS: step.UNITLAYERS,
      UNITDATA: step.UNITDATA,
      TURN: step.TURN,
      MARKS: { selectdigtarget: newMarkPos },
      TURNVARS: step.TURNVARS,

      NEXTSPAWNID: step.NEXTSPAWNID
    };
  };
  game.instruction.selectdigtarget2 = step => {
    let MARKS = step.MARKS;

    let UNITLAYERS = step.UNITLAYERS;

    return UNITLAYERS.rooks[MARKS.selectdigtarget]
      ? collapseContent({
          line: [
            { text: "Press" },
            { command: "dig" },
            { text: "to lower" },
            { pos: MARKS.selectdigtarget },
            { text: "from level 3 to level 2" }
          ]
        })
      : UNITLAYERS.knights[MARKS.selectdigtarget]
      ? collapseContent({
          line: [
            { text: "Press" },
            { command: "dig" },
            { text: "to lower" },
            { pos: MARKS.selectdigtarget },
            { text: "from level 2 to level 1" }
          ]
        })
      : collapseContent({
          line: [
            { text: "Press" },
            { command: "dig" },
            { text: "to destroy" },
            { pos: MARKS.selectdigtarget }
          ]
        });
  };
}
export default game as AlgolGame;
