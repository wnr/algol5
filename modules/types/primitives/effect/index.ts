export * from "./effect.anon";
export * from "./effect.interfaces";
export * from "./effect.logical";
export * from "./effect.guard";

import {
  AlgolEffectIf,
  AlgolEffectIfActionElse,
  AlgolEffectIfElse,
  AlgolEffectIndexList,
  AlgolEffectPlayerCase
} from "./effect.logical";

import {
  AlgolEffectForIdIn,
  AlgolEffectForPosIn,
  AlgolEffectKillAt,
  AlgolEffectKillIn,
  AlgolEffectMoveAt,
  AlgolEffectMulti,
  AlgolEffectPushIn,
  AlgolEffectSetAt,
  AlgolEffectSetBattlePos,
  AlgolEffectSetBattleVar,
  AlgolEffectSetId,
  AlgolEffectSetIn,
  AlgolEffectSetTurnPos,
  AlgolEffectSetTurnVar,
  AlgolEffectSpawn,
  AlgolEffectSpawnIn,
  AlgolEffectStompAt
} from "./effect.interfaces";

export type AlgolEffect<
  Btlp,
  Btlv,
  Cmnd,
  Grid,
  Layer,
  Mrk,
  Turnp,
  Turnv,
  Unit
> =
  | AlgolEffectMoveAt<Btlp, Btlv, Cmnd, Grid, Layer, Mrk, Turnp, Turnv>
  | AlgolEffectStompAt<Btlp, Btlv, Cmnd, Grid, Layer, Mrk, Turnp, Turnv>
  | AlgolEffectSetTurnPos<Btlp, Btlv, Cmnd, Grid, Layer, Mrk, Turnp, Turnv>
  | AlgolEffectSetBattlePos<Btlp, Btlv, Cmnd, Grid, Layer, Mrk, Turnp, Turnv>
  | AlgolEffectSetTurnVar<Btlp, Btlv, Cmnd, Grid, Layer, Mrk, Turnp, Turnv>
  | AlgolEffectSetBattleVar<Btlp, Btlv, Cmnd, Grid, Layer, Mrk, Turnp, Turnv>
  | AlgolEffectPushIn<Btlp, Btlv, Cmnd, Grid, Layer, Mrk, Turnp, Turnv>
  | AlgolEffectKillIn<Btlp, Btlv, Cmnd, Grid, Layer, Mrk, Turnp, Turnv>
  | AlgolEffectKillAt<Btlp, Btlv, Cmnd, Grid, Layer, Mrk, Turnp, Turnv>
  | AlgolEffectSetAt<Btlp, Btlv, Cmnd, Grid, Layer, Mrk, Turnp, Turnv>
  | AlgolEffectSetIn<Btlp, Btlv, Cmnd, Grid, Layer, Mrk, Turnp, Turnv>
  | AlgolEffectSetId<Btlp, Btlv, Cmnd, Grid, Layer, Mrk, Turnp, Turnv>
  | AlgolEffectSpawn<Btlp, Btlv, Cmnd, Grid, Layer, Mrk, Turnp, Turnv, Unit>
  | AlgolEffectSpawnIn<Btlp, Btlv, Cmnd, Grid, Layer, Mrk, Turnp, Turnv, Unit>
  | AlgolEffectForPosIn<Btlp, Btlv, Cmnd, Grid, Layer, Mrk, Turnp, Turnv, Unit>
  | AlgolEffectForIdIn<Btlp, Btlv, Cmnd, Grid, Layer, Mrk, Turnp, Turnv, Unit>
  | AlgolEffectMulti<Btlp, Btlv, Cmnd, Grid, Layer, Mrk, Turnp, Turnv, Unit>
  | AlgolEffectIf<Btlp, Btlv, Cmnd, Grid, Layer, Mrk, Turnp, Turnv, Unit>
  | AlgolEffectIfElse<Btlp, Btlv, Cmnd, Grid, Layer, Mrk, Turnp, Turnv, Unit>
  | AlgolEffectIfActionElse<
      Btlp,
      Btlv,
      Cmnd,
      Grid,
      Layer,
      Mrk,
      Turnp,
      Turnv,
      Unit
    >
  | AlgolEffectPlayerCase<
      Btlp,
      Btlv,
      Cmnd,
      Grid,
      Layer,
      Mrk,
      Turnp,
      Turnv,
      Unit
    >
  | AlgolEffectIndexList<
      Btlp,
      Btlv,
      Cmnd,
      Grid,
      Layer,
      Mrk,
      Turnp,
      Turnv,
      Unit
    >;