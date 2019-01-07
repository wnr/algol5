(
  function() {
    var game = {};
    game.commands = {
      "move": 1
    };
    game.graphics = {
      "icons": {
        "soldiers": "pawn",
        "kings": "king"
      },
      "tiles": {
        "homerow": "playercolour"
      }
    };
    game.board = {
      "height": 5,
      "width": 5,
      "terrain": {
        "homerow": {
          "1": [
            ["rect", "a1", "e1"]
          ],
          "2": [
            ["rect", "a5", "e5"]
          ]
        }
      }
    };
    game.AI = [];
    game.id = "uglyduck";
    var boardDef = {
      "height": 5,
      "width": 5,
      "terrain": {
        "homerow": {
          "1": [
            ["rect", "a1", "e1"]
          ],
          "2": [
            ["rect", "a5", "e5"]
          ]
        }
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
              ["rect", "a1", "e1"]
            ],
            "2": [
              ["rect", "a5", "e5"]
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
        var ARTIFACTS = {
          movetargets: Object.assign({}, step.ARTIFACTS.movetargets)
        };
        var UNITLAYERS = step.UNITLAYERS;
        var MARKS = {
          selectunit: markpos
        };
        var STARTPOS = MARKS["selectunit"];
        var neighbourdirs = (!!(UNITLAYERS.mykings[MARKS["selectunit"]]) ? [4, 5, 6] : [8, 1, 2]);
        var startconnections = connections[STARTPOS];
        for (var dirnbr = 0; dirnbr < 3; dirnbr++) {
          var DIR = neighbourdirs[dirnbr];
          var POS = startconnections[DIR];
          if (POS && (((DIR === 1) || (DIR === 5)) ? !(UNITLAYERS.units[POS]) : !(UNITLAYERS.myunits[POS]))) {
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
        var newlinks = turn.links[newstepid];
        for (var linkpos in ARTIFACTS.movetargets) {
          newlinks[linkpos] = 'selectmovetarget1';
        }
        return newstep;
      };
      game.selectunit1instruction = function(turn, step) {
        var MARKS = step.MARKS;
        var UNITLAYERS = step.UNITLAYERS;
        return (!!(UNITLAYERS.mykings[MARKS["selectunit"]]) ? collapseLine({
          type: 'line',
          content: [{
            type: 'text',
            text: "Select a square closer to home to move your"
          }, {
            type: "unittyperef",
            alias: "king",
            name: "king".replace(/s$/, '')
          }, {
            type: 'text',
            text: "to"
          }]
        }) : collapseLine({
          type: 'line',
          content: [{
            type: 'text',
            text: "Select a square closer to the enemy lines to move your"
          }, {
            type: "unittyperef",
            alias: "pawn",
            name: "pawn".replace(/s$/, '')
          }, {
            type: 'text',
            text: "to"
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
        var UNITLAYERS = step.UNITLAYERS;
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
            text: "to"
          }, (!!(UNITLAYERS.mykings[MARKS["selectunit"]]) ? collapseLine({
            type: 'line',
            content: [{
              type: 'text',
              text: "retreat your"
            }, {
              type: "unittyperef",
              alias: "king",
              name: "king".replace(/s$/, '')
            }]
          }) : collapseLine({
            type: 'line',
            content: [{
              type: 'text',
              text: "advance your"
            }, {
              type: "unittyperef",
              alias: "pawn",
              name: "pawn".replace(/s$/, '')
            }]
          })), {
            type: 'text',
            text: "from"
          }, {
            type: 'posref',
            pos: MARKS["selectunit"]
          }, (!!(TERRAIN.opphomerow[MARKS["selectmovetarget"]]) ? collapseLine({
            type: 'line',
            content: [{
              type: 'text',
              text: "into the opponent base at"
            }, {
              type: 'posref',
              pos: MARKS["selectmovetarget"]
            }]
          }) : (!!(TERRAIN.myhomerow[MARKS["selectmovetarget"]]) ? collapseLine({
            type: 'line',
            content: [{
              type: 'text',
              text: "back home to"
            }, {
              type: 'posref',
              pos: MARKS["selectmovetarget"]
            }]
          }) : collapseLine({
            type: 'line',
            content: [{
              type: 'text',
              text: "to"
            }, {
              type: 'posref',
              pos: MARKS["selectmovetarget"]
            }]
          }))), !!(UNITLAYERS.oppunits[MARKS["selectmovetarget"]]) ? collapseLine({
            type: 'line',
            content: [{
              type: 'text',
              text: ", killing the enemy"
            }, {
              type: "unittyperef",
              name: game.graphics.icons[(UNITLAYERS.units[MARKS["selectmovetarget"]] || {})["group"]]
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
        if (!!(TERRAIN.opphomerow[MARKS["selectmovetarget"]])) {
          var unitid = (UNITLAYERS.units[MARKS["selectunit"]]  || {}).id;
          if (unitid) {
            UNITDATA[unitid] = Object.assign({}, UNITDATA[unitid], {
              "group": "kings"
            });
          }
        }
        var unitid = (UNITLAYERS.units[MARKS["selectunit"]]  || {}).id;
        if (unitid) {
          UNITDATA[unitid] = Object.assign({}, UNITDATA[unitid], {
            "pos": MARKS["selectmovetarget"]
          });
          delete UNITDATA[(UNITLAYERS.units[MARKS["selectmovetarget"]]  || {}).id];
        }
        MARKS = {};
        UNITLAYERS = {
          "soldiers": {},
          "mysoldiers": {},
          "oppsoldiers": {},
          "neutralsoldiers": {},
          "kings": {},
          "mykings": {},
          "oppkings": {},
          "neutralkings": {},
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
        if (Object.keys(
            (function() {
              var ret = {},
                s0 = UNITLAYERS.mykings,
                s1 = TERRAIN.myhomerow;
              for (var key in s0) {
                if (s1[key]) {
                  ret[key] = s0[key];
                }
              }
              return ret;
            }())).length !== 0) {
          var winner = 1;
          var result = winner === 1 ? 'win' : winner ? 'lose' : 'draw';
          turn.links[newstepid][result] = 'swanhome';
          turn.endMarks[newstepid] = turn.endMarks[newstepid] ||  {};
          turn.endMarks[newstepid].swanhome =
            (function() {
              var ret = {},
                s0 = UNITLAYERS.mykings,
                s1 = TERRAIN.myhomerow;
              for (var key in s0) {
                if (s1[key]) {
                  ret[key] = s0[key];
                }
              }
              return ret;
            }());
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
          "movetargets": {}
        };
        var UNITDATA = step.UNITDATA;
        var UNITLAYERS = {
          "soldiers": {},
          "mysoldiers": {},
          "oppsoldiers": {},
          "neutralsoldiers": {},
          "kings": {},
          "mykings": {},
          "oppkings": {},
          "neutralkings": {},
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
        var UNITLAYERS = step.UNITLAYERS;
        return collapseLine({
          type: 'line',
          content: [{
              type: 'text',
              text: "Select"
            },
            [{
              cond: Object.keys(UNITLAYERS.mysoldiers).length !== 0,
              content: collapseLine({
                type: 'line',
                content: [{
                  type: 'text',
                  text: "a"
                }, {
                  type: "unittyperef",
                  alias: "pawn",
                  name: "pawn".replace(/s$/, '')
                }, {
                  type: 'text',
                  text: "to advance"
                }]
              })
            }, {
              cond: Object.keys(UNITLAYERS.mykings).length !== 0,
              content: collapseLine({
                type: 'line',
                content: [{
                  type: 'text',
                  text: "a"
                }, {
                  type: "unittyperef",
                  alias: "king",
                  name: "king".replace(/s$/, '')
                }, {
                  type: 'text',
                  text: "to retreat"
                }]
              })
            }].filter(function(elem) {
              return elem.cond;
            }).reduce(function(mem, elem, n, list) {
              mem.content.push(elem.content);
              if (n === list.length - 2) {
                mem.content.push("or");
              } else if (n < list.length - 2) {
                mem.content.push(",");
              }
              return mem;
            }, {
              type: "line",
              content: []
            })
          ]
        });
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
        var ARTIFACTS = {
          movetargets: Object.assign({}, step.ARTIFACTS.movetargets)
        };
        var UNITLAYERS = step.UNITLAYERS;
        var MARKS = {
          selectunit: markpos
        };
        var STARTPOS = MARKS["selectunit"];
        var neighbourdirs = (!!(UNITLAYERS.mykings[MARKS["selectunit"]]) ? [8, 1, 2] : [4, 5, 6]);
        var startconnections = connections[STARTPOS];
        for (var dirnbr = 0; dirnbr < 3; dirnbr++) {
          var DIR = neighbourdirs[dirnbr];
          var POS = startconnections[DIR];
          if (POS && (((DIR === 1) || (DIR === 5)) ? !(UNITLAYERS.units[POS]) : !(UNITLAYERS.myunits[POS]))) {
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
        var newlinks = turn.links[newstepid];
        for (var linkpos in ARTIFACTS.movetargets) {
          newlinks[linkpos] = 'selectmovetarget2';
        }
        return newstep;
      };
      game.selectunit2instruction = function(turn, step) {
        var MARKS = step.MARKS;
        var UNITLAYERS = step.UNITLAYERS;
        return (!!(UNITLAYERS.mykings[MARKS["selectunit"]]) ? collapseLine({
          type: 'line',
          content: [{
            type: 'text',
            text: "Select a square closer to home to move your"
          }, {
            type: "unittyperef",
            alias: "king",
            name: "king".replace(/s$/, '')
          }, {
            type: 'text',
            text: "to"
          }]
        }) : collapseLine({
          type: 'line',
          content: [{
            type: 'text',
            text: "Select a square closer to the enemy lines to move your"
          }, {
            type: "unittyperef",
            alias: "pawn",
            name: "pawn".replace(/s$/, '')
          }, {
            type: 'text',
            text: "to"
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
        var UNITLAYERS = step.UNITLAYERS;
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
            text: "to"
          }, (!!(UNITLAYERS.mykings[MARKS["selectunit"]]) ? collapseLine({
            type: 'line',
            content: [{
              type: 'text',
              text: "retreat your"
            }, {
              type: "unittyperef",
              alias: "king",
              name: "king".replace(/s$/, '')
            }]
          }) : collapseLine({
            type: 'line',
            content: [{
              type: 'text',
              text: "advance your"
            }, {
              type: "unittyperef",
              alias: "pawn",
              name: "pawn".replace(/s$/, '')
            }]
          })), {
            type: 'text',
            text: "from"
          }, {
            type: 'posref',
            pos: MARKS["selectunit"]
          }, (!!(TERRAIN.opphomerow[MARKS["selectmovetarget"]]) ? collapseLine({
            type: 'line',
            content: [{
              type: 'text',
              text: "into the opponent base at"
            }, {
              type: 'posref',
              pos: MARKS["selectmovetarget"]
            }]
          }) : (!!(TERRAIN.myhomerow[MARKS["selectmovetarget"]]) ? collapseLine({
            type: 'line',
            content: [{
              type: 'text',
              text: "back home to"
            }, {
              type: 'posref',
              pos: MARKS["selectmovetarget"]
            }]
          }) : collapseLine({
            type: 'line',
            content: [{
              type: 'text',
              text: "to"
            }, {
              type: 'posref',
              pos: MARKS["selectmovetarget"]
            }]
          }))), !!(UNITLAYERS.oppunits[MARKS["selectmovetarget"]]) ? collapseLine({
            type: 'line',
            content: [{
              type: 'text',
              text: ", killing the enemy"
            }, {
              type: "unittyperef",
              name: game.graphics.icons[(UNITLAYERS.units[MARKS["selectmovetarget"]] || {})["group"]]
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
        if (!!(TERRAIN.opphomerow[MARKS["selectmovetarget"]])) {
          var unitid = (UNITLAYERS.units[MARKS["selectunit"]]  || {}).id;
          if (unitid) {
            UNITDATA[unitid] = Object.assign({}, UNITDATA[unitid], {
              "group": "kings"
            });
          }
        }
        var unitid = (UNITLAYERS.units[MARKS["selectunit"]]  || {}).id;
        if (unitid) {
          UNITDATA[unitid] = Object.assign({}, UNITDATA[unitid], {
            "pos": MARKS["selectmovetarget"]
          });
          delete UNITDATA[(UNITLAYERS.units[MARKS["selectmovetarget"]]  || {}).id];
        }
        MARKS = {};
        UNITLAYERS = {
          "soldiers": {},
          "mysoldiers": {},
          "oppsoldiers": {},
          "neutralsoldiers": {},
          "kings": {},
          "mykings": {},
          "oppkings": {},
          "neutralkings": {},
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
        if (Object.keys(
            (function() {
              var ret = {},
                s0 = UNITLAYERS.mykings,
                s1 = TERRAIN.myhomerow;
              for (var key in s0) {
                if (s1[key]) {
                  ret[key] = s0[key];
                }
              }
              return ret;
            }())).length !== 0) {
          var winner = 2;
          var result = winner === 2 ? 'win' : winner ? 'lose' : 'draw';
          turn.links[newstepid][result] = 'swanhome';
          turn.endMarks[newstepid] = turn.endMarks[newstepid] ||  {};
          turn.endMarks[newstepid].swanhome =
            (function() {
              var ret = {},
                s0 = UNITLAYERS.mykings,
                s1 = TERRAIN.myhomerow;
              for (var key in s0) {
                if (s1[key]) {
                  ret[key] = s0[key];
                }
              }
              return ret;
            }());
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
          "movetargets": {}
        };
        var UNITDATA = step.UNITDATA;
        var UNITLAYERS = {
          "soldiers": {},
          "mysoldiers": {},
          "oppsoldiers": {},
          "neutralsoldiers": {},
          "kings": {},
          "mykings": {},
          "oppkings": {},
          "neutralkings": {},
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
        var UNITLAYERS = step.UNITLAYERS;
        return collapseLine({
          type: 'line',
          content: [{
              type: 'text',
              text: "Select"
            },
            [{
              cond: Object.keys(UNITLAYERS.mysoldiers).length !== 0,
              content: collapseLine({
                type: 'line',
                content: [{
                  type: 'text',
                  text: "a"
                }, {
                  type: "unittyperef",
                  alias: "pawn",
                  name: "pawn".replace(/s$/, '')
                }, {
                  type: 'text',
                  text: "to advance"
                }]
              })
            }, {
              cond: Object.keys(UNITLAYERS.mykings).length !== 0,
              content: collapseLine({
                type: 'line',
                content: [{
                  type: 'text',
                  text: "a"
                }, {
                  type: "unittyperef",
                  alias: "king",
                  name: "king".replace(/s$/, '')
                }, {
                  type: 'text',
                  text: "to retreat"
                }]
              })
            }].filter(function(elem) {
              return elem.cond;
            }).reduce(function(mem, elem, n, list) {
              mem.content.push(elem.content);
              if (n === list.length - 2) {
                mem.content.push("or");
              } else if (n < list.length - 2) {
                mem.content.push(",");
              }
              return mem;
            }, {
              type: "line",
              content: []
            })
          ]
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