import {
  AlgolIfableExpressionAnon,
  isAlgolExpressionIfActionElse,
  isAlgolExpressionPlayerCase,
  isAlgolExpressionIndexList,
  isAlgolIfableExpressionIf,
  isAlgolExpressionIfElse,
  isAlgolIfableExpressionIfPlayer,
  isAlgolIfableExpressionIfAction,
  AlgolStatementAnon,
  isAlgolStatementForIdIn,
  isAlgolStatementForPosIn,
  isAlgolStatementMulti,
} from "../../types";

export function possibilities<_T>(
  input: AlgolIfableExpressionAnon<_T> | AlgolStatementAnon<_T>,
  player: 0 | 1 | 2 = 0,
  action: string = "any"
): _T[] {
  const listWithDuplicates = possibilitiesInner(input, player, action);
  const possAsKeys = listWithDuplicates.reduce(
    (mem, poss) => ({ ...mem, [JSON.stringify(poss)]: 1 }),
    {}
  );
  return Object.keys(possAsKeys).map(i => JSON.parse(i));
}

function possibilitiesInner<_T>(
  input: AlgolIfableExpressionAnon<_T> | AlgolStatementAnon<_T>,
  player: 0 | 1 | 2,
  action: string
): _T[] {
  const expr = input as AlgolIfableExpressionAnon<_T>;
  if (isAlgolExpressionIfElse(expr)) {
    const {
      ifelse: [test, whenTruthy, whenFalsy],
    } = expr;
    return possibilitiesInner(whenTruthy, player, action).concat(
      possibilitiesInner(whenFalsy, player, action)
    );
  }

  if (isAlgolExpressionIfActionElse(expr)) {
    const {
      ifactionelse: [testAction, whenYes, whenNo],
    } = expr;
    let poss: any[] = [];
    if (action === "any" || action === testAction)
      poss = poss.concat(possibilitiesInner(whenYes, player, action));
    if (action === "any" || action !== testAction)
      poss = poss.concat(possibilitiesInner(whenNo, player, action));
    return poss;
  }

  if (isAlgolExpressionPlayerCase(expr)) {
    const {
      playercase: [plr1, plr2],
    } = expr;
    let poss: any[] = [];
    if (player !== 2)
      poss = poss.concat(possibilitiesInner(plr1, player, action));
    if (player !== 1)
      poss = poss.concat(possibilitiesInner(plr2, player, action));
    return poss;
  }

  if (isAlgolExpressionIndexList(expr)) {
    const {
      indexlist: [idx, ...opts],
    } = expr;
    return opts.reduce(
      (mem, o) => mem.concat(possibilitiesInner(o, player, action)),
      [] as any[]
    );
  }

  if (isAlgolIfableExpressionIf(expr)) {
    const {
      if: [test, opt],
    } = expr;
    return ([] as any[]).concat(possibilitiesInner(opt, player, action));
  }

  if (isAlgolIfableExpressionIfPlayer(expr)) {
    const {
      ifplayer: [plr, opt],
    } = expr;
    return player === plr
      ? ([] as any[]).concat(possibilitiesInner(opt, player, action))
      : [];
  }

  if (isAlgolIfableExpressionIfAction(expr)) {
    const {
      ifaction: [testAction, opt],
    } = expr;
    return action === testAction || action === "any"
      ? ([] as any[]).concat(possibilitiesInner(opt, player, action))
      : [];
  }

  // statement possibilities

  const statement = input as AlgolStatementAnon<_T>;

  if (isAlgolStatementForIdIn(statement)) {
    const {
      foridin: [set, repeatStatement],
    } = statement;
    return possibilitiesInner(repeatStatement, player, action);
  }

  if (isAlgolStatementForPosIn(statement)) {
    const {
      forposin: [set, repeatStatement],
    } = statement;
    return possibilitiesInner(repeatStatement, player, action);
  }

  if (isAlgolStatementMulti(statement)) {
    const { multi: children } = statement;
    return children.reduce(
      (mem, child) => mem.concat(possibilitiesInner(child, player, action)),
      [] as any[]
    );
  }

  return [input as _T];
}
