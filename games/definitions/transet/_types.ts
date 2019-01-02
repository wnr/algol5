export type TransetTerrain = "base";
export type TransetUnit = "pinets" | "piokers" | "piases";
export type TransetMark = "selectunit" | "selectmovetarget" | "selectdeportdestination" | "selectswapunit" | "selectswap1target";
export type TransetCommand = "move" | "swap";
export type TransetPhaseCommand = never;
export type TransetPhase = "startTurn" | TransetMark;
