export * from "./content.interfaces";
export * from "./content.anon";
export * from "./content.guard";

import {
  AlgolContentCmnd,
  AlgolContentPos,
  AlgolContentUnitPos,
  AlgolContentUnit,
  AlgolContentText
} from "./content.interfaces";

export type AlgolContent<Cmnd, Pos, Unit> =
  | AlgolContentCmnd<Cmnd>
  | AlgolContentPos<Pos>
  | AlgolContentUnit<Unit>
  | AlgolContentUnitPos<Pos, Unit>
  | AlgolContentText;