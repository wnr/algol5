import { AlgolArrangements } from "../../../types";
import { GameId } from "../../../games/dist/list";

export type TokenHandlerOpts = {
  args: Record<string, string>;
  arrs: AlgolArrangements;
  gameId: GameId;
  yaml: Record<string, any>;
  picPath: string;
};

export type TokenHandler = (opts: TokenHandlerOpts) => string;