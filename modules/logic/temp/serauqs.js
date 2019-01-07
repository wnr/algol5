(
  function() {
    var game = {};
    game.commands = {
      "promote": 1,
      "move": 1
    };
    game.graphics = {
      "icons": {
        "soldiers": "pawn",
        "wild": "king"
      },
      "tiles": {
        "corners": "grass",
        "middle": "castle"
      }
    };
    game.board = {
      "height": 4,
      "width": 4,
      "terrain": {
        "base": {
          "1": [
            ["rect", "a1", "d1"]
          ],
          "2": [
            ["rect", "a4", "d4"]
          ]
        },
        "corners": ["a1", "a4", "d1", "d4"],
        "middle": [
          ["rect", "b2", "c3"]
        ]
      }
    };
    game.AI = [];
    game.id = "serauqs";
    var boardDef = {
      "height": 4,
      "width": 4,
      "terrain": {
        "base": {
          "1": [
            ["rect", "a1", "d1"]
          ],
          "2": [
            ["rect", "a4", "d4"]
          ]
        },
        "corners": ["a1", "a4", "d1", "d4"],
        "middle": [
          ["rect", "b2", "c3"]
        ]
      }
    };
    var connections = boardConnections(boardDef);
    var BOARD = boardLayers(boardDef);
    var relativedirs = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
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
      var TERRAIN = terrainLayers(boardDef, 1);
      var ownernames = ["neutral", "my", "opp"];
      var player = 1;
      var otherplayer = 2;
      game.selectunit1 = function(turn, step, markpos) {
        var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {
          movetargets: Object.assign({}, step.ARTIFACTS.movetargets)
        });
        var UNITLAYERS = step.UNITLAYERS;
        var MARKS = {
          selectunit: markpos
        };
        var STARTPOS = MARKS["selectunit"];
        var neighbourdirs = [1, 2, 3, 4, 5, 6, 7, 8];
        var startconnections = connections[STARTPOS];
        for (var dirnbr = 0; dirnbr < 8; dirnbr++) {
          var POS = startconnections[neighbourdirs[dirnbr]];
          if (POS && !UNITLAYERS.units[POS]) {
            ARTIFACTS["movetargets"][POS] = {};
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
        if ((3 > turn.turn)) {
          turn.links[newstepid].promote = 'promote1';
        } else {
          var newlinks = turn.links[newstepid];
          for (var linkpos in ARTIFACTS.movetargets) {
            newlinks[linkpos] = 'selectmovetarget1';
          }
        }
        return newstep;
      };
      game.selectunit1instruction = function(turn, step) {
        var MARKS = step.MARKS;
        var UNITLAYERS = step.UNITLAYERS;
        return ((turn.turn > 2) ? collapseLine({
          type: 'line',
          content: [{
            type: 'text',
            text: "Select where to"
          }, {
            type: 'cmndref',
            cmnd: "move"
          }, {
            type: 'text',
            text: "the"
          }, {
            type: "unittyperef",
            name: game.graphics.icons[(UNITLAYERS.units[MARKS["selectunit"]] || {})["group"]]
          }, !!(UNITLAYERS.wild[MARKS["selectunit"]]) ? {
            type: 'text',
            text: "(remeber that it matches for your opponent too!)"
          } : {
            type: 'nothing'
          }]
        }) : collapseLine({
          type: 'line',
          content: [{
            type: 'text',
            text: "Press"
          }, {
            type: 'cmndref',
            cmnd: "promote"
          }, {
            type: 'text',
            text: "to turn this"
          }, {
            type: "unittyperef",
            alias: "pawn",
            name: "pawn".replace(/s$/, '')
          }, {
            type: 'text',
            text: "to a"
          }, {
            type: "unittyperef",
            alias: "king",
            name: "king".replace(/s$/, '')
          }, {
            type: 'text',
            text: ", making it match for your opponent too"
          }]
        }));
      };
      game.selectmovetarget1 = function(turn, step, markpos) {
        var MARKS = {
          selectmovetarget: markpos,
          selectunit: step.MARKS.selectunit
        };
        var newstepid = step.stepid + '-' + markpos;
        var newstep = turn.steps[newstepid] = Object.assign({}, step, {
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
            text: "to go from"
          }, {
            type: 'posref',
            pos: MARKS["selectunit"]
          }, {
            type: 'text',
            text: "to"
          }, {
            type: 'posref',
            pos: MARKS["selectmovetarget"]
          }]
        });
      };
      game.promote1 = function(turn, step) {
        var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {});
        var MARKS = step.MARKS;
        var UNITDATA = Object.assign({}, step.UNITDATA);
        var UNITLAYERS = step.UNITLAYERS;
        var unitid = (UNITLAYERS.units[MARKS["selectunit"]]  || {}).id;
        if (unitid) {
          UNITDATA[unitid] = Object.assign({}, UNITDATA[unitid], {
            "group": "wild"
          });
        }
        MARKS = {};
        UNITLAYERS = {
          "soldiers": {},
          "mysoldiers": {},
          "oppsoldiers": {},
          "neutralsoldiers": {},
          "wild": {},
          "mywild": {},
          "oppwild": {},
          "neutralwild": {},
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
          "movetargets": {},
          "winline": {}
        };
        var newstepid = step.stepid + '-' + 'promote';
        var newstep = turn.steps[newstepid] = Object.assign({}, step, {
          ARTIFACTS: ARTIFACTS,
          MARKS: MARKS,
          UNITDATA: UNITDATA,
          UNITLAYERS: UNITLAYERS,
          stepid: newstepid,
          name: 'promote',
          path: step.path.concat('promote')
        });
        turn.links[newstepid] = {};
        if (Object.keys(ARTIFACTS.winline).length !== 0) {
          var winner = 1;
          var result = winner === 1 ? 'win' : winner ? 'lose' : 'draw';
          turn.links[newstepid][result] = 'madeline';
          turn.endMarks[newstepid] = turn.endMarks[newstepid] ||  {};
          turn.endMarks[newstepid].madeline = ARTIFACTS.winline;
        } else
        if ((Object.keys(
            (function() {
              var ret = {},
                s0 = TERRAIN.corners,
                s1 =
                (function() {
                  var k, ret = {},
                    s0 = UNITLAYERS.myunits,
                    s1 = UNITLAYERS.oppwild;
                  for (k in s0) {
                    ret[k] = 1;
                  }
                  for (k in s1) {
                    ret[k] = 1;
                  }
                  return ret;
                }());
              for (var key in s0) {
                if (s1[key]) {
                  ret[key] = s0[key];
                }
              }
              return ret;
            }())).length > 3)) {
          var winner = 1;
          var result = winner === 1 ? 'win' : winner ? 'lose' : 'draw';
          turn.links[newstepid][result] = 'madex';
          turn.endMarks[newstepid] = turn.endMarks[newstepid] ||  {};
          turn.endMarks[newstepid].madex = TERRAIN.corners;
        } else
        if ((Object.keys(
            (function() {
              var ret = {},
                s0 = TERRAIN.middle,
                s1 =
                (function() {
                  var k, ret = {},
                    s0 = UNITLAYERS.myunits,
                    s1 = UNITLAYERS.oppwild;
                  for (k in s0) {
                    ret[k] = 1;
                  }
                  for (k in s1) {
                    ret[k] = 1;
                  }
                  return ret;
                }());
              for (var key in s0) {
                if (s1[key]) {
                  ret[key] = s0[key];
                }
              }
              return ret;
            }())).length > 3)) {
          var winner = 1;
          var result = winner === 1 ? 'win' : winner ? 'lose' : 'draw';
          turn.links[newstepid][result] = 'tookcenter';
          turn.endMarks[newstepid] = turn.endMarks[newstepid] ||  {};
          turn.endMarks[newstepid].tookcenter = TERRAIN.middle;
        } else turn.links[newstepid].endturn = "start" + otherplayer;
        return newstep;
      }
      game.promote1instruction = function(turn, step) {
        return {
          type: 'text',
          text: ""
        };
      };
      game.move1 = function(turn, step) {
        var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {
          winline: Object.assign({}, step.ARTIFACTS.winline)
        });
        var MARKS = step.MARKS;
        var UNITDATA = Object.assign({}, step.UNITDATA);
        var UNITLAYERS = step.UNITLAYERS;
        var unitid = (UNITLAYERS.units[MARKS["selectunit"]]  || {}).id;
        if (unitid) {
          UNITDATA[unitid] = Object.assign({}, UNITDATA[unitid], {
            "pos": MARKS["selectmovetarget"]
          });
        }
        MARKS = {};
        UNITLAYERS = {
          "soldiers": {},
          "mysoldiers": {},
          "oppsoldiers": {},
          "neutralsoldiers": {},
          "wild": {},
          "mywild": {},
          "oppwild": {},
          "neutralwild": {},
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
          "movetargets": {},
          "winline": {}
        };
        var allowedsteps =
          (function() {
            var k, ret = {},
              s0 = UNITLAYERS.myunits,
              s1 = UNITLAYERS.oppwild;
            for (k in s0) {
              ret[k] = 1;
            }
            for (k in s1) {
              ret[k] = 1;
            }
            return ret;
          }());
        var walkstarts =
          (function() {
            var k, ret = {},
              s0 = UNITLAYERS.myunits,
              s1 = UNITLAYERS.oppwild;
            for (k in s0) {
              ret[k] = 1;
            }
            for (k in s1) {
              ret[k] = 1;
            }
            return ret;
          }());
        for (var STARTPOS in walkstarts) {
          var allwalkerdirs = [1, 2, 3, 4, 5, 6, 7, 8];
          for (var walkerdirnbr = 0; walkerdirnbr < 8; walkerdirnbr++) {
            var DIR = allwalkerdirs[walkerdirnbr];
            var walkedsquares = [];
            var POS = "faux";
            connections.faux[DIR] = STARTPOS;
            var walkpositionstocount = TERRAIN.mybase;
            var CURRENTCOUNT = 0;
            while ((POS = connections[POS][DIR]) && allowedsteps[POS]) {
              walkedsquares.push(POS);
              CURRENTCOUNT += (walkpositionstocount[POS] ? 1 : 0);
            }
            var WALKLENGTH = walkedsquares.length;
            var TOTALCOUNT = CURRENTCOUNT;
            for (var walkstepper = 0; walkstepper < WALKLENGTH; walkstepper++) {
              POS = walkedsquares[walkstepper];
              if (((WALKLENGTH === 4) && (TOTALCOUNT !== 4))) {
                ARTIFACTS["winline"][POS] = {};
              }
            }
          }
        }
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
        if (Object.keys(ARTIFACTS.winline).length !== 0) {
          var winner = 1;
          var result = winner === 1 ? 'win' : winner ? 'lose' : 'draw';
          turn.links[newstepid][result] = 'madeline';
          turn.endMarks[newstepid] = turn.endMarks[newstepid] ||  {};
          turn.endMarks[newstepid].madeline = ARTIFACTS.winline;
        } else
        if ((Object.keys(
            (function() {
              var ret = {},
                s0 = TERRAIN.corners,
                s1 =
                (function() {
                  var k, ret = {},
                    s0 = UNITLAYERS.myunits,
                    s1 = UNITLAYERS.oppwild;
                  for (k in s0) {
                    ret[k] = 1;
                  }
                  for (k in s1) {
                    ret[k] = 1;
                  }
                  return ret;
                }());
              for (var key in s0) {
                if (s1[key]) {
                  ret[key] = s0[key];
                }
              }
              return ret;
            }())).length > 3)) {
          var winner = 1;
          var result = winner === 1 ? 'win' : winner ? 'lose' : 'draw';
          turn.links[newstepid][result] = 'madex';
          turn.endMarks[newstepid] = turn.endMarks[newstepid] ||  {};
          turn.endMarks[newstepid].madex = TERRAIN.corners;
        } else
        if ((Object.keys(
            (function() {
              var ret = {},
                s0 = TERRAIN.middle,
                s1 =
                (function() {
                  var k, ret = {},
                    s0 = UNITLAYERS.myunits,
                    s1 = UNITLAYERS.oppwild;
                  for (k in s0) {
                    ret[k] = 1;
                  }
                  for (k in s1) {
                    ret[k] = 1;
                  }
                  return ret;
                }());
              for (var key in s0) {
                if (s1[key]) {
                  ret[key] = s0[key];
                }
              }
              return ret;
            }())).length > 3)) {
          var winner = 1;
          var result = winner === 1 ? 'win' : winner ? 'lose' : 'draw';
          turn.links[newstepid][result] = 'tookcenter';
          turn.endMarks[newstepid] = turn.endMarks[newstepid] ||  {};
          turn.endMarks[newstepid].tookcenter = TERRAIN.middle;
        } else turn.links[newstepid].endturn = "start" + otherplayer;
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
          "movetargets": {},
          "winline": {}
        };
        var UNITDATA = step.UNITDATA;
        var UNITLAYERS = {
          "soldiers": {},
          "mysoldiers": {},
          "oppsoldiers": {},
          "neutralsoldiers": {},
          "wild": {},
          "mywild": {},
          "oppwild": {},
          "neutralwild": {},
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
        return ((turn.turn > 2) ? collapseLine({
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
            text: "or"
          }, {
            type: "unittyperef",
            alias: "king",
            name: "king".replace(/s$/, '')
          }, {
            type: 'text',
            text: "to"
          }, {
            type: 'cmndref',
            cmnd: "move"
          }]
        }) : collapseLine({
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
            text: "to"
          }, {
            type: 'cmndref',
            cmnd: "promote"
          }]
        }));
      };
      game.debug1 = function() {
        return {
          TERRAIN: TERRAIN
        };
      }
    })();
    (function() {
      var TERRAIN = terrainLayers(boardDef, 2);
      var ownernames = ["neutral", "opp", "my"];
      var player = 2;
      var otherplayer = 1;
      game.selectunit2 = function(turn, step, markpos) {
        var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {
          movetargets: Object.assign({}, step.ARTIFACTS.movetargets)
        });
        var UNITLAYERS = step.UNITLAYERS;
        var MARKS = {
          selectunit: markpos
        };
        var STARTPOS = MARKS["selectunit"];
        var neighbourdirs = [1, 2, 3, 4, 5, 6, 7, 8];
        var startconnections = connections[STARTPOS];
        for (var dirnbr = 0; dirnbr < 8; dirnbr++) {
          var POS = startconnections[neighbourdirs[dirnbr]];
          if (POS && !UNITLAYERS.units[POS]) {
            ARTIFACTS["movetargets"][POS] = {};
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
        if ((3 > turn.turn)) {
          turn.links[newstepid].promote = 'promote2';
        } else {
          var newlinks = turn.links[newstepid];
          for (var linkpos in ARTIFACTS.movetargets) {
            newlinks[linkpos] = 'selectmovetarget2';
          }
        }
        return newstep;
      };
      game.selectunit2instruction = function(turn, step) {
        var MARKS = step.MARKS;
        var UNITLAYERS = step.UNITLAYERS;
        return ((turn.turn > 2) ? collapseLine({
          type: 'line',
          content: [{
            type: 'text',
            text: "Select where to"
          }, {
            type: 'cmndref',
            cmnd: "move"
          }, {
            type: 'text',
            text: "the"
          }, {
            type: "unittyperef",
            name: game.graphics.icons[(UNITLAYERS.units[MARKS["selectunit"]] || {})["group"]]
          }, !!(UNITLAYERS.wild[MARKS["selectunit"]]) ? {
            type: 'text',
            text: "(remeber that it matches for your opponent too!)"
          } : {
            type: 'nothing'
          }]
        }) : collapseLine({
          type: 'line',
          content: [{
            type: 'text',
            text: "Press"
          }, {
            type: 'cmndref',
            cmnd: "promote"
          }, {
            type: 'text',
            text: "to turn this"
          }, {
            type: "unittyperef",
            alias: "pawn",
            name: "pawn".replace(/s$/, '')
          }, {
            type: 'text',
            text: "to a"
          }, {
            type: "unittyperef",
            alias: "king",
            name: "king".replace(/s$/, '')
          }, {
            type: 'text',
            text: ", making it match for your opponent too"
          }]
        }));
      };
      game.selectmovetarget2 = function(turn, step, markpos) {
        var MARKS = {
          selectmovetarget: markpos,
          selectunit: step.MARKS.selectunit
        };
        var newstepid = step.stepid + '-' + markpos;
        var newstep = turn.steps[newstepid] = Object.assign({}, step, {
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
            text: "to go from"
          }, {
            type: 'posref',
            pos: MARKS["selectunit"]
          }, {
            type: 'text',
            text: "to"
          }, {
            type: 'posref',
            pos: MARKS["selectmovetarget"]
          }]
        });
      };
      game.promote2 = function(turn, step) {
        var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {});
        var MARKS = step.MARKS;
        var UNITDATA = Object.assign({}, step.UNITDATA);
        var UNITLAYERS = step.UNITLAYERS;
        var unitid = (UNITLAYERS.units[MARKS["selectunit"]]  || {}).id;
        if (unitid) {
          UNITDATA[unitid] = Object.assign({}, UNITDATA[unitid], {
            "group": "wild"
          });
        }
        MARKS = {};
        UNITLAYERS = {
          "soldiers": {},
          "mysoldiers": {},
          "oppsoldiers": {},
          "neutralsoldiers": {},
          "wild": {},
          "mywild": {},
          "oppwild": {},
          "neutralwild": {},
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
          "movetargets": {},
          "winline": {}
        };
        var newstepid = step.stepid + '-' + 'promote';
        var newstep = turn.steps[newstepid] = Object.assign({}, step, {
          ARTIFACTS: ARTIFACTS,
          MARKS: MARKS,
          UNITDATA: UNITDATA,
          UNITLAYERS: UNITLAYERS,
          stepid: newstepid,
          name: 'promote',
          path: step.path.concat('promote')
        });
        turn.links[newstepid] = {};
        if (Object.keys(ARTIFACTS.winline).length !== 0) {
          var winner = 2;
          var result = winner === 2 ? 'win' : winner ? 'lose' : 'draw';
          turn.links[newstepid][result] = 'madeline';
          turn.endMarks[newstepid] = turn.endMarks[newstepid] ||  {};
          turn.endMarks[newstepid].madeline = ARTIFACTS.winline;
        } else
        if ((Object.keys(
            (function() {
              var ret = {},
                s0 = TERRAIN.corners,
                s1 =
                (function() {
                  var k, ret = {},
                    s0 = UNITLAYERS.myunits,
                    s1 = UNITLAYERS.oppwild;
                  for (k in s0) {
                    ret[k] = 1;
                  }
                  for (k in s1) {
                    ret[k] = 1;
                  }
                  return ret;
                }());
              for (var key in s0) {
                if (s1[key]) {
                  ret[key] = s0[key];
                }
              }
              return ret;
            }())).length > 3)) {
          var winner = 2;
          var result = winner === 2 ? 'win' : winner ? 'lose' : 'draw';
          turn.links[newstepid][result] = 'madex';
          turn.endMarks[newstepid] = turn.endMarks[newstepid] ||  {};
          turn.endMarks[newstepid].madex = TERRAIN.corners;
        } else
        if ((Object.keys(
            (function() {
              var ret = {},
                s0 = TERRAIN.middle,
                s1 =
                (function() {
                  var k, ret = {},
                    s0 = UNITLAYERS.myunits,
                    s1 = UNITLAYERS.oppwild;
                  for (k in s0) {
                    ret[k] = 1;
                  }
                  for (k in s1) {
                    ret[k] = 1;
                  }
                  return ret;
                }());
              for (var key in s0) {
                if (s1[key]) {
                  ret[key] = s0[key];
                }
              }
              return ret;
            }())).length > 3)) {
          var winner = 2;
          var result = winner === 2 ? 'win' : winner ? 'lose' : 'draw';
          turn.links[newstepid][result] = 'tookcenter';
          turn.endMarks[newstepid] = turn.endMarks[newstepid] ||  {};
          turn.endMarks[newstepid].tookcenter = TERRAIN.middle;
        } else turn.links[newstepid].endturn = "start" + otherplayer;
        return newstep;
      }
      game.promote2instruction = function(turn, step) {
        return {
          type: 'text',
          text: ""
        };
      };
      game.move2 = function(turn, step) {
        var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {
          winline: Object.assign({}, step.ARTIFACTS.winline)
        });
        var MARKS = step.MARKS;
        var UNITDATA = Object.assign({}, step.UNITDATA);
        var UNITLAYERS = step.UNITLAYERS;
        var unitid = (UNITLAYERS.units[MARKS["selectunit"]]  || {}).id;
        if (unitid) {
          UNITDATA[unitid] = Object.assign({}, UNITDATA[unitid], {
            "pos": MARKS["selectmovetarget"]
          });
        }
        MARKS = {};
        UNITLAYERS = {
          "soldiers": {},
          "mysoldiers": {},
          "oppsoldiers": {},
          "neutralsoldiers": {},
          "wild": {},
          "mywild": {},
          "oppwild": {},
          "neutralwild": {},
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
          "movetargets": {},
          "winline": {}
        };
        var allowedsteps =
          (function() {
            var k, ret = {},
              s0 = UNITLAYERS.myunits,
              s1 = UNITLAYERS.oppwild;
            for (k in s0) {
              ret[k] = 1;
            }
            for (k in s1) {
              ret[k] = 1;
            }
            return ret;
          }());
        var walkstarts =
          (function() {
            var k, ret = {},
              s0 = UNITLAYERS.myunits,
              s1 = UNITLAYERS.oppwild;
            for (k in s0) {
              ret[k] = 1;
            }
            for (k in s1) {
              ret[k] = 1;
            }
            return ret;
          }());
        for (var STARTPOS in walkstarts) {
          var allwalkerdirs = [1, 2, 3, 4, 5, 6, 7, 8];
          for (var walkerdirnbr = 0; walkerdirnbr < 8; walkerdirnbr++) {
            var DIR = allwalkerdirs[walkerdirnbr];
            var walkedsquares = [];
            var POS = "faux";
            connections.faux[DIR] = STARTPOS;
            var walkpositionstocount = TERRAIN.mybase;
            var CURRENTCOUNT = 0;
            while ((POS = connections[POS][DIR]) && allowedsteps[POS]) {
              walkedsquares.push(POS);
              CURRENTCOUNT += (walkpositionstocount[POS] ? 1 : 0);
            }
            var WALKLENGTH = walkedsquares.length;
            var TOTALCOUNT = CURRENTCOUNT;
            for (var walkstepper = 0; walkstepper < WALKLENGTH; walkstepper++) {
              POS = walkedsquares[walkstepper];
              if (((WALKLENGTH === 4) && (TOTALCOUNT !== 4))) {
                ARTIFACTS["winline"][POS] = {};
              }
            }
          }
        }
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
        if (Object.keys(ARTIFACTS.winline).length !== 0) {
          var winner = 2;
          var result = winner === 2 ? 'win' : winner ? 'lose' : 'draw';
          turn.links[newstepid][result] = 'madeline';
          turn.endMarks[newstepid] = turn.endMarks[newstepid] ||  {};
          turn.endMarks[newstepid].madeline = ARTIFACTS.winline;
        } else
        if ((Object.keys(
            (function() {
              var ret = {},
                s0 = TERRAIN.corners,
                s1 =
                (function() {
                  var k, ret = {},
                    s0 = UNITLAYERS.myunits,
                    s1 = UNITLAYERS.oppwild;
                  for (k in s0) {
                    ret[k] = 1;
                  }
                  for (k in s1) {
                    ret[k] = 1;
                  }
                  return ret;
                }());
              for (var key in s0) {
                if (s1[key]) {
                  ret[key] = s0[key];
                }
              }
              return ret;
            }())).length > 3)) {
          var winner = 2;
          var result = winner === 2 ? 'win' : winner ? 'lose' : 'draw';
          turn.links[newstepid][result] = 'madex';
          turn.endMarks[newstepid] = turn.endMarks[newstepid] ||  {};
          turn.endMarks[newstepid].madex = TERRAIN.corners;
        } else
        if ((Object.keys(
            (function() {
              var ret = {},
                s0 = TERRAIN.middle,
                s1 =
                (function() {
                  var k, ret = {},
                    s0 = UNITLAYERS.myunits,
                    s1 = UNITLAYERS.oppwild;
                  for (k in s0) {
                    ret[k] = 1;
                  }
                  for (k in s1) {
                    ret[k] = 1;
                  }
                  return ret;
                }());
              for (var key in s0) {
                if (s1[key]) {
                  ret[key] = s0[key];
                }
              }
              return ret;
            }())).length > 3)) {
          var winner = 2;
          var result = winner === 2 ? 'win' : winner ? 'lose' : 'draw';
          turn.links[newstepid][result] = 'tookcenter';
          turn.endMarks[newstepid] = turn.endMarks[newstepid] ||  {};
          turn.endMarks[newstepid].tookcenter = TERRAIN.middle;
        } else turn.links[newstepid].endturn = "start" + otherplayer;
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
          "movetargets": {},
          "winline": {}
        };
        var UNITDATA = step.UNITDATA;
        var UNITLAYERS = {
          "soldiers": {},
          "mysoldiers": {},
          "oppsoldiers": {},
          "neutralsoldiers": {},
          "wild": {},
          "mywild": {},
          "oppwild": {},
          "neutralwild": {},
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
        return ((turn.turn > 2) ? collapseLine({
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
            text: "or"
          }, {
            type: "unittyperef",
            alias: "king",
            name: "king".replace(/s$/, '')
          }, {
            type: 'text',
            text: "to"
          }, {
            type: 'cmndref',
            cmnd: "move"
          }]
        }) : collapseLine({
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
            text: "to"
          }, {
            type: 'cmndref',
            cmnd: "promote"
          }]
        }));
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