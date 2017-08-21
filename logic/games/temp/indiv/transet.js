(
  function() {
    var game = {};
    var connections = {
      "faux": {},
      "a1": {
        "1": "a2",
        "2": "b2",
        "3": "b1"
      },
      "a2": {
        "1": "a3",
        "2": "b3",
        "3": "b2",
        "4": "b1",
        "5": "a1"
      },
      "a3": {
        "1": "a4",
        "2": "b4",
        "3": "b3",
        "4": "b2",
        "5": "a2"
      },
      "a4": {
        "1": "a5",
        "2": "b5",
        "3": "b4",
        "4": "b3",
        "5": "a3"
      },
      "a5": {
        "3": "b5",
        "4": "b4",
        "5": "a4"
      },
      "b1": {
        "1": "b2",
        "2": "c2",
        "3": "c1",
        "7": "a1",
        "8": "a2"
      },
      "b2": {
        "1": "b3",
        "2": "c3",
        "3": "c2",
        "4": "c1",
        "5": "b1",
        "6": "a1",
        "7": "a2",
        "8": "a3"
      },
      "b3": {
        "1": "b4",
        "2": "c4",
        "3": "c3",
        "4": "c2",
        "5": "b2",
        "6": "a2",
        "7": "a3",
        "8": "a4"
      },
      "b4": {
        "1": "b5",
        "2": "c5",
        "3": "c4",
        "4": "c3",
        "5": "b3",
        "6": "a3",
        "7": "a4",
        "8": "a5"
      },
      "b5": {
        "3": "c5",
        "4": "c4",
        "5": "b4",
        "6": "a4",
        "7": "a5"
      },
      "c1": {
        "1": "c2",
        "2": "d2",
        "3": "d1",
        "7": "b1",
        "8": "b2"
      },
      "c2": {
        "1": "c3",
        "2": "d3",
        "3": "d2",
        "4": "d1",
        "5": "c1",
        "6": "b1",
        "7": "b2",
        "8": "b3"
      },
      "c3": {
        "1": "c4",
        "2": "d4",
        "3": "d3",
        "4": "d2",
        "5": "c2",
        "6": "b2",
        "7": "b3",
        "8": "b4"
      },
      "c4": {
        "1": "c5",
        "2": "d5",
        "3": "d4",
        "4": "d3",
        "5": "c3",
        "6": "b3",
        "7": "b4",
        "8": "b5"
      },
      "c5": {
        "3": "d5",
        "4": "d4",
        "5": "c4",
        "6": "b4",
        "7": "b5"
      },
      "d1": {
        "1": "d2",
        "2": "e2",
        "3": "e1",
        "7": "c1",
        "8": "c2"
      },
      "d2": {
        "1": "d3",
        "2": "e3",
        "3": "e2",
        "4": "e1",
        "5": "d1",
        "6": "c1",
        "7": "c2",
        "8": "c3"
      },
      "d3": {
        "1": "d4",
        "2": "e4",
        "3": "e3",
        "4": "e2",
        "5": "d2",
        "6": "c2",
        "7": "c3",
        "8": "c4"
      },
      "d4": {
        "1": "d5",
        "2": "e5",
        "3": "e4",
        "4": "e3",
        "5": "d3",
        "6": "c3",
        "7": "c4",
        "8": "c5"
      },
      "d5": {
        "3": "e5",
        "4": "e4",
        "5": "d4",
        "6": "c4",
        "7": "c5"
      },
      "e1": {
        "1": "e2",
        "7": "d1",
        "8": "d2"
      },
      "e2": {
        "1": "e3",
        "5": "e1",
        "6": "d1",
        "7": "d2",
        "8": "d3"
      },
      "e3": {
        "1": "e4",
        "5": "e2",
        "6": "d2",
        "7": "d3",
        "8": "d4"
      },
      "e4": {
        "1": "e5",
        "5": "e3",
        "6": "d3",
        "7": "d4",
        "8": "d5"
      },
      "e5": {
        "5": "e4",
        "6": "d4",
        "7": "d5"
      }
    };
    var BOARD = {
      "board": {
        "a1": {
          "colour": "dark",
          "pos": "a1",
          "x": 1,
          "y": 1
        },
        "a2": {
          "colour": "light",
          "pos": "a2",
          "x": 1,
          "y": 2
        },
        "a3": {
          "colour": "dark",
          "pos": "a3",
          "x": 1,
          "y": 3
        },
        "a4": {
          "colour": "light",
          "pos": "a4",
          "x": 1,
          "y": 4
        },
        "a5": {
          "colour": "dark",
          "pos": "a5",
          "x": 1,
          "y": 5
        },
        "b1": {
          "colour": "light",
          "pos": "b1",
          "x": 2,
          "y": 1
        },
        "b2": {
          "colour": "dark",
          "pos": "b2",
          "x": 2,
          "y": 2
        },
        "b3": {
          "colour": "light",
          "pos": "b3",
          "x": 2,
          "y": 3
        },
        "b4": {
          "colour": "dark",
          "pos": "b4",
          "x": 2,
          "y": 4
        },
        "b5": {
          "colour": "light",
          "pos": "b5",
          "x": 2,
          "y": 5
        },
        "c1": {
          "colour": "dark",
          "pos": "c1",
          "x": 3,
          "y": 1
        },
        "c2": {
          "colour": "light",
          "pos": "c2",
          "x": 3,
          "y": 2
        },
        "c3": {
          "colour": "dark",
          "pos": "c3",
          "x": 3,
          "y": 3
        },
        "c4": {
          "colour": "light",
          "pos": "c4",
          "x": 3,
          "y": 4
        },
        "c5": {
          "colour": "dark",
          "pos": "c5",
          "x": 3,
          "y": 5
        },
        "d1": {
          "colour": "light",
          "pos": "d1",
          "x": 4,
          "y": 1
        },
        "d2": {
          "colour": "dark",
          "pos": "d2",
          "x": 4,
          "y": 2
        },
        "d3": {
          "colour": "light",
          "pos": "d3",
          "x": 4,
          "y": 3
        },
        "d4": {
          "colour": "dark",
          "pos": "d4",
          "x": 4,
          "y": 4
        },
        "d5": {
          "colour": "light",
          "pos": "d5",
          "x": 4,
          "y": 5
        },
        "e1": {
          "colour": "dark",
          "pos": "e1",
          "x": 5,
          "y": 1
        },
        "e2": {
          "colour": "light",
          "pos": "e2",
          "x": 5,
          "y": 2
        },
        "e3": {
          "colour": "dark",
          "pos": "e3",
          "x": 5,
          "y": 3
        },
        "e4": {
          "colour": "light",
          "pos": "e4",
          "x": 5,
          "y": 4
        },
        "e5": {
          "colour": "dark",
          "pos": "e5",
          "x": 5,
          "y": 5
        }
      },
      "light": {
        "a2": {
          "colour": "light",
          "pos": "a2",
          "x": 1,
          "y": 2
        },
        "a4": {
          "colour": "light",
          "pos": "a4",
          "x": 1,
          "y": 4
        },
        "b1": {
          "colour": "light",
          "pos": "b1",
          "x": 2,
          "y": 1
        },
        "b3": {
          "colour": "light",
          "pos": "b3",
          "x": 2,
          "y": 3
        },
        "b5": {
          "colour": "light",
          "pos": "b5",
          "x": 2,
          "y": 5
        },
        "c2": {
          "colour": "light",
          "pos": "c2",
          "x": 3,
          "y": 2
        },
        "c4": {
          "colour": "light",
          "pos": "c4",
          "x": 3,
          "y": 4
        },
        "d1": {
          "colour": "light",
          "pos": "d1",
          "x": 4,
          "y": 1
        },
        "d3": {
          "colour": "light",
          "pos": "d3",
          "x": 4,
          "y": 3
        },
        "d5": {
          "colour": "light",
          "pos": "d5",
          "x": 4,
          "y": 5
        },
        "e2": {
          "colour": "light",
          "pos": "e2",
          "x": 5,
          "y": 2
        },
        "e4": {
          "colour": "light",
          "pos": "e4",
          "x": 5,
          "y": 4
        }
      },
      "dark": {
        "a1": {
          "colour": "dark",
          "pos": "a1",
          "x": 1,
          "y": 1
        },
        "a3": {
          "colour": "dark",
          "pos": "a3",
          "x": 1,
          "y": 3
        },
        "a5": {
          "colour": "dark",
          "pos": "a5",
          "x": 1,
          "y": 5
        },
        "b2": {
          "colour": "dark",
          "pos": "b2",
          "x": 2,
          "y": 2
        },
        "b4": {
          "colour": "dark",
          "pos": "b4",
          "x": 2,
          "y": 4
        },
        "c1": {
          "colour": "dark",
          "pos": "c1",
          "x": 3,
          "y": 1
        },
        "c3": {
          "colour": "dark",
          "pos": "c3",
          "x": 3,
          "y": 3
        },
        "c5": {
          "colour": "dark",
          "pos": "c5",
          "x": 3,
          "y": 5
        },
        "d2": {
          "colour": "dark",
          "pos": "d2",
          "x": 4,
          "y": 2
        },
        "d4": {
          "colour": "dark",
          "pos": "d4",
          "x": 4,
          "y": 4
        },
        "e1": {
          "colour": "dark",
          "pos": "e1",
          "x": 5,
          "y": 1
        },
        "e3": {
          "colour": "dark",
          "pos": "e3",
          "x": 5,
          "y": 3
        },
        "e5": {
          "colour": "dark",
          "pos": "e5",
          "x": 5,
          "y": 5
        }
      }
    };
    var relativedirs = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    (function() {
      var TERRAIN = {
        "base": {
          "a1": {
            "pos": "a1",
            "owner": 1
          },
          "b1": {
            "pos": "b1",
            "owner": 1
          },
          "c1": {
            "pos": "c1",
            "owner": 1
          },
          "d1": {
            "pos": "d1",
            "owner": 1
          },
          "e1": {
            "pos": "e1",
            "owner": 1
          },
          "a5": {
            "pos": "a5",
            "owner": 2
          },
          "b5": {
            "pos": "b5",
            "owner": 2
          },
          "c5": {
            "pos": "c5",
            "owner": 2
          },
          "d5": {
            "pos": "d5",
            "owner": 2
          },
          "e5": {
            "pos": "e5",
            "owner": 2
          }
        },
        "mybase": {
          "a1": {
            "pos": "a1",
            "owner": 1
          },
          "b1": {
            "pos": "b1",
            "owner": 1
          },
          "c1": {
            "pos": "c1",
            "owner": 1
          },
          "d1": {
            "pos": "d1",
            "owner": 1
          },
          "e1": {
            "pos": "e1",
            "owner": 1
          }
        },
        "oppbase": {
          "a5": {
            "pos": "a5",
            "owner": 2
          },
          "b5": {
            "pos": "b5",
            "owner": 2
          },
          "c5": {
            "pos": "c5",
            "owner": 2
          },
          "d5": {
            "pos": "d5",
            "owner": 2
          },
          "e5": {
            "pos": "e5",
            "owner": 2
          }
        }
      };
      var ownernames = ["neutral", "my", "opp"];
      var player = 1;
      var otherplayer = 2;
      game.selectunit1 =
        function(turn, step, markpos) {
          var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {
            movetargets: Object.assign({}, step.ARTIFACTS.movetargets)
          });
          var UNITLAYERS = step.UNITLAYERS;
          var MARKS = {
            selectunit: markpos
          };
          var STARTPOS = MARKS['selectunit'];
          var neighbourdirs = (!!(UNITLAYERS.pinets[MARKS['selectunit']]) ? [1] : (!!(UNITLAYERS.piokers[MARKS['selectunit']]) ? [8, 2] : [8, 1, 2]));
          var nbrofneighbourdirs = neighbourdirs.length;
          var startconnections = connections[STARTPOS];
          for (var dirnbr = 0; dirnbr < nbrofneighbourdirs; dirnbr++) {
            var POS = startconnections[neighbourdirs[dirnbr]];
            if (POS && !UNITLAYERS.myunits[POS]) {
              ARTIFACTS['movetargets'][POS] = {};
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
          var newlinks = turn.links[newstepid];
          for (var linkpos in
              (function() {
                var ret = {},
                  s0 = UNITLAYERS.myunits,
                  s1 =
                  (function() {
                    var ret = {};
                    ret[MARKS['selectunit']] = 1;
                    return ret;
                  }());
                for (var key in s0) {
                  if (!s1[key]) {
                    ret[key] = s0[key];
                  }
                }
                return ret;
              }())) {
            newlinks[linkpos] = 'selectswapunit1';
          }
          return newstep;
        };
      game.selectunit1instruction =
        function(step) {
          var MARKS = step.MARKS;
          var ARTIFACTS = step.ARTIFACTS;
          var UNITLAYERS = step.UNITLAYERS;
          var UNITDATA = step.UNITDATA;
          return ''
        };
      game.selectmovetarget1 =
        function(turn, step, markpos) {
          var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {});
          var UNITLAYERS = step.UNITLAYERS;
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
          if ((!!(UNITLAYERS.units[MARKS['selectmovetarget']]) && !(TERRAIN.oppbase[MARKS['selectmovetarget']]))) {
            var newlinks = turn.links[newstepid];
            for (var linkpos in
                (function() {
                  var ret = {},
                    s0 = TERRAIN.oppbase,
                    s1 = UNITLAYERS.oppunits;
                  for (var key in s0) {
                    if (!s1[key]) {
                      ret[key] = s0[key];
                    }
                  }
                  return ret;
                }())) {
              newlinks[linkpos] = 'selectdeportdestination1';
            }
          } else {
            turn.links[newstepid].move = 'move1';
          }
          return newstep;
        };
      game.selectmovetarget1instruction =
        function(step) {
          var MARKS = step.MARKS;
          var ARTIFACTS = step.ARTIFACTS;
          var UNITLAYERS = step.UNITLAYERS;
          var UNITDATA = step.UNITDATA;
          return ''
        };
      game.selectdeportdestination1 =
        function(turn, step, markpos) {
          var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {});
          var UNITLAYERS = step.UNITLAYERS;
          var MARKS = {
            selectdeportdestination: markpos,
            selectunit: step.MARKS.selectunit,
            selectmovetarget: step.MARKS.selectmovetarget
          };
          var newstepid = step.stepid + '-' + markpos;
          var newstep = turn.steps[newstepid] = Object.assign({}, step, {
            MARKS: MARKS,
            stepid: newstepid,
            path: step.path.concat(markpos),
            name: 'selectdeportdestination'
          });
          turn.links[newstepid] = {};
          turn.links[newstepid].move = 'move1';
          return newstep;
        };
      game.selectdeportdestination1instruction =
        function(step) {
          var MARKS = step.MARKS;
          var ARTIFACTS = step.ARTIFACTS;
          var UNITLAYERS = step.UNITLAYERS;
          var UNITDATA = step.UNITDATA;
          return ''
        };
      game.selectswapunit1 =
        function(turn, step, markpos) {
          var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {
            swap1steps: Object.assign({}, step.ARTIFACTS.swap1steps)
          });
          var UNITLAYERS = step.UNITLAYERS;
          var MARKS = {
            selectswapunit: markpos,
            selectunit: step.MARKS.selectunit
          };
          var STARTPOS = MARKS['selectunit'];
          var neighbourdirs = [1, 3, 5, 7];
          var startconnections = connections[STARTPOS];
          for (var dirnbr = 0; dirnbr < 4; dirnbr++) {
            var DIR = neighbourdirs[dirnbr];
            var POS = startconnections[DIR];
            if (POS && !UNITLAYERS.units[POS]) {
              ARTIFACTS['swap1steps'][POS] = {
                dir: DIR
              };
            }
          } 
          var newstepid = step.stepid + '-' + markpos;
          var newstep = turn.steps[newstepid] = Object.assign({}, step, {
            ARTIFACTS: ARTIFACTS,
            MARKS: MARKS,
            stepid: newstepid,
            path: step.path.concat(markpos),
            name: 'selectswapunit'
          });
          turn.links[newstepid] = {};
          var newlinks = turn.links[newstepid];
          for (var linkpos in ARTIFACTS.swap1steps) {
            newlinks[linkpos] = 'selectswap1target1';
          }
          return newstep;
        };
      game.selectswapunit1instruction =
        function(step) {
          var MARKS = step.MARKS;
          var ARTIFACTS = step.ARTIFACTS;
          var UNITLAYERS = step.UNITLAYERS;
          var UNITDATA = step.UNITDATA;
          return ''
        };
      game.selectswap1target1 =
        function(turn, step, markpos) {
          var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {
            swap2step: Object.assign({}, step.ARTIFACTS.swap2step)
          });
          var UNITLAYERS = step.UNITLAYERS;
          var MARKS = {
            selectswap1target: markpos,
            selectunit: step.MARKS.selectunit,
            selectswapunit: step.MARKS.selectswapunit
          };
          var STARTPOS = MARKS['selectswapunit'];
          var POS = connections[STARTPOS][relativedirs[(ARTIFACTS.swap1steps[MARKS['selectswap1target']] || {})['dir'] - 2 + 5]];
          if (POS && !
            (function() {
              var k, ret = {},
                s0 = UNITLAYERS.units,
                s1 =
                (function() {
                  var ret = {};
                  ret[MARKS['selectswap1target']] = 1;
                  return ret;
                }());
              for (k in s0) {
                ret[k] = 1;
              }
              for (k in s1) {
                ret[k] = 1;
              }
              return ret;
            }())[POS]) {
            ARTIFACTS['swap2step'][POS] = {};
          }
          var newstepid = step.stepid + '-' + markpos;
          var newstep = turn.steps[newstepid] = Object.assign({}, step, {
            ARTIFACTS: ARTIFACTS,
            MARKS: MARKS,
            stepid: newstepid,
            path: step.path.concat(markpos),
            name: 'selectswap1target'
          });
          turn.links[newstepid] = {};
          if (Object.keys(ARTIFACTS.swap2step ||  {}).length !== 0) {
            turn.links[newstepid].swap = 'swap1';
          }
          return newstep;
        };
      game.selectswap1target1instruction =
        function(step) {
          var MARKS = step.MARKS;
          var ARTIFACTS = step.ARTIFACTS;
          var UNITLAYERS = step.UNITLAYERS;
          var UNITDATA = step.UNITDATA;
          return ''
        };
      game.move1 =
        function(turn, step) {
          var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {});
          var MARKS = step.MARKS;
          var UNITDATA = Object.assign({}, step.UNITDATA);
          var UNITLAYERS = step.UNITLAYERS;
          if (!!(UNITLAYERS.units[MARKS['selectmovetarget']])) {
            if (!!(TERRAIN.oppbase[MARKS['selectmovetarget']])) {
              delete UNITDATA[(UNITLAYERS.units[MARKS['selectmovetarget']]  || {}).id];
            } else {
              var unitid = (UNITLAYERS.units[MARKS['selectmovetarget']]  || {}).id;
              if (unitid) {
                UNITDATA[unitid] = Object.assign({}, UNITDATA[unitid], {
                  'pos': MARKS['selectdeportdestination']
                });
              }
            }
          }
          var unitid = (UNITLAYERS.units[MARKS['selectunit']]  || {}).id;
          if (unitid) {
            UNITDATA[unitid] = Object.assign({}, UNITDATA[unitid], {
              'pos': MARKS['selectmovetarget']
            });
          }
          MARKS = {};
          UNITLAYERS = {
            "pinets": {},
            "mypinets": {},
            "opppinets": {},
            "neutralpinets": {},
            "piokers": {},
            "mypiokers": {},
            "opppiokers": {},
            "neutralpiokers": {},
            "piases": {},
            "mypiases": {},
            "opppiases": {},
            "neutralpiases": {},
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
            "swap2step": {},
            "swap1steps": {},
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
                  s0 = UNITLAYERS.myunits,
                  s1 = TERRAIN.oppbase;
                for (var key in s0) {
                  if (s1[key]) {
                    ret[key] = s0[key];
                  }
                }
                return ret;
              }()) ||  {}).length !== 0) {
            var winner = 1;
            var result = winner === 1 ? 'win' : winner ? 'lose' : 'draw';
            turn.links[newstepid][result] = 'infiltration';
          } else turn.links[newstepid].endturn = "start" + otherplayer;
          return newstep;
        };
      game.move1instruction =
        function(step) {
          var MARKS = step.MARKS;
          var ARTIFACTS = step.ARTIFACTS;
          var UNITLAYERS = step.UNITLAYERS;
          var UNITDATA = step.UNITDATA;
          return ''
        };
      game.swap1 =
        function(turn, step) {
          var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {});
          var MARKS = step.MARKS;
          var UNITDATA = Object.assign({}, step.UNITDATA);
          var UNITLAYERS = step.UNITLAYERS;
          var unitid = (UNITLAYERS.units[MARKS['selectunit']]  || {}).id;
          if (unitid) {
            UNITDATA[unitid] = Object.assign({}, UNITDATA[unitid], {
              'pos': MARKS['selectswap1target']
            });
          }
          var unitid = (UNITLAYERS.units[MARKS['selectswapunit']]  || {}).id;
          if (unitid) {
            UNITDATA[unitid] = Object.assign({}, UNITDATA[unitid], {
              'pos': Object.keys(ARTIFACTS.swap2step)[0]
            });
          }
          MARKS = {};
          UNITLAYERS = {
            "pinets": {},
            "mypinets": {},
            "opppinets": {},
            "neutralpinets": {},
            "piokers": {},
            "mypiokers": {},
            "opppiokers": {},
            "neutralpiokers": {},
            "piases": {},
            "mypiases": {},
            "opppiases": {},
            "neutralpiases": {},
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
            "swap2step": {},
            "swap1steps": {},
            "movetargets": {}
          };
          var newstepid = step.stepid + '-' + 'swap';
          var newstep = turn.steps[newstepid] = Object.assign({}, step, {
            ARTIFACTS: ARTIFACTS,
            MARKS: MARKS,
            UNITDATA: UNITDATA,
            UNITLAYERS: UNITLAYERS,
            stepid: newstepid,
            name: 'swap',
            path: step.path.concat('swap')
          });
          turn.links[newstepid] = {};
          if (Object.keys(
              (function() {
                var ret = {},
                  s0 = UNITLAYERS.myunits,
                  s1 = TERRAIN.oppbase;
                for (var key in s0) {
                  if (s1[key]) {
                    ret[key] = s0[key];
                  }
                }
                return ret;
              }()) ||  {}).length !== 0) {
            var winner = 1;
            var result = winner === 1 ? 'win' : winner ? 'lose' : 'draw';
            turn.links[newstepid][result] = 'infiltration';
          } else turn.links[newstepid].endturn = "start" + otherplayer;
          return newstep;
        };
      game.swap1instruction =
        function(step) {
          var MARKS = step.MARKS;
          var ARTIFACTS = step.ARTIFACTS;
          var UNITLAYERS = step.UNITLAYERS;
          var UNITDATA = step.UNITDATA;
          return ''
        };
      game.start1 =
        function(turn, step) {
          var turn = {
            steps: {},
            player: player,
            turn: turn.turn + 1,
            links: {
              root: {}
            }
          };
          var MARKS = {};
          var ARTIFACTS = {
            "swap2step": {},
            "swap1steps": {},
            "movetargets": {}
          };
          var UNITDATA = step.UNITDATA;
          var UNITLAYERS = {
            "pinets": {},
            "mypinets": {},
            "opppinets": {},
            "neutralpinets": {},
            "piokers": {},
            "mypiokers": {},
            "opppiokers": {},
            "neutralpiokers": {},
            "piases": {},
            "mypiases": {},
            "opppiases": {},
            "neutralpiases": {},
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
        };
      game.start1instruction =
        function(step) {
          var MARKS = step.MARKS;
          var ARTIFACTS = step.ARTIFACTS;
          var UNITLAYERS = step.UNITLAYERS;
          var UNITDATA = step.UNITDATA;
          return ''
        };
      game.debug1 = function() {
        return {
          TERRAIN: TERRAIN
        };
      }
    })();
    (function() {
      var TERRAIN = {
        "base": {
          "a1": {
            "pos": "a1",
            "owner": 1
          },
          "b1": {
            "pos": "b1",
            "owner": 1
          },
          "c1": {
            "pos": "c1",
            "owner": 1
          },
          "d1": {
            "pos": "d1",
            "owner": 1
          },
          "e1": {
            "pos": "e1",
            "owner": 1
          },
          "a5": {
            "pos": "a5",
            "owner": 2
          },
          "b5": {
            "pos": "b5",
            "owner": 2
          },
          "c5": {
            "pos": "c5",
            "owner": 2
          },
          "d5": {
            "pos": "d5",
            "owner": 2
          },
          "e5": {
            "pos": "e5",
            "owner": 2
          }
        },
        "oppbase": {
          "a1": {
            "pos": "a1",
            "owner": 1
          },
          "b1": {
            "pos": "b1",
            "owner": 1
          },
          "c1": {
            "pos": "c1",
            "owner": 1
          },
          "d1": {
            "pos": "d1",
            "owner": 1
          },
          "e1": {
            "pos": "e1",
            "owner": 1
          }
        },
        "mybase": {
          "a5": {
            "pos": "a5",
            "owner": 2
          },
          "b5": {
            "pos": "b5",
            "owner": 2
          },
          "c5": {
            "pos": "c5",
            "owner": 2
          },
          "d5": {
            "pos": "d5",
            "owner": 2
          },
          "e5": {
            "pos": "e5",
            "owner": 2
          }
        }
      };
      var ownernames = ["neutral", "opp", "my"];
      var player = 2;
      var otherplayer = 1;
      game.selectunit2 =
        function(turn, step, markpos) {
          var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {
            movetargets: Object.assign({}, step.ARTIFACTS.movetargets)
          });
          var UNITLAYERS = step.UNITLAYERS;
          var MARKS = {
            selectunit: markpos
          };
          var STARTPOS = MARKS['selectunit'];
          var neighbourdirs = (!!(UNITLAYERS.pinets[MARKS['selectunit']]) ? [5] : (!!(UNITLAYERS.piokers[MARKS['selectunit']]) ? [4, 6] : [4, 5, 6]));
          var nbrofneighbourdirs = neighbourdirs.length;
          var startconnections = connections[STARTPOS];
          for (var dirnbr = 0; dirnbr < nbrofneighbourdirs; dirnbr++) {
            var POS = startconnections[neighbourdirs[dirnbr]];
            if (POS && !UNITLAYERS.myunits[POS]) {
              ARTIFACTS['movetargets'][POS] = {};
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
          var newlinks = turn.links[newstepid];
          for (var linkpos in
              (function() {
                var ret = {},
                  s0 = UNITLAYERS.myunits,
                  s1 =
                  (function() {
                    var ret = {};
                    ret[MARKS['selectunit']] = 1;
                    return ret;
                  }());
                for (var key in s0) {
                  if (!s1[key]) {
                    ret[key] = s0[key];
                  }
                }
                return ret;
              }())) {
            newlinks[linkpos] = 'selectswapunit2';
          }
          return newstep;
        };
      game.selectunit2instruction =
        function(step) {
          var MARKS = step.MARKS;
          var ARTIFACTS = step.ARTIFACTS;
          var UNITLAYERS = step.UNITLAYERS;
          var UNITDATA = step.UNITDATA;
          return ''
        };
      game.selectmovetarget2 =
        function(turn, step, markpos) {
          var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {});
          var UNITLAYERS = step.UNITLAYERS;
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
          if ((!!(UNITLAYERS.units[MARKS['selectmovetarget']]) && !(TERRAIN.oppbase[MARKS['selectmovetarget']]))) {
            var newlinks = turn.links[newstepid];
            for (var linkpos in
                (function() {
                  var ret = {},
                    s0 = TERRAIN.oppbase,
                    s1 = UNITLAYERS.oppunits;
                  for (var key in s0) {
                    if (!s1[key]) {
                      ret[key] = s0[key];
                    }
                  }
                  return ret;
                }())) {
              newlinks[linkpos] = 'selectdeportdestination2';
            }
          } else {
            turn.links[newstepid].move = 'move2';
          }
          return newstep;
        };
      game.selectmovetarget2instruction =
        function(step) {
          var MARKS = step.MARKS;
          var ARTIFACTS = step.ARTIFACTS;
          var UNITLAYERS = step.UNITLAYERS;
          var UNITDATA = step.UNITDATA;
          return ''
        };
      game.selectdeportdestination2 =
        function(turn, step, markpos) {
          var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {});
          var UNITLAYERS = step.UNITLAYERS;
          var MARKS = {
            selectdeportdestination: markpos,
            selectunit: step.MARKS.selectunit,
            selectmovetarget: step.MARKS.selectmovetarget
          };
          var newstepid = step.stepid + '-' + markpos;
          var newstep = turn.steps[newstepid] = Object.assign({}, step, {
            MARKS: MARKS,
            stepid: newstepid,
            path: step.path.concat(markpos),
            name: 'selectdeportdestination'
          });
          turn.links[newstepid] = {};
          turn.links[newstepid].move = 'move2';
          return newstep;
        };
      game.selectdeportdestination2instruction =
        function(step) {
          var MARKS = step.MARKS;
          var ARTIFACTS = step.ARTIFACTS;
          var UNITLAYERS = step.UNITLAYERS;
          var UNITDATA = step.UNITDATA;
          return ''
        };
      game.selectswapunit2 =
        function(turn, step, markpos) {
          var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {
            swap1steps: Object.assign({}, step.ARTIFACTS.swap1steps)
          });
          var UNITLAYERS = step.UNITLAYERS;
          var MARKS = {
            selectswapunit: markpos,
            selectunit: step.MARKS.selectunit
          };
          var STARTPOS = MARKS['selectunit'];
          var neighbourdirs = [1, 3, 5, 7];
          var startconnections = connections[STARTPOS];
          for (var dirnbr = 0; dirnbr < 4; dirnbr++) {
            var DIR = neighbourdirs[dirnbr];
            var POS = startconnections[DIR];
            if (POS && !UNITLAYERS.units[POS]) {
              ARTIFACTS['swap1steps'][POS] = {
                dir: DIR
              };
            }
          } 
          var newstepid = step.stepid + '-' + markpos;
          var newstep = turn.steps[newstepid] = Object.assign({}, step, {
            ARTIFACTS: ARTIFACTS,
            MARKS: MARKS,
            stepid: newstepid,
            path: step.path.concat(markpos),
            name: 'selectswapunit'
          });
          turn.links[newstepid] = {};
          var newlinks = turn.links[newstepid];
          for (var linkpos in ARTIFACTS.swap1steps) {
            newlinks[linkpos] = 'selectswap1target2';
          }
          return newstep;
        };
      game.selectswapunit2instruction =
        function(step) {
          var MARKS = step.MARKS;
          var ARTIFACTS = step.ARTIFACTS;
          var UNITLAYERS = step.UNITLAYERS;
          var UNITDATA = step.UNITDATA;
          return ''
        };
      game.selectswap1target2 =
        function(turn, step, markpos) {
          var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {
            swap2step: Object.assign({}, step.ARTIFACTS.swap2step)
          });
          var UNITLAYERS = step.UNITLAYERS;
          var MARKS = {
            selectswap1target: markpos,
            selectunit: step.MARKS.selectunit,
            selectswapunit: step.MARKS.selectswapunit
          };
          var STARTPOS = MARKS['selectswapunit'];
          var POS = connections[STARTPOS][relativedirs[(ARTIFACTS.swap1steps[MARKS['selectswap1target']] || {})['dir'] - 2 + 5]];
          if (POS && !
            (function() {
              var k, ret = {},
                s0 = UNITLAYERS.units,
                s1 =
                (function() {
                  var ret = {};
                  ret[MARKS['selectswap1target']] = 1;
                  return ret;
                }());
              for (k in s0) {
                ret[k] = 1;
              }
              for (k in s1) {
                ret[k] = 1;
              }
              return ret;
            }())[POS]) {
            ARTIFACTS['swap2step'][POS] = {};
          }
          var newstepid = step.stepid + '-' + markpos;
          var newstep = turn.steps[newstepid] = Object.assign({}, step, {
            ARTIFACTS: ARTIFACTS,
            MARKS: MARKS,
            stepid: newstepid,
            path: step.path.concat(markpos),
            name: 'selectswap1target'
          });
          turn.links[newstepid] = {};
          if (Object.keys(ARTIFACTS.swap2step ||  {}).length !== 0) {
            turn.links[newstepid].swap = 'swap2';
          }
          return newstep;
        };
      game.selectswap1target2instruction =
        function(step) {
          var MARKS = step.MARKS;
          var ARTIFACTS = step.ARTIFACTS;
          var UNITLAYERS = step.UNITLAYERS;
          var UNITDATA = step.UNITDATA;
          return ''
        };
      game.move2 =
        function(turn, step) {
          var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {});
          var MARKS = step.MARKS;
          var UNITDATA = Object.assign({}, step.UNITDATA);
          var UNITLAYERS = step.UNITLAYERS;
          if (!!(UNITLAYERS.units[MARKS['selectmovetarget']])) {
            if (!!(TERRAIN.oppbase[MARKS['selectmovetarget']])) {
              delete UNITDATA[(UNITLAYERS.units[MARKS['selectmovetarget']]  || {}).id];
            } else {
              var unitid = (UNITLAYERS.units[MARKS['selectmovetarget']]  || {}).id;
              if (unitid) {
                UNITDATA[unitid] = Object.assign({}, UNITDATA[unitid], {
                  'pos': MARKS['selectdeportdestination']
                });
              }
            }
          }
          var unitid = (UNITLAYERS.units[MARKS['selectunit']]  || {}).id;
          if (unitid) {
            UNITDATA[unitid] = Object.assign({}, UNITDATA[unitid], {
              'pos': MARKS['selectmovetarget']
            });
          }
          MARKS = {};
          UNITLAYERS = {
            "pinets": {},
            "mypinets": {},
            "opppinets": {},
            "neutralpinets": {},
            "piokers": {},
            "mypiokers": {},
            "opppiokers": {},
            "neutralpiokers": {},
            "piases": {},
            "mypiases": {},
            "opppiases": {},
            "neutralpiases": {},
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
            "swap2step": {},
            "swap1steps": {},
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
                  s0 = UNITLAYERS.myunits,
                  s1 = TERRAIN.oppbase;
                for (var key in s0) {
                  if (s1[key]) {
                    ret[key] = s0[key];
                  }
                }
                return ret;
              }()) ||  {}).length !== 0) {
            var winner = 2;
            var result = winner === 2 ? 'win' : winner ? 'lose' : 'draw';
            turn.links[newstepid][result] = 'infiltration';
          } else turn.links[newstepid].endturn = "start" + otherplayer;
          return newstep;
        };
      game.move2instruction =
        function(step) {
          var MARKS = step.MARKS;
          var ARTIFACTS = step.ARTIFACTS;
          var UNITLAYERS = step.UNITLAYERS;
          var UNITDATA = step.UNITDATA;
          return ''
        };
      game.swap2 =
        function(turn, step) {
          var ARTIFACTS = Object.assign({}, step.ARTIFACTS, {});
          var MARKS = step.MARKS;
          var UNITDATA = Object.assign({}, step.UNITDATA);
          var UNITLAYERS = step.UNITLAYERS;
          var unitid = (UNITLAYERS.units[MARKS['selectunit']]  || {}).id;
          if (unitid) {
            UNITDATA[unitid] = Object.assign({}, UNITDATA[unitid], {
              'pos': MARKS['selectswap1target']
            });
          }
          var unitid = (UNITLAYERS.units[MARKS['selectswapunit']]  || {}).id;
          if (unitid) {
            UNITDATA[unitid] = Object.assign({}, UNITDATA[unitid], {
              'pos': Object.keys(ARTIFACTS.swap2step)[0]
            });
          }
          MARKS = {};
          UNITLAYERS = {
            "pinets": {},
            "mypinets": {},
            "opppinets": {},
            "neutralpinets": {},
            "piokers": {},
            "mypiokers": {},
            "opppiokers": {},
            "neutralpiokers": {},
            "piases": {},
            "mypiases": {},
            "opppiases": {},
            "neutralpiases": {},
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
            "swap2step": {},
            "swap1steps": {},
            "movetargets": {}
          };
          var newstepid = step.stepid + '-' + 'swap';
          var newstep = turn.steps[newstepid] = Object.assign({}, step, {
            ARTIFACTS: ARTIFACTS,
            MARKS: MARKS,
            UNITDATA: UNITDATA,
            UNITLAYERS: UNITLAYERS,
            stepid: newstepid,
            name: 'swap',
            path: step.path.concat('swap')
          });
          turn.links[newstepid] = {};
          if (Object.keys(
              (function() {
                var ret = {},
                  s0 = UNITLAYERS.myunits,
                  s1 = TERRAIN.oppbase;
                for (var key in s0) {
                  if (s1[key]) {
                    ret[key] = s0[key];
                  }
                }
                return ret;
              }()) ||  {}).length !== 0) {
            var winner = 2;
            var result = winner === 2 ? 'win' : winner ? 'lose' : 'draw';
            turn.links[newstepid][result] = 'infiltration';
          } else turn.links[newstepid].endturn = "start" + otherplayer;
          return newstep;
        };
      game.swap2instruction =
        function(step) {
          var MARKS = step.MARKS;
          var ARTIFACTS = step.ARTIFACTS;
          var UNITLAYERS = step.UNITLAYERS;
          var UNITDATA = step.UNITDATA;
          return ''
        };
      game.start2 =
        function(turn, step) {
          var turn = {
            steps: {},
            player: player,
            turn: turn.turn + 1,
            links: {
              root: {}
            }
          };
          var MARKS = {};
          var ARTIFACTS = {
            "swap2step": {},
            "swap1steps": {},
            "movetargets": {}
          };
          var UNITDATA = step.UNITDATA;
          var UNITLAYERS = {
            "pinets": {},
            "mypinets": {},
            "opppinets": {},
            "neutralpinets": {},
            "piokers": {},
            "mypiokers": {},
            "opppiokers": {},
            "neutralpiokers": {},
            "piases": {},
            "mypiases": {},
            "opppiases": {},
            "neutralpiases": {},
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
        };
      game.start2instruction =
        function(step) {
          var MARKS = step.MARKS;
          var ARTIFACTS = step.ARTIFACTS;
          var UNITLAYERS = step.UNITLAYERS;
          var UNITDATA = step.UNITDATA;
          return ''
        };
      game.debug2 = function() {
        return {
          TERRAIN: TERRAIN
        };
      }
    })();
    function reduce(coll, iterator, acc) {
      for (var key in coll) {
        acc = iterator(acc, coll[key], key);
      }
      return acc;
    }
    game.newGame =
      function() {
        var turnseed = {
          turn: 0
        };
        var stepseed = {
          UNITDATA: {
            "unit1": {
              "pos": "a1",
              "id": "unit1",
              "group": "pinets",
              "owner": 1
            },
            "unit2": {
              "pos": "e1",
              "id": "unit2",
              "group": "pinets",
              "owner": 1
            },
            "unit3": {
              "pos": "a5",
              "id": "unit3",
              "group": "pinets",
              "owner": 2
            },
            "unit4": {
              "pos": "e5",
              "id": "unit4",
              "group": "pinets",
              "owner": 2
            },
            "unit5": {
              "pos": "b1",
              "id": "unit5",
              "group": "piokers",
              "owner": 1
            },
            "unit6": {
              "pos": "d1",
              "id": "unit6",
              "group": "piokers",
              "owner": 1
            },
            "unit7": {
              "pos": "b5",
              "id": "unit7",
              "group": "piokers",
              "owner": 2
            },
            "unit8": {
              "pos": "d5",
              "id": "unit8",
              "group": "piokers",
              "owner": 2
            },
            "unit9": {
              "pos": "c1",
              "id": "unit9",
              "group": "piases",
              "owner": 1
            },
            "unit10": {
              "pos": "c5",
              "id": "unit10",
              "group": "piases",
              "owner": 2
            }
          }
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
    }
    game.commands = {
      "move": 1,
      "swap": 1
    };
    game.graphics = {
      "icons": {
        "pinets": "pawns",
        "piokers": "bishops",
        "piases": "kings"
      },
      "tiles": {
        "base": "playercolour"
      }
    };
    game.board = {
      "height": 5,
      "width": 5,
      "terrain": {
        "base": {
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
    game.id = "transet";
    return game;
  }
)()