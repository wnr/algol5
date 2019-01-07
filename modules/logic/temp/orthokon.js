(
  function() {
    var game = {};
    game.commands = {
      "move": 1
    };
    game.graphics = {
      "icons": {
        "soldiers": "pawn"
      },
      "tiles": {}
    };
    game.board = {
      "height": 4,
      "width": 4,
      "terrain": {}
    };
    game.AI = ["Bob"];
    game.id = "orthokon";
    var boardDef = {
      "height": 4,
      "width": 4,
      "terrain": {}
    };
    var connections = boardConnections(boardDef);
    var BOARD = boardLayers(boardDef);
    var relativedirs = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    var TERRAIN = terrainLayers(boardDef, 0);
    function reduce(coll, iterator, acc) {
      for (var key in coll) {
        acc = iterator(acc, coll[key], key);
      }
      return acc;
    }
    game.newGame = function() {
      var turnseed = {
        turn: 0
      };
      var stepseed = {
        UNITDATA: deduceInitialUnitData({
          "soldiers": {
            "1": [
              ["rect", "a1", "d1"]
            ],
            "2": [
              ["rect", "a4", "d4"]
            ]
          }
        })
      };
      return game.start1(turnseed, stepseed);
    };
    game.debug = function() {
      return {
        BOARD: BOARD,
        connections: connections,
        plr1: game.debug1(),
        plr2: game.debug2()
      };
    };
    (function() {
      var ownernames = ["neutral", "my", "opp"];
      var player = 1;
      var otherplayer = 2;
      game.brain_Bob_1 = function(step) {
        var UNITLAYERS = step.UNITLAYERS;
        var ARTIFACTS = step.ARTIFACTS;
        return Object.keys(UNITLAYERS.myunits).length;
      };
      game.brain_Bob_1_detailed = function(step) {
        var UNITLAYERS = step.UNITLAYERS;
        var ARTIFACTS = step.ARTIFACTS;
        return {
          headcount: Object.keys(UNITLAYERS.myunits).length
        };
      };
      game.selectunit1 = function(turn, step, markpos) {
        var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {
          movetargets: Object.assign({}, step.ARTIFACTS.movetargets)
        });
        var UNITLAYERS = step.UNITLAYERS;
        var MARKS = {
          selectunit: markpos
        };
        var BLOCKS = UNITLAYERS.units;
        var STARTPOS = MARKS["selectunit"];
        var allwalkerdirs = [1, 2, 3, 4, 5, 6, 7, 8];
        for (var walkerdirnbr = 0; walkerdirnbr < 8; walkerdirnbr++) {
          var walkedsquares = [];
          var POS = STARTPOS;
          while ((POS = connections[POS][allwalkerdirs[walkerdirnbr]]) && !BLOCKS[POS]) {
            walkedsquares.push(POS);
          }
          var WALKLENGTH = walkedsquares.length;
          if (WALKLENGTH) {
            ARTIFACTS["movetargets"][walkedsquares[WALKLENGTH - 1]] = {};
          }
        }
        var newstepid = step.stepid + '-' + markpos;
        var newstep = turn.steps[newstepid] = Object.assign({}, step, {
          ARTIFACTS: ARTIFACTS,
          MARKS: MARKS,
          stepid: newstepid,
          path: step.path.concat(markpos),
          name: 'selectunit'
        });
        turn.links[newstepid] = {};
        var newlinks = turn.links[newstepid];
        for (var linkpos in ARTIFACTS.movetargets) {
          newlinks[linkpos] = 'selectmovetarget1';
        }
        return newstep;
      };
      game.selectunit1instruction = function(turn, step) {
        var MARKS = step.MARKS;
        return collapseLine({
          type: 'line',
          content: [{
            type: 'text',
            text: "Select where to move the"
          }, {
            type: 'posref',
            pos: MARKS["selectunit"]
          }, {
            type: "unittyperef",
            alias: "pawn",
            name: "pawn".replace(/s$/, '')
          }]
        });
      };
      game.selectmovetarget1 = function(turn, step, markpos) {
        var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {
          victims: Object.assign({}, step.ARTIFACTS.victims)
        });
        var UNITLAYERS = step.UNITLAYERS;
        var MARKS = {
          selectmovetarget: markpos,
          selectunit: step.MARKS.selectunit
        };
        var STARTPOS = MARKS["selectmovetarget"];
        var neighbourdirs = [1, 3, 5, 7];
        var startconnections = connections[STARTPOS];
        for (var dirnbr = 0; dirnbr < 4; dirnbr++) {
          var POS = startconnections[neighbourdirs[dirnbr]];
          if (POS && UNITLAYERS.oppunits[POS]) {
            ARTIFACTS["victims"][POS] = {};
          }
        }
        var newstepid = step.stepid + '-' + markpos;
        var newstep = turn.steps[newstepid] = Object.assign({}, step, {
          ARTIFACTS: ARTIFACTS,
          MARKS: MARKS,
          stepid: newstepid,
          path: step.path.concat(markpos),
          name: 'selectmovetarget'
        });
        turn.links[newstepid] = {};
        turn.links[newstepid].move = 'move1';
        return newstep;
      };
      game.selectmovetarget1instruction = function(turn, step) {
        var MARKS = step.MARKS;
        var ARTIFACTS = step.ARTIFACTS;
        return collapseLine({
          type: 'line',
          content: [{
            type: 'text',
            text: "Press"
          }, {
            type: 'cmndref',
            cmnd: "move"
          }, {
            type: 'text',
            text: "to move the"
          }, {
            type: 'posref',
            pos: MARKS["selectunit"]
          }, {
            type: "unittyperef",
            alias: "pawn",
            name: "pawn".replace(/s$/, '')
          }, {
            type: 'text',
            text: "to"
          }, {
            type: 'posref',
            pos: MARKS["selectmovetarget"]
          }, Object.keys(ARTIFACTS.victims).length !== 0 ? collapseLine({
            type: 'line',
            content: [{
              type: 'text',
              text: "and take over"
            }, {
              type: "line",
              content: [{
                type: "text",
                text: Object.keys(ARTIFACTS.victims).length
              }, Object.keys(ARTIFACTS.victims).length === 1 ? collapseLine({
                type: 'line',
                content: [{
                  type: 'text',
                  text: "enemy"
                }, {
                  type: "unittyperef",
                  alias: "pawn",
                  name: "pawn".replace(/s$/, '')
                }]
              }) : collapseLine({
                type: 'line',
                content: [{
                  type: 'text',
                  text: "enemy"
                }, {
                  type: "unittyperef",
                  alias: "pawns",
                  name: "pawns".replace(/s$/, '')
                }]
              })]
            }]
          }) : {
            type: 'nothing'
          }]
        });
      };
      game.move1 = function(turn, step) {
        var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {});
        var MARKS = step.MARKS;
        var UNITDATA = Object.assign({}, step.UNITDATA);
        var UNITLAYERS = step.UNITLAYERS;
        var unitid = (UNITLAYERS.units[MARKS["selectunit"]]  || {}).id;
        if (unitid) {
          UNITDATA[unitid] = Object.assign({}, UNITDATA[unitid], {
            "pos": MARKS["selectmovetarget"]
          });
        }
        var LOOPID;
        for (var POS in ARTIFACTS.victims) {
          if (LOOPID = (UNITLAYERS.units[POS] || {}).id) {
            UNITDATA[LOOPID] = Object.assign({}, UNITDATA[LOOPID], {
              "owner": 1
            });
            // TODO - check that it uses ['loopid'] ?
          }
        }
        MARKS = {};
        UNITLAYERS = {
          "soldiers": {},
          "mysoldiers": {},
          "oppsoldiers": {},
          "neutralsoldiers": {},
          "units": {},
          "myunits": {},
          "oppunits": {},
          "neutralunits": {}
        };
        for (var unitid in UNITDATA) {
          var currentunit = UNITDATA[unitid]
          var unitgroup = currentunit.group;
          var unitpos = currentunit.pos;
          var owner = ownernames[currentunit.owner]
          UNITLAYERS.units[unitpos] = UNITLAYERS[unitgroup][unitpos] = UNITLAYERS[owner + unitgroup][unitpos] = UNITLAYERS[owner + 'units'][unitpos] = currentunit;
        }
        ARTIFACTS = {
          "victims": {},
          "movetargets": {}
        };
        var newstepid = step.stepid + '-' + 'move';
        var newstep = turn.steps[newstepid] = Object.assign({}, step, {
          ARTIFACTS: ARTIFACTS,
          MARKS: MARKS,
          UNITDATA: UNITDATA,
          UNITLAYERS: UNITLAYERS,
          stepid: newstepid,
          name: 'move',
          path: step.path.concat('move')
        });
        turn.links[newstepid] = {};
        turn.links[newstepid].endturn = "start" + otherplayer;
        return newstep;
      }
      game.move1instruction = function(turn, step) {
        return {
          type: 'text',
          text: ""
        };
      };
      game.start1 = function(turn, step) {
        var turn = {
          steps: {},
          player: player,
          turn: turn.turn + 1,
          links: {
            root: {}
          },
          endMarks: {}
        };
        var MARKS = {};
        var ARTIFACTS = {
          "victims": {},
          "movetargets": {}
        };
        var UNITDATA = step.UNITDATA;
        var UNITLAYERS = {
          "soldiers": {},
          "mysoldiers": {},
          "oppsoldiers": {},
          "neutralsoldiers": {},
          "units": {},
          "myunits": {},
          "oppunits": {},
          "neutralunits": {}
        };
        for (var unitid in UNITDATA) {
          var currentunit = UNITDATA[unitid]
          var unitgroup = currentunit.group;
          var unitpos = currentunit.pos;
          var owner = ownernames[currentunit.owner]
          UNITLAYERS.units[unitpos] = UNITLAYERS[unitgroup][unitpos] = UNITLAYERS[owner + unitgroup][unitpos] = UNITLAYERS[owner + 'units'][unitpos] = currentunit;
        }
        var newstep = turn.steps.root = {
          ARTIFACTS: ARTIFACTS,
          UNITDATA: UNITDATA,
          UNITLAYERS: UNITLAYERS,
          MARKS: MARKS,
          stepid: 'root',
          name: 'start',
          path: []
        };
        var newlinks = turn.links.root;
        for (var linkpos in UNITLAYERS.myunits) {
          newlinks[linkpos] = 'selectunit1';
        }
        return turn;
      }
      game.start1instruction = function(turn, step) {
        return collapseLine({
          type: 'line',
          content: [{
            type: 'text',
            text: "Select which"
          }, {
            type: "unittyperef",
            alias: "pawn",
            name: "pawn".replace(/s$/, '')
          }, {
            type: 'text',
            text: "to move"
          }]
        });
      };
      game.debug1 = function() {
        return {
          TERRAIN: TERRAIN
        };
      }
    })();
    (function() {
      var ownernames = ["neutral", "opp", "my"];
      var player = 2;
      var otherplayer = 1;
      game.brain_Bob_2 = function(step) {
        var UNITLAYERS = step.UNITLAYERS;
        var ARTIFACTS = step.ARTIFACTS;
        return Object.keys(UNITLAYERS.myunits).length;
      };
      game.brain_Bob_2_detailed = function(step) {
        var UNITLAYERS = step.UNITLAYERS;
        var ARTIFACTS = step.ARTIFACTS;
        return {
          headcount: Object.keys(UNITLAYERS.myunits).length
        };
      };
      game.selectunit2 = function(turn, step, markpos) {
        var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {
          movetargets: Object.assign({}, step.ARTIFACTS.movetargets)
        });
        var UNITLAYERS = step.UNITLAYERS;
        var MARKS = {
          selectunit: markpos
        };
        var BLOCKS = UNITLAYERS.units;
        var STARTPOS = MARKS["selectunit"];
        var allwalkerdirs = [1, 2, 3, 4, 5, 6, 7, 8];
        for (var walkerdirnbr = 0; walkerdirnbr < 8; walkerdirnbr++) {
          var walkedsquares = [];
          var POS = STARTPOS;
          while ((POS = connections[POS][allwalkerdirs[walkerdirnbr]]) && !BLOCKS[POS]) {
            walkedsquares.push(POS);
          }
          var WALKLENGTH = walkedsquares.length;
          if (WALKLENGTH) {
            ARTIFACTS["movetargets"][walkedsquares[WALKLENGTH - 1]] = {};
          }
        }
        var newstepid = step.stepid + '-' + markpos;
        var newstep = turn.steps[newstepid] = Object.assign({}, step, {
          ARTIFACTS: ARTIFACTS,
          MARKS: MARKS,
          stepid: newstepid,
          path: step.path.concat(markpos),
          name: 'selectunit'
        });
        turn.links[newstepid] = {};
        var newlinks = turn.links[newstepid];
        for (var linkpos in ARTIFACTS.movetargets) {
          newlinks[linkpos] = 'selectmovetarget2';
        }
        return newstep;
      };
      game.selectunit2instruction = function(turn, step) {
        var MARKS = step.MARKS;
        return collapseLine({
          type: 'line',
          content: [{
            type: 'text',
            text: "Select where to move the"
          }, {
            type: 'posref',
            pos: MARKS["selectunit"]
          }, {
            type: "unittyperef",
            alias: "pawn",
            name: "pawn".replace(/s$/, '')
          }]
        });
      };
      game.selectmovetarget2 = function(turn, step, markpos) {
        var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {
          victims: Object.assign({}, step.ARTIFACTS.victims)
        });
        var UNITLAYERS = step.UNITLAYERS;
        var MARKS = {
          selectmovetarget: markpos,
          selectunit: step.MARKS.selectunit
        };
        var STARTPOS = MARKS["selectmovetarget"];
        var neighbourdirs = [1, 3, 5, 7];
        var startconnections = connections[STARTPOS];
        for (var dirnbr = 0; dirnbr < 4; dirnbr++) {
          var POS = startconnections[neighbourdirs[dirnbr]];
          if (POS && UNITLAYERS.oppunits[POS]) {
            ARTIFACTS["victims"][POS] = {};
          }
        }
        var newstepid = step.stepid + '-' + markpos;
        var newstep = turn.steps[newstepid] = Object.assign({}, step, {
          ARTIFACTS: ARTIFACTS,
          MARKS: MARKS,
          stepid: newstepid,
          path: step.path.concat(markpos),
          name: 'selectmovetarget'
        });
        turn.links[newstepid] = {};
        turn.links[newstepid].move = 'move2';
        return newstep;
      };
      game.selectmovetarget2instruction = function(turn, step) {
        var MARKS = step.MARKS;
        var ARTIFACTS = step.ARTIFACTS;
        return collapseLine({
          type: 'line',
          content: [{
            type: 'text',
            text: "Press"
          }, {
            type: 'cmndref',
            cmnd: "move"
          }, {
            type: 'text',
            text: "to move the"
          }, {
            type: 'posref',
            pos: MARKS["selectunit"]
          }, {
            type: "unittyperef",
            alias: "pawn",
            name: "pawn".replace(/s$/, '')
          }, {
            type: 'text',
            text: "to"
          }, {
            type: 'posref',
            pos: MARKS["selectmovetarget"]
          }, Object.keys(ARTIFACTS.victims).length !== 0 ? collapseLine({
            type: 'line',
            content: [{
              type: 'text',
              text: "and take over"
            }, {
              type: "line",
              content: [{
                type: "text",
                text: Object.keys(ARTIFACTS.victims).length
              }, Object.keys(ARTIFACTS.victims).length === 1 ? collapseLine({
                type: 'line',
                content: [{
                  type: 'text',
                  text: "enemy"
                }, {
                  type: "unittyperef",
                  alias: "pawn",
                  name: "pawn".replace(/s$/, '')
                }]
              }) : collapseLine({
                type: 'line',
                content: [{
                  type: 'text',
                  text: "enemy"
                }, {
                  type: "unittyperef",
                  alias: "pawns",
                  name: "pawns".replace(/s$/, '')
                }]
              })]
            }]
          }) : {
            type: 'nothing'
          }]
        });
      };
      game.move2 = function(turn, step) {
        var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {});
        var MARKS = step.MARKS;
        var UNITDATA = Object.assign({}, step.UNITDATA);
        var UNITLAYERS = step.UNITLAYERS;
        var unitid = (UNITLAYERS.units[MARKS["selectunit"]]  || {}).id;
        if (unitid) {
          UNITDATA[unitid] = Object.assign({}, UNITDATA[unitid], {
            "pos": MARKS["selectmovetarget"]
          });
        }
        var LOOPID;
        for (var POS in ARTIFACTS.victims) {
          if (LOOPID = (UNITLAYERS.units[POS] || {}).id) {
            UNITDATA[LOOPID] = Object.assign({}, UNITDATA[LOOPID], {
              "owner": 2
            });
            // TODO - check that it uses ['loopid'] ?
          }
        }
        MARKS = {};
        UNITLAYERS = {
          "soldiers": {},
          "mysoldiers": {},
          "oppsoldiers": {},
          "neutralsoldiers": {},
          "units": {},
          "myunits": {},
          "oppunits": {},
          "neutralunits": {}
        };
        for (var unitid in UNITDATA) {
          var currentunit = UNITDATA[unitid]
          var unitgroup = currentunit.group;
          var unitpos = currentunit.pos;
          var owner = ownernames[currentunit.owner]
          UNITLAYERS.units[unitpos] = UNITLAYERS[unitgroup][unitpos] = UNITLAYERS[owner + unitgroup][unitpos] = UNITLAYERS[owner + 'units'][unitpos] = currentunit;
        }
        ARTIFACTS = {
          "victims": {},
          "movetargets": {}
        };
        var newstepid = step.stepid + '-' + 'move';
        var newstep = turn.steps[newstepid] = Object.assign({}, step, {
          ARTIFACTS: ARTIFACTS,
          MARKS: MARKS,
          UNITDATA: UNITDATA,
          UNITLAYERS: UNITLAYERS,
          stepid: newstepid,
          name: 'move',
          path: step.path.concat('move')
        });
        turn.links[newstepid] = {};
        turn.links[newstepid].endturn = "start" + otherplayer;
        return newstep;
      }
      game.move2instruction = function(turn, step) {
        return {
          type: 'text',
          text: ""
        };
      };
      game.start2 = function(turn, step) {
        var turn = {
          steps: {},
          player: player,
          turn: turn.turn + 1,
          links: {
            root: {}
          },
          endMarks: {}
        };
        var MARKS = {};
        var ARTIFACTS = {
          "victims": {},
          "movetargets": {}
        };
        var UNITDATA = step.UNITDATA;
        var UNITLAYERS = {
          "soldiers": {},
          "mysoldiers": {},
          "oppsoldiers": {},
          "neutralsoldiers": {},
          "units": {},
          "myunits": {},
          "oppunits": {},
          "neutralunits": {}
        };
        for (var unitid in UNITDATA) {
          var currentunit = UNITDATA[unitid]
          var unitgroup = currentunit.group;
          var unitpos = currentunit.pos;
          var owner = ownernames[currentunit.owner]
          UNITLAYERS.units[unitpos] = UNITLAYERS[unitgroup][unitpos] = UNITLAYERS[owner + unitgroup][unitpos] = UNITLAYERS[owner + 'units'][unitpos] = currentunit;
        }
        var newstep = turn.steps.root = {
          ARTIFACTS: ARTIFACTS,
          UNITDATA: UNITDATA,
          UNITLAYERS: UNITLAYERS,
          MARKS: MARKS,
          stepid: 'root',
          name: 'start',
          path: []
        };
        var newlinks = turn.links.root;
        for (var linkpos in UNITLAYERS.myunits) {
          newlinks[linkpos] = 'selectunit2';
        }
        return turn;
      }
      game.start2instruction = function(turn, step) {
        return collapseLine({
          type: 'line',
          content: [{
            type: 'text',
            text: "Select which"
          }, {
            type: "unittyperef",
            alias: "pawn",
            name: "pawn".replace(/s$/, '')
          }, {
            type: 'text',
            text: "to move"
          }]
        });
      };
      game.debug2 = function() {
        return {
          TERRAIN: TERRAIN
        };
      }
    })();
    return game;
  }
)()