import {
  offsetPos,
  whoWins,
  boardConnections,
  makeRelativeDirs,
  setup2army,
  coords2pos,
  boardLayers,
  terrainLayers,
  collapseContent,
  defaultInstruction,
  roseDirs,
  orthoDirs,
  diagDirs,
  knightDirs,
  jumpTwoDirs,
  ringTwoDirs
} from "../../common";
import boards from "../../games/definitions/desdemona/boards";
import setups from "../../games/definitions/desdemona/setups";
import variants from "../../games/definitions/desdemona/variants";
const emptyObj = {};
const iconMapping = { amazons: "queen", stones: "pawn" };
let TERRAIN1, TERRAIN2, connections, relativeDirs, BOARD, dimensions;
const groupLayers1 = {
  amazons: [
    ["units"],
    ["units", "myunits", "myamazons"],
    ["units", "oppunits", "oppamazons"]
  ],
  stones: [
    ["units", "stones"],
    ["units", "myunits", "stones", "mystones"],
    ["units", "oppunits", "stones", "oppstones"]
  ]
};
const groupLayers2 = {
  amazons: [
    ["units"],
    ["units", "oppunits", "oppamazons"],
    ["units", "myunits", "myamazons"]
  ],
  stones: [
    ["units", "stones"],
    ["units", "oppunits", "stones", "oppstones"],
    ["units", "myunits", "stones", "mystones"]
  ]
};
const prefixes1 = ["neutral", "my", "opp"];
const prefixes2 = ["neutral", "opp", "my"];
const emptyArtifactLayers_pie = {
  movetargets: {},
  firetargets: {},
  capturespot: {},
  victims: {},
  oppmovers: {},
  reachablesquares: {},
  capturestarts: {},
  capturers: {}
};
const emptyArtifactLayers_basic = {
  movetargets: {},
  firetargets: {},
  capturespot: {},
  victims: {},
  oppmovers: {},
  reachablesquares: {},
  capturestarts: {},
  capturers: {}
};
const game = {
  gameId: "desdemona",
  commands: { move: {}, fire: {} },
  iconMap: iconMapping,
  setBoard: board => {
    TERRAIN1 = terrainLayers(board, 1);
    TERRAIN2 = terrainLayers(board, 2);
    dimensions = { height: board.height, width: board.width };
    BOARD = boardLayers(dimensions);
    connections = boardConnections(board);
    relativeDirs = makeRelativeDirs(board);
  },
  newBattle: (setup, ruleset) => {
    let UNITDATA = setup2army(setup);
    let UNITLAYERS = {
      units: {},
      myunits: {},
      oppunits: {},
      myamazons: {},
      oppamazons: {},
      stones: {},
      mystones: {},
      oppstones: {}
    };
    for (let unitid in UNITDATA) {
      const currentunit = UNITDATA[unitid];
      const { group, pos, owner } = currentunit;
      for (const layer of groupLayers2[group][owner]) {
        UNITLAYERS[layer][pos] = currentunit;
      }
    }
    return game.action[`startTurn_${ruleset}_1`]({
      NEXTSPAWNID: 1,
      TURN: 0,
      UNITDATA,
      UNITLAYERS
    });
  },
  action: {
    startTurn_pie_1: step => {
      const oldUnitLayers = step.UNITLAYERS;
      let UNITLAYERS = {
        units: oldUnitLayers.units,
        myunits: oldUnitLayers.oppunits,
        oppunits: oldUnitLayers.myunits,
        myamazons: oldUnitLayers.oppamazons,
        oppamazons: oldUnitLayers.myamazons,
        stones: oldUnitLayers.stones,
        mystones: oldUnitLayers.oppstones,
        oppstones: oldUnitLayers.mystones
      };
      let LINKS = {
        marks: {},
        commands: {}
      };
      for (const pos of Object.keys(UNITLAYERS.myamazons)) {
        LINKS.marks[pos] = "selectunit_pie_1";
      }
      return {
        UNITDATA: step.UNITDATA,
        LINKS,
        UNITLAYERS,
        ARTIFACTS: emptyArtifactLayers_pie,
        MARKS: {},
        TURN: step.TURN + 1,
        NEXTSPAWNID: step.NEXTSPAWNID,
        TURNVARS: {}
      };
    },
    startTurn_pie_2: step => {
      const oldUnitLayers = step.UNITLAYERS;
      let UNITLAYERS = {
        units: oldUnitLayers.units,
        myunits: oldUnitLayers.oppunits,
        oppunits: oldUnitLayers.myunits,
        myamazons: oldUnitLayers.oppamazons,
        oppamazons: oldUnitLayers.myamazons,
        stones: oldUnitLayers.stones,
        mystones: oldUnitLayers.oppstones,
        oppstones: oldUnitLayers.mystones
      };
      let LINKS = {
        marks: {},
        commands: {}
      };
      for (const pos of Object.keys(UNITLAYERS.myamazons)) {
        LINKS.marks[pos] = "selectunit_pie_2";
      }
      return {
        UNITDATA: step.UNITDATA,
        LINKS,
        UNITLAYERS,
        ARTIFACTS: emptyArtifactLayers_pie,
        MARKS: {},
        TURN: step.TURN,
        NEXTSPAWNID: step.NEXTSPAWNID,
        TURNVARS: {}
      };
    },
    startTurn_basic_1: step => {
      const oldUnitLayers = step.UNITLAYERS;
      let UNITLAYERS = {
        units: oldUnitLayers.units,
        myunits: oldUnitLayers.oppunits,
        oppunits: oldUnitLayers.myunits,
        myamazons: oldUnitLayers.oppamazons,
        oppamazons: oldUnitLayers.myamazons,
        stones: oldUnitLayers.stones,
        mystones: oldUnitLayers.oppstones,
        oppstones: oldUnitLayers.mystones
      };
      let LINKS = {
        marks: {},
        commands: {}
      };
      for (const pos of Object.keys(UNITLAYERS.myamazons)) {
        LINKS.marks[pos] = "selectunit_basic_1";
      }
      return {
        UNITDATA: step.UNITDATA,
        LINKS,
        UNITLAYERS,
        ARTIFACTS: emptyArtifactLayers_basic,
        MARKS: {},
        TURN: step.TURN + 1,
        NEXTSPAWNID: step.NEXTSPAWNID,
        TURNVARS: {}
      };
    },
    startTurn_basic_2: step => {
      const oldUnitLayers = step.UNITLAYERS;
      let UNITLAYERS = {
        units: oldUnitLayers.units,
        myunits: oldUnitLayers.oppunits,
        oppunits: oldUnitLayers.myunits,
        myamazons: oldUnitLayers.oppamazons,
        oppamazons: oldUnitLayers.myamazons,
        stones: oldUnitLayers.stones,
        mystones: oldUnitLayers.oppstones,
        oppstones: oldUnitLayers.mystones
      };
      let LINKS = {
        marks: {},
        commands: {}
      };
      for (const pos of Object.keys(UNITLAYERS.myamazons)) {
        LINKS.marks[pos] = "selectunit_basic_2";
      }
      return {
        UNITDATA: step.UNITDATA,
        LINKS,
        UNITLAYERS,
        ARTIFACTS: emptyArtifactLayers_basic,
        MARKS: {},
        TURN: step.TURN,
        NEXTSPAWNID: step.NEXTSPAWNID,
        TURNVARS: {}
      };
    },
    selectunit_pie_1: (step, newMarkPos) => {
      let ARTIFACTS = {
        movetargets: {},
        capturers: {},
        capturestarts: {}
      };
      let LINKS = { marks: {}, commands: {} };
      let MARKS = {
        selectunit: newMarkPos
      };
      let UNITLAYERS = step.UNITLAYERS;
      {
        let BLOCKS = UNITLAYERS.units;
        for (let DIR of roseDirs) {
          let POS = MARKS.selectunit || MARKS.selectcapturer;
          while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
            ARTIFACTS.movetargets[POS] = emptyObj;
          }
        }
      }
      if (false) {
        {
          let BLOCKS = UNITLAYERS.myamazons;
          for (let STARTPOS in ARTIFACTS.capturestarts) {
            for (let DIR of roseDirs) {
              let POS = STARTPOS;
              while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {}
              if (BLOCKS[POS]) {
                ARTIFACTS.capturers[POS] = emptyObj;
              }
            }
          }
        }
      }
      if (false) {
        {
          let allowedsteps = UNITLAYERS.oppstones;
          let BLOCKS = Object.keys(BOARD.board)
            .filter(k => !UNITLAYERS.units.hasOwnProperty(k))
            .reduce((m, k) => {
              m[k] = emptyObj;
              return m;
            }, {});
          for (let STARTPOS in ARTIFACTS.reachablesquares) {
            for (let DIR of roseDirs) {
              let walkedsquares = [];
              let STOPREASON = "";
              let POS = STARTPOS;
              while (
                !(STOPREASON = !(POS = connections[POS][DIR])
                  ? "outofbounds"
                  : BLOCKS[POS]
                  ? "hitblock"
                  : !allowedsteps[POS]
                  ? "nomoresteps"
                  : null)
              ) {
                walkedsquares.push(POS);
              }
              let WALKLENGTH = walkedsquares.length;
              POS = STARTPOS;
              if (!!WALKLENGTH && STOPREASON === "hitblock") {
                ARTIFACTS.capturestarts[POS] = emptyObj;
              }
            }
          }
        }
      }
      for (const pos of Object.keys(ARTIFACTS.movetargets)) {
        LINKS.marks[pos] = "selectmovetarget_pie_1";
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
    },
    selectmovetarget_pie_1: (step, newMarkPos) => {
      let LINKS = { marks: {}, commands: {} };
      LINKS.commands.move = "move_pie_1";
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
        NEXTSPAWNID: step.NEXTSPAWNID,
        canAlwaysEnd: true
      };
    },
    selectfiretarget_pie_1: (step, newMarkPos) => {
      let ARTIFACTS = {
        movetargets: step.ARTIFACTS.movetargets,
        capturers: step.ARTIFACTS.capturers,
        capturestarts: step.ARTIFACTS.capturestarts,
        firetargets: step.ARTIFACTS.firetargets,
        capturespot: step.ARTIFACTS.capturespot,
        victims: {}
      };
      let LINKS = { marks: {}, commands: {} };
      let MARKS = {
        selectfiretarget: newMarkPos
      };
      let UNITLAYERS = step.UNITLAYERS;
      if (ARTIFACTS.capturespot[MARKS.selectfiretarget]) {
        {
          let allowedsteps = UNITLAYERS.oppstones;
          let STARTPOS = MARKS.selectfiretarget;
          let POS = STARTPOS;
          while (
            (POS =
              connections[POS][
                relativeDirs[(ARTIFACTS.capturespot[STARTPOS] || {}).dir][5]
              ]) &&
            allowedsteps[POS]
          ) {
            ARTIFACTS.victims[POS] = emptyObj;
          }
        }
      }
      LINKS.commands.fire = "fire_pie_1";
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
    },
    selectcapturer_pie_1: (step, newMarkPos) => {
      let ARTIFACTS = {
        movetargets: { ...step.ARTIFACTS.movetargets },
        capturers: step.ARTIFACTS.capturers,
        capturestarts: step.ARTIFACTS.capturestarts,
        firetargets: step.ARTIFACTS.firetargets,
        capturespot: step.ARTIFACTS.capturespot,
        victims: step.ARTIFACTS.victims,
        oppmovers: step.ARTIFACTS.oppmovers,
        reachablesquares: step.ARTIFACTS.reachablesquares
      };
      let LINKS = { marks: {}, commands: {} };
      let MARKS = {
        selectcapturer: newMarkPos
      };
      let UNITLAYERS = step.UNITLAYERS;
      {
        let BLOCKS = UNITLAYERS.units;
        for (let DIR of roseDirs) {
          let POS = MARKS.selectunit || MARKS.selectcapturer;
          while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
            ARTIFACTS.movetargets[POS] = emptyObj;
          }
        }
      }
      for (const pos of Object.keys(
        Object.entries(
          Object.keys(ARTIFACTS.capturestarts)
            .concat(Object.keys(ARTIFACTS.movetargets))
            .reduce((mem, k) => {
              mem[k] = (mem[k] || 0) + 1;
              return mem;
            }, {})
        )
          .filter(([key, n]) => n === 2)
          .reduce((mem, [key]) => {
            mem[key] = emptyObj;
            return mem;
          }, {})
      )) {
        LINKS.marks[pos] = "selectcapturestart_pie_1";
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
    },
    selectcapturestart_pie_1: (step, newMarkPos) => {
      let LINKS = { marks: {}, commands: {} };
      LINKS.commands.move = "move_pie_1";
      return {
        LINKS,
        ARTIFACTS: step.ARTIFACTS,
        UNITLAYERS: step.UNITLAYERS,
        UNITDATA: step.UNITDATA,
        TURN: step.TURN,
        MARKS: {
          selectcapturer: step.MARKS.selectcapturer,
          selectcapturestart: newMarkPos
        },
        TURNVARS: step.TURNVARS,
        NEXTSPAWNID: step.NEXTSPAWNID
      };
    },
    selectunit_pie_2: (step, newMarkPos) => {
      let ARTIFACTS = {
        movetargets: {},
        capturers: {},
        capturestarts: {}
      };
      let LINKS = { marks: {}, commands: {} };
      let MARKS = {
        selectunit: newMarkPos
      };
      let UNITLAYERS = step.UNITLAYERS;
      {
        let BLOCKS = UNITLAYERS.units;
        for (let DIR of roseDirs) {
          let POS = MARKS.selectunit || MARKS.selectcapturer;
          while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
            ARTIFACTS.movetargets[POS] = emptyObj;
          }
        }
      }
      if (false) {
        {
          let BLOCKS = UNITLAYERS.myamazons;
          for (let STARTPOS in ARTIFACTS.capturestarts) {
            for (let DIR of roseDirs) {
              let POS = STARTPOS;
              while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {}
              if (BLOCKS[POS]) {
                ARTIFACTS.capturers[POS] = emptyObj;
              }
            }
          }
        }
      }
      if (false) {
        {
          let allowedsteps = UNITLAYERS.oppstones;
          let BLOCKS = Object.keys(BOARD.board)
            .filter(k => !UNITLAYERS.units.hasOwnProperty(k))
            .reduce((m, k) => {
              m[k] = emptyObj;
              return m;
            }, {});
          for (let STARTPOS in ARTIFACTS.reachablesquares) {
            for (let DIR of roseDirs) {
              let walkedsquares = [];
              let STOPREASON = "";
              let POS = STARTPOS;
              while (
                !(STOPREASON = !(POS = connections[POS][DIR])
                  ? "outofbounds"
                  : BLOCKS[POS]
                  ? "hitblock"
                  : !allowedsteps[POS]
                  ? "nomoresteps"
                  : null)
              ) {
                walkedsquares.push(POS);
              }
              let WALKLENGTH = walkedsquares.length;
              POS = STARTPOS;
              if (!!WALKLENGTH && STOPREASON === "hitblock") {
                ARTIFACTS.capturestarts[POS] = emptyObj;
              }
            }
          }
        }
      }
      for (const pos of Object.keys(ARTIFACTS.movetargets)) {
        LINKS.marks[pos] = "selectmovetarget_pie_2";
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
    },
    selectmovetarget_pie_2: (step, newMarkPos) => {
      let LINKS = { marks: {}, commands: {} };
      LINKS.commands.move = "move_pie_2";
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
        NEXTSPAWNID: step.NEXTSPAWNID,
        canAlwaysEnd: true
      };
    },
    selectfiretarget_pie_2: (step, newMarkPos) => {
      let ARTIFACTS = {
        movetargets: step.ARTIFACTS.movetargets,
        capturers: step.ARTIFACTS.capturers,
        capturestarts: step.ARTIFACTS.capturestarts,
        firetargets: step.ARTIFACTS.firetargets,
        capturespot: step.ARTIFACTS.capturespot,
        victims: {}
      };
      let LINKS = { marks: {}, commands: {} };
      let MARKS = {
        selectfiretarget: newMarkPos
      };
      let UNITLAYERS = step.UNITLAYERS;
      if (ARTIFACTS.capturespot[MARKS.selectfiretarget]) {
        {
          let allowedsteps = UNITLAYERS.oppstones;
          let STARTPOS = MARKS.selectfiretarget;
          let POS = STARTPOS;
          while (
            (POS =
              connections[POS][
                relativeDirs[(ARTIFACTS.capturespot[STARTPOS] || {}).dir][5]
              ]) &&
            allowedsteps[POS]
          ) {
            ARTIFACTS.victims[POS] = emptyObj;
          }
        }
      }
      LINKS.commands.fire = "fire_pie_2";
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
    },
    selectcapturer_pie_2: (step, newMarkPos) => {
      let ARTIFACTS = {
        movetargets: { ...step.ARTIFACTS.movetargets },
        capturers: step.ARTIFACTS.capturers,
        capturestarts: step.ARTIFACTS.capturestarts,
        firetargets: step.ARTIFACTS.firetargets,
        capturespot: step.ARTIFACTS.capturespot,
        victims: step.ARTIFACTS.victims,
        oppmovers: step.ARTIFACTS.oppmovers,
        reachablesquares: step.ARTIFACTS.reachablesquares
      };
      let LINKS = { marks: {}, commands: {} };
      let MARKS = {
        selectcapturer: newMarkPos
      };
      let UNITLAYERS = step.UNITLAYERS;
      {
        let BLOCKS = UNITLAYERS.units;
        for (let DIR of roseDirs) {
          let POS = MARKS.selectunit || MARKS.selectcapturer;
          while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
            ARTIFACTS.movetargets[POS] = emptyObj;
          }
        }
      }
      for (const pos of Object.keys(
        Object.entries(
          Object.keys(ARTIFACTS.capturestarts)
            .concat(Object.keys(ARTIFACTS.movetargets))
            .reduce((mem, k) => {
              mem[k] = (mem[k] || 0) + 1;
              return mem;
            }, {})
        )
          .filter(([key, n]) => n === 2)
          .reduce((mem, [key]) => {
            mem[key] = emptyObj;
            return mem;
          }, {})
      )) {
        LINKS.marks[pos] = "selectcapturestart_pie_2";
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
    },
    selectcapturestart_pie_2: (step, newMarkPos) => {
      let LINKS = { marks: {}, commands: {} };
      LINKS.commands.move = "move_pie_2";
      return {
        LINKS,
        ARTIFACTS: step.ARTIFACTS,
        UNITLAYERS: step.UNITLAYERS,
        UNITDATA: step.UNITDATA,
        TURN: step.TURN,
        MARKS: {
          selectcapturer: step.MARKS.selectcapturer,
          selectcapturestart: newMarkPos
        },
        TURNVARS: step.TURNVARS,
        NEXTSPAWNID: step.NEXTSPAWNID
      };
    },
    selectunit_basic_1: (step, newMarkPos) => {
      let ARTIFACTS = {
        movetargets: {},
        capturers: {},
        capturestarts: {}
      };
      let LINKS = { marks: {}, commands: {} };
      let MARKS = {
        selectunit: newMarkPos
      };
      let UNITLAYERS = step.UNITLAYERS;
      {
        let BLOCKS = UNITLAYERS.units;
        for (let DIR of roseDirs) {
          let POS = MARKS.selectunit || MARKS.selectcapturer;
          while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
            ARTIFACTS.movetargets[POS] = emptyObj;
          }
        }
      }
      if (false) {
        {
          let BLOCKS = UNITLAYERS.myamazons;
          for (let STARTPOS in ARTIFACTS.capturestarts) {
            for (let DIR of roseDirs) {
              let POS = STARTPOS;
              while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {}
              if (BLOCKS[POS]) {
                ARTIFACTS.capturers[POS] = emptyObj;
              }
            }
          }
        }
      }
      if (false) {
        {
          let allowedsteps = UNITLAYERS.oppstones;
          let BLOCKS = Object.keys(BOARD.board)
            .filter(k => !UNITLAYERS.units.hasOwnProperty(k))
            .reduce((m, k) => {
              m[k] = emptyObj;
              return m;
            }, {});
          for (let STARTPOS in ARTIFACTS.reachablesquares) {
            for (let DIR of roseDirs) {
              let walkedsquares = [];
              let STOPREASON = "";
              let POS = STARTPOS;
              while (
                !(STOPREASON = !(POS = connections[POS][DIR])
                  ? "outofbounds"
                  : BLOCKS[POS]
                  ? "hitblock"
                  : !allowedsteps[POS]
                  ? "nomoresteps"
                  : null)
              ) {
                walkedsquares.push(POS);
              }
              let WALKLENGTH = walkedsquares.length;
              POS = STARTPOS;
              if (!!WALKLENGTH && STOPREASON === "hitblock") {
                ARTIFACTS.capturestarts[POS] = emptyObj;
              }
            }
          }
        }
      }
      for (const pos of Object.keys(ARTIFACTS.movetargets)) {
        LINKS.marks[pos] = "selectmovetarget_basic_1";
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
    },
    selectmovetarget_basic_1: (step, newMarkPos) => {
      let LINKS = { marks: {}, commands: {} };
      LINKS.commands.move = "move_basic_1";
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
        NEXTSPAWNID: step.NEXTSPAWNID,
        canAlwaysEnd: true
      };
    },
    selectfiretarget_basic_1: (step, newMarkPos) => {
      let ARTIFACTS = {
        movetargets: step.ARTIFACTS.movetargets,
        capturers: step.ARTIFACTS.capturers,
        capturestarts: step.ARTIFACTS.capturestarts,
        firetargets: step.ARTIFACTS.firetargets,
        capturespot: step.ARTIFACTS.capturespot,
        victims: {}
      };
      let LINKS = { marks: {}, commands: {} };
      let MARKS = {
        selectfiretarget: newMarkPos
      };
      let UNITLAYERS = step.UNITLAYERS;
      if (ARTIFACTS.capturespot[MARKS.selectfiretarget]) {
        {
          let allowedsteps = UNITLAYERS.oppstones;
          let STARTPOS = MARKS.selectfiretarget;
          let POS = STARTPOS;
          while (
            (POS =
              connections[POS][
                relativeDirs[(ARTIFACTS.capturespot[STARTPOS] || {}).dir][5]
              ]) &&
            allowedsteps[POS]
          ) {
            ARTIFACTS.victims[POS] = emptyObj;
          }
        }
      }
      LINKS.commands.fire = "fire_basic_1";
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
    },
    selectcapturer_basic_1: (step, newMarkPos) => {
      let ARTIFACTS = {
        movetargets: { ...step.ARTIFACTS.movetargets },
        capturers: step.ARTIFACTS.capturers,
        capturestarts: step.ARTIFACTS.capturestarts,
        firetargets: step.ARTIFACTS.firetargets,
        capturespot: step.ARTIFACTS.capturespot,
        victims: step.ARTIFACTS.victims,
        oppmovers: step.ARTIFACTS.oppmovers,
        reachablesquares: step.ARTIFACTS.reachablesquares
      };
      let LINKS = { marks: {}, commands: {} };
      let MARKS = {
        selectcapturer: newMarkPos
      };
      let UNITLAYERS = step.UNITLAYERS;
      {
        let BLOCKS = UNITLAYERS.units;
        for (let DIR of roseDirs) {
          let POS = MARKS.selectunit || MARKS.selectcapturer;
          while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
            ARTIFACTS.movetargets[POS] = emptyObj;
          }
        }
      }
      for (const pos of Object.keys(
        Object.entries(
          Object.keys(ARTIFACTS.capturestarts)
            .concat(Object.keys(ARTIFACTS.movetargets))
            .reduce((mem, k) => {
              mem[k] = (mem[k] || 0) + 1;
              return mem;
            }, {})
        )
          .filter(([key, n]) => n === 2)
          .reduce((mem, [key]) => {
            mem[key] = emptyObj;
            return mem;
          }, {})
      )) {
        LINKS.marks[pos] = "selectcapturestart_basic_1";
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
    },
    selectcapturestart_basic_1: (step, newMarkPos) => {
      let LINKS = { marks: {}, commands: {} };
      LINKS.commands.move = "move_basic_1";
      return {
        LINKS,
        ARTIFACTS: step.ARTIFACTS,
        UNITLAYERS: step.UNITLAYERS,
        UNITDATA: step.UNITDATA,
        TURN: step.TURN,
        MARKS: {
          selectcapturer: step.MARKS.selectcapturer,
          selectcapturestart: newMarkPos
        },
        TURNVARS: step.TURNVARS,
        NEXTSPAWNID: step.NEXTSPAWNID
      };
    },
    selectunit_basic_2: (step, newMarkPos) => {
      let ARTIFACTS = {
        movetargets: {},
        capturers: {},
        capturestarts: {}
      };
      let LINKS = { marks: {}, commands: {} };
      let MARKS = {
        selectunit: newMarkPos
      };
      let UNITLAYERS = step.UNITLAYERS;
      {
        let BLOCKS = UNITLAYERS.units;
        for (let DIR of roseDirs) {
          let POS = MARKS.selectunit || MARKS.selectcapturer;
          while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
            ARTIFACTS.movetargets[POS] = emptyObj;
          }
        }
      }
      if (false) {
        {
          let BLOCKS = UNITLAYERS.myamazons;
          for (let STARTPOS in ARTIFACTS.capturestarts) {
            for (let DIR of roseDirs) {
              let POS = STARTPOS;
              while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {}
              if (BLOCKS[POS]) {
                ARTIFACTS.capturers[POS] = emptyObj;
              }
            }
          }
        }
      }
      if (false) {
        {
          let allowedsteps = UNITLAYERS.oppstones;
          let BLOCKS = Object.keys(BOARD.board)
            .filter(k => !UNITLAYERS.units.hasOwnProperty(k))
            .reduce((m, k) => {
              m[k] = emptyObj;
              return m;
            }, {});
          for (let STARTPOS in ARTIFACTS.reachablesquares) {
            for (let DIR of roseDirs) {
              let walkedsquares = [];
              let STOPREASON = "";
              let POS = STARTPOS;
              while (
                !(STOPREASON = !(POS = connections[POS][DIR])
                  ? "outofbounds"
                  : BLOCKS[POS]
                  ? "hitblock"
                  : !allowedsteps[POS]
                  ? "nomoresteps"
                  : null)
              ) {
                walkedsquares.push(POS);
              }
              let WALKLENGTH = walkedsquares.length;
              POS = STARTPOS;
              if (!!WALKLENGTH && STOPREASON === "hitblock") {
                ARTIFACTS.capturestarts[POS] = emptyObj;
              }
            }
          }
        }
      }
      for (const pos of Object.keys(ARTIFACTS.movetargets)) {
        LINKS.marks[pos] = "selectmovetarget_basic_2";
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
    },
    selectmovetarget_basic_2: (step, newMarkPos) => {
      let LINKS = { marks: {}, commands: {} };
      LINKS.commands.move = "move_basic_2";
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
        NEXTSPAWNID: step.NEXTSPAWNID,
        canAlwaysEnd: true
      };
    },
    selectfiretarget_basic_2: (step, newMarkPos) => {
      let ARTIFACTS = {
        movetargets: step.ARTIFACTS.movetargets,
        capturers: step.ARTIFACTS.capturers,
        capturestarts: step.ARTIFACTS.capturestarts,
        firetargets: step.ARTIFACTS.firetargets,
        capturespot: step.ARTIFACTS.capturespot,
        victims: {}
      };
      let LINKS = { marks: {}, commands: {} };
      let MARKS = {
        selectfiretarget: newMarkPos
      };
      let UNITLAYERS = step.UNITLAYERS;
      if (ARTIFACTS.capturespot[MARKS.selectfiretarget]) {
        {
          let allowedsteps = UNITLAYERS.oppstones;
          let STARTPOS = MARKS.selectfiretarget;
          let POS = STARTPOS;
          while (
            (POS =
              connections[POS][
                relativeDirs[(ARTIFACTS.capturespot[STARTPOS] || {}).dir][5]
              ]) &&
            allowedsteps[POS]
          ) {
            ARTIFACTS.victims[POS] = emptyObj;
          }
        }
      }
      LINKS.commands.fire = "fire_basic_2";
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
    },
    selectcapturer_basic_2: (step, newMarkPos) => {
      let ARTIFACTS = {
        movetargets: { ...step.ARTIFACTS.movetargets },
        capturers: step.ARTIFACTS.capturers,
        capturestarts: step.ARTIFACTS.capturestarts,
        firetargets: step.ARTIFACTS.firetargets,
        capturespot: step.ARTIFACTS.capturespot,
        victims: step.ARTIFACTS.victims,
        oppmovers: step.ARTIFACTS.oppmovers,
        reachablesquares: step.ARTIFACTS.reachablesquares
      };
      let LINKS = { marks: {}, commands: {} };
      let MARKS = {
        selectcapturer: newMarkPos
      };
      let UNITLAYERS = step.UNITLAYERS;
      {
        let BLOCKS = UNITLAYERS.units;
        for (let DIR of roseDirs) {
          let POS = MARKS.selectunit || MARKS.selectcapturer;
          while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
            ARTIFACTS.movetargets[POS] = emptyObj;
          }
        }
      }
      for (const pos of Object.keys(
        Object.entries(
          Object.keys(ARTIFACTS.capturestarts)
            .concat(Object.keys(ARTIFACTS.movetargets))
            .reduce((mem, k) => {
              mem[k] = (mem[k] || 0) + 1;
              return mem;
            }, {})
        )
          .filter(([key, n]) => n === 2)
          .reduce((mem, [key]) => {
            mem[key] = emptyObj;
            return mem;
          }, {})
      )) {
        LINKS.marks[pos] = "selectcapturestart_basic_2";
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
    },
    selectcapturestart_basic_2: (step, newMarkPos) => {
      let LINKS = { marks: {}, commands: {} };
      LINKS.commands.move = "move_basic_2";
      return {
        LINKS,
        ARTIFACTS: step.ARTIFACTS,
        UNITLAYERS: step.UNITLAYERS,
        UNITDATA: step.UNITDATA,
        TURN: step.TURN,
        MARKS: {
          selectcapturer: step.MARKS.selectcapturer,
          selectcapturestart: newMarkPos
        },
        TURNVARS: step.TURNVARS,
        NEXTSPAWNID: step.NEXTSPAWNID
      };
    },
    move_pie_1: step => {
      let LINKS = { marks: {}, commands: {} };
      let ARTIFACTS = {
        movetargets: step.ARTIFACTS.movetargets,
        capturers: step.ARTIFACTS.capturers,
        capturestarts: step.ARTIFACTS.capturestarts,
        firetargets: {},
        capturespot: {}
      };
      let UNITLAYERS = step.UNITLAYERS;
      let TURNVARS = { ...step.TURNVARS };
      let UNITDATA = { ...step.UNITDATA };
      let TURN = step.TURN;
      let MARKS = step.MARKS;
      TURNVARS.movedto = MARKS.selectcapturestart || MARKS.selectmovetarget;
      {
        let unitid = (
          UNITLAYERS.units[MARKS.selectcapturer || MARKS.selectunit] || {}
        ).id;
        if (unitid) {
          UNITDATA[unitid] = {
            ...UNITDATA[unitid],
            pos: MARKS.selectcapturestart || MARKS.selectmovetarget
          };
        }
      }
      UNITLAYERS = {
        units: {},
        myunits: {},
        oppunits: {},
        myamazons: {},
        oppamazons: {},
        stones: {},
        mystones: {},
        oppstones: {}
      };
      for (let unitid in UNITDATA) {
        const currentunit = UNITDATA[unitid];
        const { group, pos, owner } = currentunit;
        for (const layer of groupLayers1[group][owner]) {
          UNITLAYERS[layer][pos] = currentunit;
        }
      }
      if (Object.keys(ARTIFACTS.capturers).length === 0) {
        {
          let BLOCKS = UNITLAYERS.units;
          for (let DIR of roseDirs) {
            let POS = TURNVARS["movedto"];
            while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
              {
                ARTIFACTS.firetargets[POS] = emptyObj;
              }
            }
          }
        }
      }
      {
        let BLOCKS = Object.keys(BOARD.board)
          .filter(k => !UNITLAYERS.oppstones.hasOwnProperty(k))
          .reduce((m, k) => {
            m[k] = emptyObj;
            return m;
          }, {});
        for (let DIR of roseDirs) {
          let walkedsquares = [];
          let POS = TURNVARS["movedto"];
          while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
            walkedsquares.push(POS);
          }
          let WALKLENGTH = walkedsquares.length;
          if (BLOCKS[POS]) {
            {
              ARTIFACTS.capturespot[POS] = { dir: DIR };
            }
            {
              if (!UNITLAYERS.units[POS] && WALKLENGTH > 0) {
                ARTIFACTS.firetargets[POS] = emptyObj;
              }
            }
          }
        }
      }
      if (TURN === 1) {
        if (true) {
          LINKS.starvation = {
            endGame: ["draw", "win", "lose"][
              whoWins(
                Object.keys(UNITLAYERS.mystones).length,
                Object.keys(UNITLAYERS.oppstones).length
              )
            ],
            endedBy: "dominance",
            endMarks: Object.keys(
              [emptyObj, UNITLAYERS.mystones, UNITLAYERS.oppstones][
                whoWins(
                  Object.keys(UNITLAYERS.mystones).length,
                  Object.keys(UNITLAYERS.oppstones).length
                )
              ]
            )
          };
          LINKS.endTurn = "startTurn_pie_2";
        } else {
          LINKS.endTurn = "startTurn_pie_2";
        }
      } else {
        for (const pos of Object.keys(ARTIFACTS.firetargets)) {
          LINKS.marks[pos] = "selectfiretarget_pie_1";
        }
      }
      return {
        LINKS,
        MARKS: {},
        ARTIFACTS,
        TURN,
        UNITDATA,
        UNITLAYERS,
        TURNVARS,
        NEXTSPAWNID: step.NEXTSPAWNID
      };
    },
    fire_pie_1: step => {
      let LINKS = { marks: {}, commands: {} };
      let anim = { enterFrom: {}, exitTo: {}, ghosts: [] };
      let ARTIFACTS = {
        capturers: { ...step.ARTIFACTS.capturers },
        capturestarts: { ...step.ARTIFACTS.capturestarts },
        movetargets: step.ARTIFACTS.movetargets,
        firetargets: step.ARTIFACTS.firetargets,
        capturespot: step.ARTIFACTS.capturespot,
        victims: step.ARTIFACTS.victims,
        oppmovers: {},
        reachablesquares: {}
      };
      let UNITLAYERS = step.UNITLAYERS;
      let TURNVARS = step.TURNVARS;
      let UNITDATA = { ...step.UNITDATA };
      let NEXTSPAWNID = step.NEXTSPAWNID;
      let MARKS = step.MARKS;
      ARTIFACTS.capturers = {};
      ARTIFACTS.capturestarts = {};
      ARTIFACTS.movetargets = {};
      anim.enterFrom[MARKS.selectfiretarget] = TURNVARS["movedto"];
      {
        let newunitid = "spawn" + NEXTSPAWNID++;
        UNITDATA[newunitid] = {
          pos: MARKS.selectfiretarget,
          id: newunitid,
          group: "stones",
          owner: 1
        };
      }
      for (let LOOPPOS in ARTIFACTS.victims) {
        {
          let unitid = (UNITLAYERS.units[LOOPPOS] || {}).id;
          if (unitid) {
            UNITDATA[unitid] = {
              ...UNITDATA[unitid],
              owner: 1
            };
          }
        }
      }
      UNITLAYERS = {
        units: {},
        myunits: {},
        oppunits: {},
        myamazons: {},
        oppamazons: {},
        stones: {},
        mystones: {},
        oppstones: {}
      };
      for (let unitid in UNITDATA) {
        const currentunit = UNITDATA[unitid];
        const { group, pos, owner } = currentunit;
        for (const layer of groupLayers1[group][owner]) {
          UNITLAYERS[layer][pos] = currentunit;
        }
      }
      for (let STARTPOS in UNITLAYERS.oppamazons) {
        let foundneighbours = [];
        let startconnections = connections[STARTPOS];
        for (let DIR of roseDirs) {
          let POS = startconnections[DIR];
          if (POS && !UNITLAYERS.units[POS]) {
            foundneighbours.push(POS);
          }
        }
        let NEIGHBOURCOUNT = foundneighbours.length;
        if (!!NEIGHBOURCOUNT) {
          ARTIFACTS.oppmovers[STARTPOS] = emptyObj;
        }
      }
      if (Object.keys(ARTIFACTS.oppmovers).length === 0) {
        {
          let BLOCKS = UNITLAYERS.units;
          for (let STARTPOS in UNITLAYERS.myunits) {
            for (let DIR of roseDirs) {
              let POS = STARTPOS;
              while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
                ARTIFACTS.reachablesquares[POS] = emptyObj;
              }
            }
          }
        }
        {
          let allowedsteps = UNITLAYERS.oppstones;
          let BLOCKS = Object.keys(BOARD.board)
            .filter(k => !UNITLAYERS.units.hasOwnProperty(k))
            .reduce((m, k) => {
              m[k] = emptyObj;
              return m;
            }, {});
          for (let STARTPOS in ARTIFACTS.reachablesquares) {
            for (let DIR of roseDirs) {
              let walkedsquares = [];
              let STOPREASON = "";
              let POS = STARTPOS;
              while (
                !(STOPREASON = !(POS = connections[POS][DIR])
                  ? "outofbounds"
                  : BLOCKS[POS]
                  ? "hitblock"
                  : !allowedsteps[POS]
                  ? "nomoresteps"
                  : null)
              ) {
                walkedsquares.push(POS);
              }
              let WALKLENGTH = walkedsquares.length;
              POS = STARTPOS;
              if (!!WALKLENGTH && STOPREASON === "hitblock") {
                ARTIFACTS.capturestarts[POS] = emptyObj;
              }
            }
          }
        }
        {
          let BLOCKS = UNITLAYERS.myamazons;
          for (let STARTPOS in ARTIFACTS.capturestarts) {
            for (let DIR of roseDirs) {
              let POS = STARTPOS;
              while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {}
              if (BLOCKS[POS]) {
                ARTIFACTS.capturers[POS] = emptyObj;
              }
            }
          }
        }
      }
      if (
        Object.keys(ARTIFACTS.capturers).length !== 0 &&
        Object.keys(ARTIFACTS.oppmovers).length === 0
      ) {
        for (const pos of Object.keys(ARTIFACTS.capturers)) {
          LINKS.marks[pos] = "selectcapturer_pie_1";
        }
      } else {
        if (true) {
          LINKS.starvation = {
            endGame: ["draw", "win", "lose"][
              whoWins(
                Object.keys(UNITLAYERS.mystones).length,
                Object.keys(UNITLAYERS.oppstones).length
              )
            ],
            endedBy: "dominance",
            endMarks: Object.keys(
              [emptyObj, UNITLAYERS.mystones, UNITLAYERS.oppstones][
                whoWins(
                  Object.keys(UNITLAYERS.mystones).length,
                  Object.keys(UNITLAYERS.oppstones).length
                )
              ]
            )
          };
          LINKS.endTurn = "startTurn_pie_2";
        } else {
          LINKS.endTurn = "startTurn_pie_2";
        }
      }
      return {
        LINKS,
        MARKS: {},
        ARTIFACTS,
        TURN: step.TURN,
        UNITDATA,
        UNITLAYERS,
        TURNVARS,
        NEXTSPAWNID,
        anim
      };
    },
    move_pie_2: step => {
      let LINKS = { marks: {}, commands: {} };
      let ARTIFACTS = {
        movetargets: step.ARTIFACTS.movetargets,
        capturers: step.ARTIFACTS.capturers,
        capturestarts: step.ARTIFACTS.capturestarts,
        firetargets: {},
        capturespot: {}
      };
      let UNITLAYERS = step.UNITLAYERS;
      let TURNVARS = { ...step.TURNVARS };
      let UNITDATA = { ...step.UNITDATA };
      let MARKS = step.MARKS;
      TURNVARS.movedto = MARKS.selectcapturestart || MARKS.selectmovetarget;
      {
        let unitid = (
          UNITLAYERS.units[MARKS.selectcapturer || MARKS.selectunit] || {}
        ).id;
        if (unitid) {
          UNITDATA[unitid] = {
            ...UNITDATA[unitid],
            pos: MARKS.selectcapturestart || MARKS.selectmovetarget
          };
        }
      }
      UNITLAYERS = {
        units: {},
        myunits: {},
        oppunits: {},
        myamazons: {},
        oppamazons: {},
        stones: {},
        mystones: {},
        oppstones: {}
      };
      for (let unitid in UNITDATA) {
        const currentunit = UNITDATA[unitid];
        const { group, pos, owner } = currentunit;
        for (const layer of groupLayers2[group][owner]) {
          UNITLAYERS[layer][pos] = currentunit;
        }
      }
      if (Object.keys(ARTIFACTS.capturers).length === 0) {
        {
          let BLOCKS = UNITLAYERS.units;
          for (let DIR of roseDirs) {
            let POS = TURNVARS["movedto"];
            while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
              {
                ARTIFACTS.firetargets[POS] = emptyObj;
              }
            }
          }
        }
      }
      {
        let BLOCKS = Object.keys(BOARD.board)
          .filter(k => !UNITLAYERS.oppstones.hasOwnProperty(k))
          .reduce((m, k) => {
            m[k] = emptyObj;
            return m;
          }, {});
        for (let DIR of roseDirs) {
          let walkedsquares = [];
          let POS = TURNVARS["movedto"];
          while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
            walkedsquares.push(POS);
          }
          let WALKLENGTH = walkedsquares.length;
          if (BLOCKS[POS]) {
            {
              ARTIFACTS.capturespot[POS] = { dir: DIR };
            }
            {
              if (!UNITLAYERS.units[POS] && WALKLENGTH > 0) {
                ARTIFACTS.firetargets[POS] = emptyObj;
              }
            }
          }
        }
      }
      for (const pos of Object.keys(ARTIFACTS.firetargets)) {
        LINKS.marks[pos] = "selectfiretarget_pie_2";
      }
      return {
        LINKS,
        MARKS: {},
        ARTIFACTS,
        TURN: step.TURN,
        UNITDATA,
        UNITLAYERS,
        TURNVARS,
        NEXTSPAWNID: step.NEXTSPAWNID
      };
    },
    fire_pie_2: step => {
      let LINKS = { marks: {}, commands: {} };
      let anim = { enterFrom: {}, exitTo: {}, ghosts: [] };
      let ARTIFACTS = {
        capturers: { ...step.ARTIFACTS.capturers },
        capturestarts: { ...step.ARTIFACTS.capturestarts },
        movetargets: step.ARTIFACTS.movetargets,
        firetargets: step.ARTIFACTS.firetargets,
        capturespot: step.ARTIFACTS.capturespot,
        victims: step.ARTIFACTS.victims,
        oppmovers: {},
        reachablesquares: {}
      };
      let UNITLAYERS = step.UNITLAYERS;
      let TURNVARS = step.TURNVARS;
      let UNITDATA = { ...step.UNITDATA };
      let NEXTSPAWNID = step.NEXTSPAWNID;
      let MARKS = step.MARKS;
      ARTIFACTS.capturers = {};
      ARTIFACTS.capturestarts = {};
      ARTIFACTS.movetargets = {};
      anim.enterFrom[MARKS.selectfiretarget] = TURNVARS["movedto"];
      {
        let newunitid = "spawn" + NEXTSPAWNID++;
        UNITDATA[newunitid] = {
          pos: MARKS.selectfiretarget,
          id: newunitid,
          group: "stones",
          owner: 2
        };
      }
      for (let LOOPPOS in ARTIFACTS.victims) {
        {
          let unitid = (UNITLAYERS.units[LOOPPOS] || {}).id;
          if (unitid) {
            UNITDATA[unitid] = {
              ...UNITDATA[unitid],
              owner: 2
            };
          }
        }
      }
      UNITLAYERS = {
        units: {},
        myunits: {},
        oppunits: {},
        myamazons: {},
        oppamazons: {},
        stones: {},
        mystones: {},
        oppstones: {}
      };
      for (let unitid in UNITDATA) {
        const currentunit = UNITDATA[unitid];
        const { group, pos, owner } = currentunit;
        for (const layer of groupLayers2[group][owner]) {
          UNITLAYERS[layer][pos] = currentunit;
        }
      }
      for (let STARTPOS in UNITLAYERS.oppamazons) {
        let foundneighbours = [];
        let startconnections = connections[STARTPOS];
        for (let DIR of roseDirs) {
          let POS = startconnections[DIR];
          if (POS && !UNITLAYERS.units[POS]) {
            foundneighbours.push(POS);
          }
        }
        let NEIGHBOURCOUNT = foundneighbours.length;
        if (!!NEIGHBOURCOUNT) {
          ARTIFACTS.oppmovers[STARTPOS] = emptyObj;
        }
      }
      if (Object.keys(ARTIFACTS.oppmovers).length === 0) {
        {
          let BLOCKS = UNITLAYERS.units;
          for (let STARTPOS in UNITLAYERS.myunits) {
            for (let DIR of roseDirs) {
              let POS = STARTPOS;
              while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
                ARTIFACTS.reachablesquares[POS] = emptyObj;
              }
            }
          }
        }
        {
          let allowedsteps = UNITLAYERS.oppstones;
          let BLOCKS = Object.keys(BOARD.board)
            .filter(k => !UNITLAYERS.units.hasOwnProperty(k))
            .reduce((m, k) => {
              m[k] = emptyObj;
              return m;
            }, {});
          for (let STARTPOS in ARTIFACTS.reachablesquares) {
            for (let DIR of roseDirs) {
              let walkedsquares = [];
              let STOPREASON = "";
              let POS = STARTPOS;
              while (
                !(STOPREASON = !(POS = connections[POS][DIR])
                  ? "outofbounds"
                  : BLOCKS[POS]
                  ? "hitblock"
                  : !allowedsteps[POS]
                  ? "nomoresteps"
                  : null)
              ) {
                walkedsquares.push(POS);
              }
              let WALKLENGTH = walkedsquares.length;
              POS = STARTPOS;
              if (!!WALKLENGTH && STOPREASON === "hitblock") {
                ARTIFACTS.capturestarts[POS] = emptyObj;
              }
            }
          }
        }
        {
          let BLOCKS = UNITLAYERS.myamazons;
          for (let STARTPOS in ARTIFACTS.capturestarts) {
            for (let DIR of roseDirs) {
              let POS = STARTPOS;
              while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {}
              if (BLOCKS[POS]) {
                ARTIFACTS.capturers[POS] = emptyObj;
              }
            }
          }
        }
      }
      if (
        Object.keys(ARTIFACTS.capturers).length !== 0 &&
        Object.keys(ARTIFACTS.oppmovers).length === 0
      ) {
        for (const pos of Object.keys(ARTIFACTS.capturers)) {
          LINKS.marks[pos] = "selectcapturer_pie_2";
        }
      } else {
        if (true) {
          LINKS.starvation = {
            endGame: ["draw", "lose", "win"][
              whoWins(
                Object.keys(UNITLAYERS.oppstones).length,
                Object.keys(UNITLAYERS.mystones).length
              )
            ],
            endedBy: "dominance",
            endMarks: Object.keys(
              [emptyObj, UNITLAYERS.mystones, UNITLAYERS.oppstones][
                whoWins(
                  Object.keys(UNITLAYERS.mystones).length,
                  Object.keys(UNITLAYERS.oppstones).length
                )
              ]
            )
          };
          LINKS.endTurn = "startTurn_pie_1";
        } else {
          LINKS.endTurn = "startTurn_pie_1";
        }
      }
      return {
        LINKS,
        MARKS: {},
        ARTIFACTS,
        TURN: step.TURN,
        UNITDATA,
        UNITLAYERS,
        TURNVARS,
        NEXTSPAWNID,
        anim
      };
    },
    move_basic_1: step => {
      let LINKS = { marks: {}, commands: {} };
      let ARTIFACTS = {
        movetargets: step.ARTIFACTS.movetargets,
        capturers: step.ARTIFACTS.capturers,
        capturestarts: step.ARTIFACTS.capturestarts,
        firetargets: {},
        capturespot: {}
      };
      let UNITLAYERS = step.UNITLAYERS;
      let TURNVARS = { ...step.TURNVARS };
      let UNITDATA = { ...step.UNITDATA };
      let MARKS = step.MARKS;
      TURNVARS.movedto = MARKS.selectcapturestart || MARKS.selectmovetarget;
      {
        let unitid = (
          UNITLAYERS.units[MARKS.selectcapturer || MARKS.selectunit] || {}
        ).id;
        if (unitid) {
          UNITDATA[unitid] = {
            ...UNITDATA[unitid],
            pos: MARKS.selectcapturestart || MARKS.selectmovetarget
          };
        }
      }
      UNITLAYERS = {
        units: {},
        myunits: {},
        oppunits: {},
        myamazons: {},
        oppamazons: {},
        stones: {},
        mystones: {},
        oppstones: {}
      };
      for (let unitid in UNITDATA) {
        const currentunit = UNITDATA[unitid];
        const { group, pos, owner } = currentunit;
        for (const layer of groupLayers1[group][owner]) {
          UNITLAYERS[layer][pos] = currentunit;
        }
      }
      if (Object.keys(ARTIFACTS.capturers).length === 0) {
        {
          let BLOCKS = UNITLAYERS.units;
          for (let DIR of roseDirs) {
            let POS = TURNVARS["movedto"];
            while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
              {
                ARTIFACTS.firetargets[POS] = emptyObj;
              }
            }
          }
        }
      }
      {
        let BLOCKS = Object.keys(BOARD.board)
          .filter(k => !UNITLAYERS.oppstones.hasOwnProperty(k))
          .reduce((m, k) => {
            m[k] = emptyObj;
            return m;
          }, {});
        for (let DIR of roseDirs) {
          let walkedsquares = [];
          let POS = TURNVARS["movedto"];
          while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
            walkedsquares.push(POS);
          }
          let WALKLENGTH = walkedsquares.length;
          if (BLOCKS[POS]) {
            {
              ARTIFACTS.capturespot[POS] = { dir: DIR };
            }
            {
              if (!UNITLAYERS.units[POS] && WALKLENGTH > 0) {
                ARTIFACTS.firetargets[POS] = emptyObj;
              }
            }
          }
        }
      }
      for (const pos of Object.keys(ARTIFACTS.firetargets)) {
        LINKS.marks[pos] = "selectfiretarget_basic_1";
      }
      return {
        LINKS,
        MARKS: {},
        ARTIFACTS,
        TURN: step.TURN,
        UNITDATA,
        UNITLAYERS,
        TURNVARS,
        NEXTSPAWNID: step.NEXTSPAWNID
      };
    },
    fire_basic_1: step => {
      let LINKS = { marks: {}, commands: {} };
      let anim = { enterFrom: {}, exitTo: {}, ghosts: [] };
      let ARTIFACTS = {
        capturers: { ...step.ARTIFACTS.capturers },
        capturestarts: { ...step.ARTIFACTS.capturestarts },
        movetargets: step.ARTIFACTS.movetargets,
        firetargets: step.ARTIFACTS.firetargets,
        capturespot: step.ARTIFACTS.capturespot,
        victims: step.ARTIFACTS.victims,
        oppmovers: {},
        reachablesquares: {}
      };
      let UNITLAYERS = step.UNITLAYERS;
      let TURNVARS = step.TURNVARS;
      let UNITDATA = { ...step.UNITDATA };
      let NEXTSPAWNID = step.NEXTSPAWNID;
      let MARKS = step.MARKS;
      ARTIFACTS.capturers = {};
      ARTIFACTS.capturestarts = {};
      ARTIFACTS.movetargets = {};
      anim.enterFrom[MARKS.selectfiretarget] = TURNVARS["movedto"];
      {
        let newunitid = "spawn" + NEXTSPAWNID++;
        UNITDATA[newunitid] = {
          pos: MARKS.selectfiretarget,
          id: newunitid,
          group: "stones",
          owner: 1
        };
      }
      for (let LOOPPOS in ARTIFACTS.victims) {
        {
          let unitid = (UNITLAYERS.units[LOOPPOS] || {}).id;
          if (unitid) {
            UNITDATA[unitid] = {
              ...UNITDATA[unitid],
              owner: 1
            };
          }
        }
      }
      UNITLAYERS = {
        units: {},
        myunits: {},
        oppunits: {},
        myamazons: {},
        oppamazons: {},
        stones: {},
        mystones: {},
        oppstones: {}
      };
      for (let unitid in UNITDATA) {
        const currentunit = UNITDATA[unitid];
        const { group, pos, owner } = currentunit;
        for (const layer of groupLayers1[group][owner]) {
          UNITLAYERS[layer][pos] = currentunit;
        }
      }
      for (let STARTPOS in UNITLAYERS.oppamazons) {
        let foundneighbours = [];
        let startconnections = connections[STARTPOS];
        for (let DIR of roseDirs) {
          let POS = startconnections[DIR];
          if (POS && !UNITLAYERS.units[POS]) {
            foundneighbours.push(POS);
          }
        }
        let NEIGHBOURCOUNT = foundneighbours.length;
        if (!!NEIGHBOURCOUNT) {
          ARTIFACTS.oppmovers[STARTPOS] = emptyObj;
        }
      }
      if (Object.keys(ARTIFACTS.oppmovers).length === 0) {
        {
          let BLOCKS = UNITLAYERS.units;
          for (let STARTPOS in UNITLAYERS.myunits) {
            for (let DIR of roseDirs) {
              let POS = STARTPOS;
              while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
                ARTIFACTS.reachablesquares[POS] = emptyObj;
              }
            }
          }
        }
        {
          let allowedsteps = UNITLAYERS.oppstones;
          let BLOCKS = Object.keys(BOARD.board)
            .filter(k => !UNITLAYERS.units.hasOwnProperty(k))
            .reduce((m, k) => {
              m[k] = emptyObj;
              return m;
            }, {});
          for (let STARTPOS in ARTIFACTS.reachablesquares) {
            for (let DIR of roseDirs) {
              let walkedsquares = [];
              let STOPREASON = "";
              let POS = STARTPOS;
              while (
                !(STOPREASON = !(POS = connections[POS][DIR])
                  ? "outofbounds"
                  : BLOCKS[POS]
                  ? "hitblock"
                  : !allowedsteps[POS]
                  ? "nomoresteps"
                  : null)
              ) {
                walkedsquares.push(POS);
              }
              let WALKLENGTH = walkedsquares.length;
              POS = STARTPOS;
              if (!!WALKLENGTH && STOPREASON === "hitblock") {
                ARTIFACTS.capturestarts[POS] = emptyObj;
              }
            }
          }
        }
        {
          let BLOCKS = UNITLAYERS.myamazons;
          for (let STARTPOS in ARTIFACTS.capturestarts) {
            for (let DIR of roseDirs) {
              let POS = STARTPOS;
              while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {}
              if (BLOCKS[POS]) {
                ARTIFACTS.capturers[POS] = emptyObj;
              }
            }
          }
        }
      }
      if (
        Object.keys(ARTIFACTS.capturers).length !== 0 &&
        Object.keys(ARTIFACTS.oppmovers).length === 0
      ) {
        for (const pos of Object.keys(ARTIFACTS.capturers)) {
          LINKS.marks[pos] = "selectcapturer_basic_1";
        }
      } else {
        if (true) {
          LINKS.starvation = {
            endGame: ["draw", "win", "lose"][
              whoWins(
                Object.keys(UNITLAYERS.mystones).length,
                Object.keys(UNITLAYERS.oppstones).length
              )
            ],
            endedBy: "dominance",
            endMarks: Object.keys(
              [emptyObj, UNITLAYERS.mystones, UNITLAYERS.oppstones][
                whoWins(
                  Object.keys(UNITLAYERS.mystones).length,
                  Object.keys(UNITLAYERS.oppstones).length
                )
              ]
            )
          };
          LINKS.endTurn = "startTurn_basic_2";
        } else {
          LINKS.endTurn = "startTurn_basic_2";
        }
      }
      return {
        LINKS,
        MARKS: {},
        ARTIFACTS,
        TURN: step.TURN,
        UNITDATA,
        UNITLAYERS,
        TURNVARS,
        NEXTSPAWNID,
        anim
      };
    },
    move_basic_2: step => {
      let LINKS = { marks: {}, commands: {} };
      let ARTIFACTS = {
        movetargets: step.ARTIFACTS.movetargets,
        capturers: step.ARTIFACTS.capturers,
        capturestarts: step.ARTIFACTS.capturestarts,
        firetargets: {},
        capturespot: {}
      };
      let UNITLAYERS = step.UNITLAYERS;
      let TURNVARS = { ...step.TURNVARS };
      let UNITDATA = { ...step.UNITDATA };
      let MARKS = step.MARKS;
      TURNVARS.movedto = MARKS.selectcapturestart || MARKS.selectmovetarget;
      {
        let unitid = (
          UNITLAYERS.units[MARKS.selectcapturer || MARKS.selectunit] || {}
        ).id;
        if (unitid) {
          UNITDATA[unitid] = {
            ...UNITDATA[unitid],
            pos: MARKS.selectcapturestart || MARKS.selectmovetarget
          };
        }
      }
      UNITLAYERS = {
        units: {},
        myunits: {},
        oppunits: {},
        myamazons: {},
        oppamazons: {},
        stones: {},
        mystones: {},
        oppstones: {}
      };
      for (let unitid in UNITDATA) {
        const currentunit = UNITDATA[unitid];
        const { group, pos, owner } = currentunit;
        for (const layer of groupLayers2[group][owner]) {
          UNITLAYERS[layer][pos] = currentunit;
        }
      }
      if (Object.keys(ARTIFACTS.capturers).length === 0) {
        {
          let BLOCKS = UNITLAYERS.units;
          for (let DIR of roseDirs) {
            let POS = TURNVARS["movedto"];
            while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
              {
                ARTIFACTS.firetargets[POS] = emptyObj;
              }
            }
          }
        }
      }
      {
        let BLOCKS = Object.keys(BOARD.board)
          .filter(k => !UNITLAYERS.oppstones.hasOwnProperty(k))
          .reduce((m, k) => {
            m[k] = emptyObj;
            return m;
          }, {});
        for (let DIR of roseDirs) {
          let walkedsquares = [];
          let POS = TURNVARS["movedto"];
          while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
            walkedsquares.push(POS);
          }
          let WALKLENGTH = walkedsquares.length;
          if (BLOCKS[POS]) {
            {
              ARTIFACTS.capturespot[POS] = { dir: DIR };
            }
            {
              if (!UNITLAYERS.units[POS] && WALKLENGTH > 0) {
                ARTIFACTS.firetargets[POS] = emptyObj;
              }
            }
          }
        }
      }
      for (const pos of Object.keys(ARTIFACTS.firetargets)) {
        LINKS.marks[pos] = "selectfiretarget_basic_2";
      }
      return {
        LINKS,
        MARKS: {},
        ARTIFACTS,
        TURN: step.TURN,
        UNITDATA,
        UNITLAYERS,
        TURNVARS,
        NEXTSPAWNID: step.NEXTSPAWNID
      };
    },
    fire_basic_2: step => {
      let LINKS = { marks: {}, commands: {} };
      let anim = { enterFrom: {}, exitTo: {}, ghosts: [] };
      let ARTIFACTS = {
        capturers: { ...step.ARTIFACTS.capturers },
        capturestarts: { ...step.ARTIFACTS.capturestarts },
        movetargets: step.ARTIFACTS.movetargets,
        firetargets: step.ARTIFACTS.firetargets,
        capturespot: step.ARTIFACTS.capturespot,
        victims: step.ARTIFACTS.victims,
        oppmovers: {},
        reachablesquares: {}
      };
      let UNITLAYERS = step.UNITLAYERS;
      let TURNVARS = step.TURNVARS;
      let UNITDATA = { ...step.UNITDATA };
      let NEXTSPAWNID = step.NEXTSPAWNID;
      let MARKS = step.MARKS;
      ARTIFACTS.capturers = {};
      ARTIFACTS.capturestarts = {};
      ARTIFACTS.movetargets = {};
      anim.enterFrom[MARKS.selectfiretarget] = TURNVARS["movedto"];
      {
        let newunitid = "spawn" + NEXTSPAWNID++;
        UNITDATA[newunitid] = {
          pos: MARKS.selectfiretarget,
          id: newunitid,
          group: "stones",
          owner: 2
        };
      }
      for (let LOOPPOS in ARTIFACTS.victims) {
        {
          let unitid = (UNITLAYERS.units[LOOPPOS] || {}).id;
          if (unitid) {
            UNITDATA[unitid] = {
              ...UNITDATA[unitid],
              owner: 2
            };
          }
        }
      }
      UNITLAYERS = {
        units: {},
        myunits: {},
        oppunits: {},
        myamazons: {},
        oppamazons: {},
        stones: {},
        mystones: {},
        oppstones: {}
      };
      for (let unitid in UNITDATA) {
        const currentunit = UNITDATA[unitid];
        const { group, pos, owner } = currentunit;
        for (const layer of groupLayers2[group][owner]) {
          UNITLAYERS[layer][pos] = currentunit;
        }
      }
      for (let STARTPOS in UNITLAYERS.oppamazons) {
        let foundneighbours = [];
        let startconnections = connections[STARTPOS];
        for (let DIR of roseDirs) {
          let POS = startconnections[DIR];
          if (POS && !UNITLAYERS.units[POS]) {
            foundneighbours.push(POS);
          }
        }
        let NEIGHBOURCOUNT = foundneighbours.length;
        if (!!NEIGHBOURCOUNT) {
          ARTIFACTS.oppmovers[STARTPOS] = emptyObj;
        }
      }
      if (Object.keys(ARTIFACTS.oppmovers).length === 0) {
        {
          let BLOCKS = UNITLAYERS.units;
          for (let STARTPOS in UNITLAYERS.myunits) {
            for (let DIR of roseDirs) {
              let POS = STARTPOS;
              while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {
                ARTIFACTS.reachablesquares[POS] = emptyObj;
              }
            }
          }
        }
        {
          let allowedsteps = UNITLAYERS.oppstones;
          let BLOCKS = Object.keys(BOARD.board)
            .filter(k => !UNITLAYERS.units.hasOwnProperty(k))
            .reduce((m, k) => {
              m[k] = emptyObj;
              return m;
            }, {});
          for (let STARTPOS in ARTIFACTS.reachablesquares) {
            for (let DIR of roseDirs) {
              let walkedsquares = [];
              let STOPREASON = "";
              let POS = STARTPOS;
              while (
                !(STOPREASON = !(POS = connections[POS][DIR])
                  ? "outofbounds"
                  : BLOCKS[POS]
                  ? "hitblock"
                  : !allowedsteps[POS]
                  ? "nomoresteps"
                  : null)
              ) {
                walkedsquares.push(POS);
              }
              let WALKLENGTH = walkedsquares.length;
              POS = STARTPOS;
              if (!!WALKLENGTH && STOPREASON === "hitblock") {
                ARTIFACTS.capturestarts[POS] = emptyObj;
              }
            }
          }
        }
        {
          let BLOCKS = UNITLAYERS.myamazons;
          for (let STARTPOS in ARTIFACTS.capturestarts) {
            for (let DIR of roseDirs) {
              let POS = STARTPOS;
              while ((POS = connections[POS][DIR]) && !BLOCKS[POS]) {}
              if (BLOCKS[POS]) {
                ARTIFACTS.capturers[POS] = emptyObj;
              }
            }
          }
        }
      }
      if (
        Object.keys(ARTIFACTS.capturers).length !== 0 &&
        Object.keys(ARTIFACTS.oppmovers).length === 0
      ) {
        for (const pos of Object.keys(ARTIFACTS.capturers)) {
          LINKS.marks[pos] = "selectcapturer_basic_2";
        }
      } else {
        if (true) {
          LINKS.starvation = {
            endGame: ["draw", "lose", "win"][
              whoWins(
                Object.keys(UNITLAYERS.oppstones).length,
                Object.keys(UNITLAYERS.mystones).length
              )
            ],
            endedBy: "dominance",
            endMarks: Object.keys(
              [emptyObj, UNITLAYERS.mystones, UNITLAYERS.oppstones][
                whoWins(
                  Object.keys(UNITLAYERS.mystones).length,
                  Object.keys(UNITLAYERS.oppstones).length
                )
              ]
            )
          };
          LINKS.endTurn = "startTurn_basic_1";
        } else {
          LINKS.endTurn = "startTurn_basic_1";
        }
      }
      return {
        LINKS,
        MARKS: {},
        ARTIFACTS,
        TURN: step.TURN,
        UNITDATA,
        UNITLAYERS,
        TURNVARS,
        NEXTSPAWNID,
        anim
      };
    }
  },
  instruction: {
    startTurn_pie_1: step => {
      return collapseContent({
        line: [
          { select: "Select" },
          { unittype: ["queen", 1] },
          { text: "to move" }
        ]
      });
    },
    move_pie_1: step => {
      let TURNVARS = step.TURNVARS;
      let UNITLAYERS = step.UNITLAYERS;
      let TURN = step.TURN;
      return TURN === 1
        ? collapseContent({
            line: [
              { text: "Press " },
              { endTurn: "end turn" },
              { text: " to submit your moves and hand over to " },
              { player: 2 },
              { text: "(you don't get to fire the first turn)" }
            ]
          })
        : collapseContent({
            line: [
              { text: "Select where to fire with" },
              {
                unit: [
                  iconMapping[
                    (UNITLAYERS.units[TURNVARS["movedto"]] || {}).group
                  ],
                  (UNITLAYERS.units[TURNVARS["movedto"]] || {}).owner,
                  TURNVARS["movedto"]
                ]
              }
            ]
          });
    },
    fire_pie_1: step => {
      let ARTIFACTS = step.ARTIFACTS;
      return Object.keys(ARTIFACTS.capturers).length !== 0 &&
        Object.keys(ARTIFACTS.oppmovers).length === 0
        ? collapseContent({
            line: [
              {
                text:
                  "Since your opponent is blocked you get to make a free capture move! Select"
              },
              { unittype: ["queen", 1] },
              { text: "to make it with" }
            ]
          })
        : collapseContent({
            line: [
              { text: "Press " },
              { endTurn: "end turn" },
              { text: " to submit your moves and hand over to " },
              { player: 2 }
            ]
          });
    },
    selectunit_pie_1: step => {
      let MARKS = step.MARKS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
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
      });
    },
    selectmovetarget_pie_1: step => {
      let MARKS = step.MARKS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
        line: [
          { text: "Press" },
          { command: "move" },
          { text: "to move" },
          {
            unit: [
              iconMapping[(UNITLAYERS.units[MARKS.selectunit] || {}).group],
              (UNITLAYERS.units[MARKS.selectunit] || {}).owner,
              MARKS.selectunit
            ]
          },
          { text: "to" },
          { pos: MARKS.selectmovetarget }
        ]
      });
    },
    selectfiretarget_pie_1: step => {
      let ARTIFACTS = step.ARTIFACTS;
      let MARKS = step.MARKS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
        line: [
          { text: "Press" },
          { command: "fire" },
          { text: "to spawn" },
          { unit: ["pawn", 1, MARKS.selectfiretarget] },
          Object.keys(ARTIFACTS.victims).length !== 0
            ? collapseContent({
                line: [
                  { text: "and capture" },
                  collapseContent({
                    line: Object.keys(ARTIFACTS.victims)
                      .filter(p => UNITLAYERS.units[p])
                      .map(p => ({
                        unit: [
                          iconMapping[UNITLAYERS.units[p].group],
                          UNITLAYERS.units[p].owner,
                          p
                        ]
                      }))
                      .reduce((mem, i, n, list) => {
                        mem.push(i);
                        if (n === list.length - 2) {
                          mem.push({ text: " and " });
                        } else if (n < list.length - 2) {
                          mem.push({ text: ", " });
                        }
                        return mem;
                      }, [])
                  })
                ]
              })
            : undefined
        ]
      });
    },
    selectcapturer_pie_1: step => {
      let MARKS = step.MARKS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
        line: [
          { text: "Select where to move" },
          {
            unit: [
              iconMapping[(UNITLAYERS.units[MARKS.selectcapturer] || {}).group],
              (UNITLAYERS.units[MARKS.selectcapturer] || {}).owner,
              MARKS.selectcapturer
            ]
          },
          { text: "to make a free capture" }
        ]
      });
    },
    selectcapturestart_pie_1: step => {
      let MARKS = step.MARKS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
        line: [
          { text: "Press" },
          { command: "move" },
          { text: "to move" },
          {
            unit: [
              iconMapping[(UNITLAYERS.units[MARKS.selectcapturer] || {}).group],
              (UNITLAYERS.units[MARKS.selectcapturer] || {}).owner,
              MARKS.selectcapturer
            ]
          },
          { text: "to" },
          { pos: MARKS.selectcapturestart }
        ]
      });
    },
    startTurn_pie_2: step => {
      return collapseContent({
        line: [
          { select: "Select" },
          { unittype: ["queen", 2] },
          { text: "to move" }
        ]
      });
    },
    move_pie_2: step => {
      let TURNVARS = step.TURNVARS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
        line: [
          { text: "Select where to fire with" },
          {
            unit: [
              iconMapping[(UNITLAYERS.units[TURNVARS["movedto"]] || {}).group],
              (UNITLAYERS.units[TURNVARS["movedto"]] || {}).owner,
              TURNVARS["movedto"]
            ]
          }
        ]
      });
    },
    fire_pie_2: step => {
      let ARTIFACTS = step.ARTIFACTS;
      return Object.keys(ARTIFACTS.capturers).length !== 0 &&
        Object.keys(ARTIFACTS.oppmovers).length === 0
        ? collapseContent({
            line: [
              {
                text:
                  "Since your opponent is blocked you get to make a free capture move! Select"
              },
              { unittype: ["queen", 2] },
              { text: "to make it with" }
            ]
          })
        : collapseContent({
            line: [
              { text: "Press " },
              { endTurn: "end turn" },
              { text: " to submit your moves and hand over to " },
              { player: 1 }
            ]
          });
    },
    selectunit_pie_2: step => {
      let MARKS = step.MARKS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
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
      });
    },
    selectmovetarget_pie_2: step => {
      let MARKS = step.MARKS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
        line: [
          { text: "Press" },
          { command: "move" },
          { text: "to move" },
          {
            unit: [
              iconMapping[(UNITLAYERS.units[MARKS.selectunit] || {}).group],
              (UNITLAYERS.units[MARKS.selectunit] || {}).owner,
              MARKS.selectunit
            ]
          },
          { text: "to" },
          { pos: MARKS.selectmovetarget }
        ]
      });
    },
    selectfiretarget_pie_2: step => {
      let ARTIFACTS = step.ARTIFACTS;
      let MARKS = step.MARKS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
        line: [
          { text: "Press" },
          { command: "fire" },
          { text: "to spawn" },
          { unit: ["pawn", 2, MARKS.selectfiretarget] },
          Object.keys(ARTIFACTS.victims).length !== 0
            ? collapseContent({
                line: [
                  { text: "and capture" },
                  collapseContent({
                    line: Object.keys(ARTIFACTS.victims)
                      .filter(p => UNITLAYERS.units[p])
                      .map(p => ({
                        unit: [
                          iconMapping[UNITLAYERS.units[p].group],
                          UNITLAYERS.units[p].owner,
                          p
                        ]
                      }))
                      .reduce((mem, i, n, list) => {
                        mem.push(i);
                        if (n === list.length - 2) {
                          mem.push({ text: " and " });
                        } else if (n < list.length - 2) {
                          mem.push({ text: ", " });
                        }
                        return mem;
                      }, [])
                  })
                ]
              })
            : undefined
        ]
      });
    },
    selectcapturer_pie_2: step => {
      let MARKS = step.MARKS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
        line: [
          { text: "Select where to move" },
          {
            unit: [
              iconMapping[(UNITLAYERS.units[MARKS.selectcapturer] || {}).group],
              (UNITLAYERS.units[MARKS.selectcapturer] || {}).owner,
              MARKS.selectcapturer
            ]
          },
          { text: "to make a free capture" }
        ]
      });
    },
    selectcapturestart_pie_2: step => {
      let MARKS = step.MARKS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
        line: [
          { text: "Press" },
          { command: "move" },
          { text: "to move" },
          {
            unit: [
              iconMapping[(UNITLAYERS.units[MARKS.selectcapturer] || {}).group],
              (UNITLAYERS.units[MARKS.selectcapturer] || {}).owner,
              MARKS.selectcapturer
            ]
          },
          { text: "to" },
          { pos: MARKS.selectcapturestart }
        ]
      });
    },
    startTurn_basic_1: step => {
      return collapseContent({
        line: [
          { select: "Select" },
          { unittype: ["queen", 1] },
          { text: "to move" }
        ]
      });
    },
    move_basic_1: step => {
      let TURNVARS = step.TURNVARS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
        line: [
          { text: "Select where to fire with" },
          {
            unit: [
              iconMapping[(UNITLAYERS.units[TURNVARS["movedto"]] || {}).group],
              (UNITLAYERS.units[TURNVARS["movedto"]] || {}).owner,
              TURNVARS["movedto"]
            ]
          }
        ]
      });
    },
    fire_basic_1: step => {
      let ARTIFACTS = step.ARTIFACTS;
      return Object.keys(ARTIFACTS.capturers).length !== 0 &&
        Object.keys(ARTIFACTS.oppmovers).length === 0
        ? collapseContent({
            line: [
              {
                text:
                  "Since your opponent is blocked you get to make a free capture move! Select"
              },
              { unittype: ["queen", 1] },
              { text: "to make it with" }
            ]
          })
        : collapseContent({
            line: [
              { text: "Press " },
              { endTurn: "end turn" },
              { text: " to submit your moves and hand over to " },
              { player: 2 }
            ]
          });
    },
    selectunit_basic_1: step => {
      let MARKS = step.MARKS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
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
      });
    },
    selectmovetarget_basic_1: step => {
      let MARKS = step.MARKS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
        line: [
          { text: "Press" },
          { command: "move" },
          { text: "to move" },
          {
            unit: [
              iconMapping[(UNITLAYERS.units[MARKS.selectunit] || {}).group],
              (UNITLAYERS.units[MARKS.selectunit] || {}).owner,
              MARKS.selectunit
            ]
          },
          { text: "to" },
          { pos: MARKS.selectmovetarget }
        ]
      });
    },
    selectfiretarget_basic_1: step => {
      let ARTIFACTS = step.ARTIFACTS;
      let MARKS = step.MARKS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
        line: [
          { text: "Press" },
          { command: "fire" },
          { text: "to spawn" },
          { unit: ["pawn", 1, MARKS.selectfiretarget] },
          Object.keys(ARTIFACTS.victims).length !== 0
            ? collapseContent({
                line: [
                  { text: "and capture" },
                  collapseContent({
                    line: Object.keys(ARTIFACTS.victims)
                      .filter(p => UNITLAYERS.units[p])
                      .map(p => ({
                        unit: [
                          iconMapping[UNITLAYERS.units[p].group],
                          UNITLAYERS.units[p].owner,
                          p
                        ]
                      }))
                      .reduce((mem, i, n, list) => {
                        mem.push(i);
                        if (n === list.length - 2) {
                          mem.push({ text: " and " });
                        } else if (n < list.length - 2) {
                          mem.push({ text: ", " });
                        }
                        return mem;
                      }, [])
                  })
                ]
              })
            : undefined
        ]
      });
    },
    selectcapturer_basic_1: step => {
      let MARKS = step.MARKS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
        line: [
          { text: "Select where to move" },
          {
            unit: [
              iconMapping[(UNITLAYERS.units[MARKS.selectcapturer] || {}).group],
              (UNITLAYERS.units[MARKS.selectcapturer] || {}).owner,
              MARKS.selectcapturer
            ]
          },
          { text: "to make a free capture" }
        ]
      });
    },
    selectcapturestart_basic_1: step => {
      let MARKS = step.MARKS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
        line: [
          { text: "Press" },
          { command: "move" },
          { text: "to move" },
          {
            unit: [
              iconMapping[(UNITLAYERS.units[MARKS.selectcapturer] || {}).group],
              (UNITLAYERS.units[MARKS.selectcapturer] || {}).owner,
              MARKS.selectcapturer
            ]
          },
          { text: "to" },
          { pos: MARKS.selectcapturestart }
        ]
      });
    },
    startTurn_basic_2: step => {
      return collapseContent({
        line: [
          { select: "Select" },
          { unittype: ["queen", 2] },
          { text: "to move" }
        ]
      });
    },
    move_basic_2: step => {
      let TURNVARS = step.TURNVARS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
        line: [
          { text: "Select where to fire with" },
          {
            unit: [
              iconMapping[(UNITLAYERS.units[TURNVARS["movedto"]] || {}).group],
              (UNITLAYERS.units[TURNVARS["movedto"]] || {}).owner,
              TURNVARS["movedto"]
            ]
          }
        ]
      });
    },
    fire_basic_2: step => {
      let ARTIFACTS = step.ARTIFACTS;
      return Object.keys(ARTIFACTS.capturers).length !== 0 &&
        Object.keys(ARTIFACTS.oppmovers).length === 0
        ? collapseContent({
            line: [
              {
                text:
                  "Since your opponent is blocked you get to make a free capture move! Select"
              },
              { unittype: ["queen", 2] },
              { text: "to make it with" }
            ]
          })
        : collapseContent({
            line: [
              { text: "Press " },
              { endTurn: "end turn" },
              { text: " to submit your moves and hand over to " },
              { player: 1 }
            ]
          });
    },
    selectunit_basic_2: step => {
      let MARKS = step.MARKS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
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
      });
    },
    selectmovetarget_basic_2: step => {
      let MARKS = step.MARKS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
        line: [
          { text: "Press" },
          { command: "move" },
          { text: "to move" },
          {
            unit: [
              iconMapping[(UNITLAYERS.units[MARKS.selectunit] || {}).group],
              (UNITLAYERS.units[MARKS.selectunit] || {}).owner,
              MARKS.selectunit
            ]
          },
          { text: "to" },
          { pos: MARKS.selectmovetarget }
        ]
      });
    },
    selectfiretarget_basic_2: step => {
      let ARTIFACTS = step.ARTIFACTS;
      let MARKS = step.MARKS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
        line: [
          { text: "Press" },
          { command: "fire" },
          { text: "to spawn" },
          { unit: ["pawn", 2, MARKS.selectfiretarget] },
          Object.keys(ARTIFACTS.victims).length !== 0
            ? collapseContent({
                line: [
                  { text: "and capture" },
                  collapseContent({
                    line: Object.keys(ARTIFACTS.victims)
                      .filter(p => UNITLAYERS.units[p])
                      .map(p => ({
                        unit: [
                          iconMapping[UNITLAYERS.units[p].group],
                          UNITLAYERS.units[p].owner,
                          p
                        ]
                      }))
                      .reduce((mem, i, n, list) => {
                        mem.push(i);
                        if (n === list.length - 2) {
                          mem.push({ text: " and " });
                        } else if (n < list.length - 2) {
                          mem.push({ text: ", " });
                        }
                        return mem;
                      }, [])
                  })
                ]
              })
            : undefined
        ]
      });
    },
    selectcapturer_basic_2: step => {
      let MARKS = step.MARKS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
        line: [
          { text: "Select where to move" },
          {
            unit: [
              iconMapping[(UNITLAYERS.units[MARKS.selectcapturer] || {}).group],
              (UNITLAYERS.units[MARKS.selectcapturer] || {}).owner,
              MARKS.selectcapturer
            ]
          },
          { text: "to make a free capture" }
        ]
      });
    },
    selectcapturestart_basic_2: step => {
      let MARKS = step.MARKS;
      let UNITLAYERS = step.UNITLAYERS;
      return collapseContent({
        line: [
          { text: "Press" },
          { command: "move" },
          { text: "to move" },
          {
            unit: [
              iconMapping[(UNITLAYERS.units[MARKS.selectcapturer] || {}).group],
              (UNITLAYERS.units[MARKS.selectcapturer] || {}).owner,
              MARKS.selectcapturer
            ]
          },
          { text: "to" },
          { pos: MARKS.selectcapturestart }
        ]
      });
    }
  },
  variants,
  boards,
  setups
};
export default game;
