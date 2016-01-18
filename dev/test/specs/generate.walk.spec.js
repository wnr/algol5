import test from '../tester'
import lib from '../../../src/codegen/'

let G = lib.G

describe('the generate funcs',()=>{
    test(G.applywalker, 'the applywalker func', {
        'for simple walk': {
            arg: {
                starts: ['layer','starts'],
                dirs: [1,3,5],
                draw: {
                    steps: {
                        tolayer: 'steps',
                        include: {heading: ['dir'],nbr:['step']}
                    }
                }
            },
            scope: {
                CONNECTIONS: {p0:{1:'p1'},p1:{1:'p2'},p2:{},q0:{3:'q1'},q1:{}},
                LAYERS: { steps:{}, starts: {q0:'yes',p0:'yes'} }
            },
            mutations: {
                LAYERS: {
                    starts: {q0:'yes',p0:'yes'},
                    steps:{
                        p1: [{heading:1,nbr:1}],
                        p2: [{heading:1,nbr:2}],
                        q1: [{heading:3,nbr:1}]
                    }
                }
            }
        },
        'when just 1 start': {
            arg: {
                start: ['pos','q0'],
                dirs: [1,3,5],
                draw: {
                    steps: {
                        tolayer: 'steps',
                        include: {heading: ['dir'],nbr:['step']}
                    }
                }
            },
            scope: {
                CONNECTIONS: {q0:{3:'q1'},q1:{}},
                LAYERS: { steps:{} }
            },
            mutations: {
                LAYERS: { steps:{ q1: [{heading:3,nbr:1}] } }
            }
        }
    });
    test(G.walkfromstart, 'the walkfromstart func', {
        'for simple walk': {
            arg: {
                dirs: [1,3],
                draw: {
                    steps: {
                        tolayer: 'steps',
                        include: {heading: ['dir']}
                    }
                }
            },
            scope: {
                STARTPOS: 'p0',
                CONNECTIONS: {p0:{1:'p1',3:'q1'},p1:{1:'p2'},p2:{},q1:{}},
                LAYERS: { steps:{} }
            },
            mutations: {
                LAYERS: {
                    steps:{
                        p1: [{heading:1}], p2: [{heading:1}],
                        q1: [{heading:3}]
                    }
                }
            }
        },
        'when just 1 dir': {
            arg: {
                dir: 1,
                draw: {
                    steps: {
                        tolayer: 'steps',
                        include: {heading: ['dir']}
                    }
                }
            },
            scope: {
                STARTPOS: 'p0',
                CONNECTIONS: {p0:{1:'p1',3:'q1'},p1:{1:'p2'},p2:{},q1:{}},
                LAYERS: { steps:{} }
            },
            mutations: {
                LAYERS: {
                    steps:{
                        p1: [{heading:1}], p2: [{heading:1}]
                    }
                }
            }
        }
    });
    test(G.walkindir, 'the walkindir func', {
        'for simple walk': {
            arg: {
                blocks: ['layer','intheway'],
                draw: {
                    steps: {tolayer: 'steps'},
                    block: {tolayer: 'blocks'}
                }
            },
            scope: {
                STARTPOS: 'p0',
                DIR: 1,
                CONNECTIONS: {p0:{1:'p1'},p1:{1:'p2'},p2:{1:'p3'},p3:{1:'p4'}},
                LAYERS: {
                    steps:{},
                    blocks:{},
                    intheway:{p3:'yep'}
                }
            },
            mutations: {
                LAYERS: {
                    steps:{p1:[{}],p2:[{}]},
                    blocks:{p3:[{}]},
                    intheway:{p3:'yep'}
                }
            }
        }
    });
    test(G.drawwalksteps, 'the drawwalksteps func', {
        'when just draw the steps': {
            arg: {
                draw: { steps: { tolayer: 'steps', include: {nbr:['step']} }}
            },
            scope: {POS:'sthelse',LAYERS:{steps:{}},WALK:['foo','bar'],WALKLENGTH:2},
            mutations: {LAYERS:{steps:{foo:[{nbr:1}],bar:[{nbr:2}]}}}
        },
        'with some countshit': {
            arg: {
                count: 'yes',
                draw: { counted: { tolayer: 'counted', include: {nbr:['step'],sofar:['countsofar']} }}
            },
            scope: {CURRENTCOUNT:'foo',POS:'sthelse',LAYERS:{counted:{}},WALK:['foo','bar'],WALKLENGTH:2,COUNT:{bar:'yep'},COUNTTRACK:['x','y']},
            mutations: {LAYERS:{counted:{bar:[{nbr:2,sofar:'y'}]}}}
        }
    });
    test(G.drawwalkstart, 'the drawwalkstart func', {
        'when we draw simple start': {
            arg: {
                draw: { start: { tolayer: 'begins' }}
            },
            scope: {POS:'sthelse',STARTPOS:'start',LAYERS:{begins:{}}},
            mutations: {POS:'start',LAYERS:{begins:{start:[{}]}}}
        },
        'when we also draw all': {
            arg: {
                draw: {
                    start: { tolayer: 'begins' },
                    all: { tolayer: 'everything' }
                }
            },
            scope: {POS:'sthelse',STARTPOS:'start',LAYERS:{begins:{},everything:{}}},
            mutations: {POS:'start',LAYERS:{begins:{start:[{}]},everything:{start:[{}]}}}
        }
    });
    test(G.drawwalklast, 'the drawwalklast func', {
        'for vanilla walk': {
            arg: {
                draw: { last: { tolayer: 'lasts' }}
            },
            scope: {STEP:7,POS:'wherever',WALKLENGTH:2,WALK:['foo','bar'],LAYERS:{lasts:{}}},
            mutations: {STEP:2,LAYERS:{lasts:{bar:[{}]}}}
        }
    });
    test(G.drawwalkblock, 'the drawwalkblock func', {
        'when we hit block and want to draw it': {
            arg: {
                blocks: 'yep',
                draw: {
                    block: {
                        tolayer: 'blocks',
                        include: {why:['stopreason']}
                    }
                }
            },
            scope: {POS:'sthelse',NEXTPOS:'boom',STOPREASON:'hitblock',LAYERS:{blocks:{}}},
            mutations: {POS:'boom',LAYERS:{blocks:{boom:[{why:'hitblock'}]}}}
        },
        'when we hit block and also draw all': {
            arg: {
                blocks: 'yep',
                draw: {
                    block: { tolayer: 'blocks' },
                    all: { tolayer: 'everything' }
                }
            },
            scope: {POS:'sthelse',NEXTPOS:'boom',STOPREASON:'hitblock',LAYERS:{blocks:{},everything:{}}},
            mutations: {POS:'boom',LAYERS:{blocks:{boom:[{}]},everything:{boom:[{}]}}}
        }
    });
    test(G.takewalkstep, 'the takewalkstep func', {
        'for normal walk': {
            scope: {WALK:['foo'],NEXTPOS:'bar',POS:'foo'},
            mutations: {WALK:['foo','bar'],POS:'bar'}
        },
        'with count and nextpos not to be counted': {
            arg: {count:'YES'},
            scope: {WALK:['foo'],NEXTPOS:'bar',COUNTTRACK:['whatev'],CURRENTCOUNT:7,COUNT:{},POS:'foo'},
            mutations: {COUNTTRACK:['whatev',7],CURRENTCOUNT:7}
        },
        'with count and nextpos should be counted': {
            arg: {count:'YES'},
            scope: {WALK:['foo'],NEXTPOS:'bar',COUNTTRACK:['whatev'],CURRENTCOUNT:7,COUNT:{bar:'yes'},POS:'foo'},
            mutations: {COUNTTRACK:['whatev',8],CURRENTCOUNT:8}
        },
        'with count and nextpos should be counted and we intend to draw': {
            arg: {count:'YES',draw:{counted:'sure'}},
            scope: {COUNTED:['x'],WALK:['foo'],NEXTPOS:'bar',COUNTTRACK:['whatev'],CURRENTCOUNT:7,COUNT:{bar:'yes'},POS:'foo'},
            mutations: {COUNTTRACK:['whatev',8],CURRENTCOUNT:8}
        }
    });
    test(G.afterwalk, 'the afterwalk func', {
        'for vanilla walk': {
            scope: {WALK:[1,2,3]},
            mutations: {WALKLENGTH:3}
        },
        'if we count': {
            arg: {count:'yep'},
            scope: {WALK:[1,2,3],CURRENTCOUNT:7},
            mutations: {TOTALCOUNT:7}
        }
    });
    test(G.prepwalkstart, 'the prepwalkstart func', {
        'for vanilla def': {
            scope: {STARTPOS: 'somepos'},
            mutations: {POS: 'somepos', WALK: [],STOPREASON:'',NEXTPOS:''}
        },
        'when def has max': {
            arg: {max:['value',4]},
            scope: {DIR: 7, STARTPOS: 'somepos'},
            mutations: {MAX: 4}
        },
        'with startasstep': {
            arg: {startasstep:true},
            scope: {CONNECTIONS:{foo:'bar',faux:{baz:'bin'}},STARTPOS:'somepos',DIR:'somedir'},
            mutations: {CONNECTIONS:{foo:'bar',faux:{baz:'bin',somedir:'somepos'}},POS:'faux'}
        },
        'with steps': {
            arg: {steps:['layer','somelayer']},
            scope: {LAYERS:{somelayer:'L'},STARTPOS:'somepos'},
            mutations: {STEPS:'L'}
        },
        'with blocks': {
            arg: {blocks:['layer','somelayer']},
            scope: {LAYERS:{somelayer:'L'},STARTPOS:'somepos'},
            mutations: {BLOCKS:'L'}
        },
        'with count': {
            arg: {count:['layer','somelayer']},
            scope: {LAYERS:{somelayer:'L'},STARTPOS:'somepos'},
            mutations: {COUNT:'L',COUNTTRACK: [], CURRENTCOUNT: 0}
        },
        'with count and intent to draw counted': {
            arg: {count:['layer','somelayer'],draw:{counted:'yes'}},
            scope: {LAYERS:{somelayer:'L'},STARTPOS:'somepos'},
            mutations: {COUNT:'L',COUNTTRACK: [], CURRENTCOUNT: 0}
        }
    });
    test(G.stopreason,'the stopreason func', {
        'when def has max and we have reached it': {
            arg: {max:3},
            scope: {LENGTH:3,MAX:3},
            expected: 'reachedmax'
        },
        'when out of bounds': {
            scope: {CONNECTIONS:{pos:{}},DIR:'x',POS:'pos',NEXTPOS:''},
            expected: 'outofbounds'
        },
        'when hit a block': {
            arg: {blocks:"yes"},
            scope: {CONNECTIONS:{pos:{'x':'newpos'}},DIR:'x',POS:'pos',NEXTPOS:'',BLOCKS:{newpos:1}},
            expected: 'hitblock',
            mutations: {NEXTPOS:'newpos'}
        },
        'when out of steps': {
            arg: {steps:"yes"},
            scope: {CONNECTIONS:{pos:{'x':'newpos'}},DIR:'x',POS:'pos',NEXTPOS:'',STEPS:{}},
            expected: 'nomoresteps',
            mutations: {NEXTPOS:'newpos'}
        },
        'when navigates blocks and has steps and not reaching max': {
            arg: {steps:"yes",blocks:"indeed",max:"yup"},
            scope: {LENGTH:2,MAX:3,CONNECTIONS:{pos:{'x':'newpos'}},DIR:'x',POS:'pos',NEXTPOS:'',STEPS:{'newpos':1},BLOCKS:{}},
            expected: null,
            mutations: {NEXTPOS:'newpos'}
        },
        'when there is connection and def doesnt use blocks or steps or max': {
            scope: {CONNECTIONS:{pos:{'x':'newpos'}},DIR:'x',POS:'pos',NEXTPOS:''},
            expected: null,
            mutations: {NEXTPOS:'newpos'}
        },
        'when steps run out and there is a block in the way': {
            arg: {blocks:"yes",steps:"indeed"},
            scope: {CONNECTIONS:{pos:{'x':'newpos'}},DIR:'x',POS:'pos',NEXTPOS:'',BLOCKS:{newpos:1},STEPS:{}},
            expected: 'nomoresteps',
            mutations: {NEXTPOS:'newpos'}
        },
        'when steps run out and there is a block in the way and we prio blocks': {
            arg: {blocks:"yes",steps:"indeed",testblocksbeforesteps:true},
            scope: {CONNECTIONS:{pos:{'x':'newpos'}},DIR:'x',POS:'pos',NEXTPOS:'',BLOCKS:{newpos:1},STEPS:{}},
            expected: 'hitblock',
            mutations: {NEXTPOS:'newpos'}
        }
    });
});