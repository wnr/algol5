import { DescentFlow } from './_types';

const descentFlow: DescentFlow = {
  endGame: {
    madeline: {
      condition: ["notempty", "winline"],
      show: "winline"
    }
  },
  startTurn: {
    link: "selectunit"
  },
  marks: {
    selectunit: {
      from: "myunits",
      runGenerator: "findmovetargets",
      link: "selectmovetarget"
    },
    selectmovetarget: {
      from: "movetargets",
      link: "move"
    },
    selectdigtarget: {
      from: "digtargets",
      link: "dig"
    }
  },
  commands: {
    move: {
      runGenerator: "finddigtargets",
      applyEffects: [
        ["setturnpos", "movedto", "selectmovetarget"],
        ["setturnvar", "heightfrom", ["read", "units", "selectunit", "group"]],
        ["setturnvar", "heightto", ["read", "units", "selectmovetarget", "group"]],
        ["setat", "selectunit", "group", ["turnvar", "heightto"]],
        ["killat", "selectmovetarget"],
        ["moveat", "selectunit", "selectmovetarget"],
        ["spawn", "selectunit", ["turnvar", "heightfrom"], 0]
      ],
      link: "selectdigtarget"
    },
    dig: {
      applyEffect: ["ifelse", ["anyat", "pawns", "selectdigtarget"],
        ["killat", "selectdigtarget"],
        ["setat", "selectdigtarget", "group", ["ifelse", ["anyat", "knights", "selectdigtarget"], "pawns", "knights"]]
      ],
      runGenerator: "findwinlines",
      link: "endturn"
    }
  }
};

export default descentFlow;
