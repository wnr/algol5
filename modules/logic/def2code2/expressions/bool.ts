import {
  FullDefAnon,
  AlgolBoolAnon,
  isAlgolBoolIsEmpty,
  isAlgolBoolNotEmpty,
  isAlgolBoolMoreThan,
  isAlgolBoolSame,
  isAlgolBoolDifferent,
  isAlgolBoolSamePos,
  isAlgolBoolHigher,
  isAlgolBoolFurther,
  isAlgolBoolCmndAvailable,
  isAlgolBoolMarkAvailable,
  isAlgolBoolTruthy,
  isAlgolBoolFalsy,
  isAlgolBoolAnyAt,
  isAlgolBoolNoneAt,
  isAlgolBoolOverlaps
} from "../../../types";

import makeParser from "./";

export default function parseVal(
  gameDef: FullDefAnon,
  player: 1 | 2,
  action: string,
  expr: AlgolBoolAnon,
  from?: string
) {
  const parser = makeParser(gameDef, player, action, "value");

  if (Array.isArray(expr)) {
    switch (expr[0]) {
      case "true":
        return true;
      case "false":
        return false;
      default:
        return undefined;
    }
  }
  if (isAlgolBoolMoreThan(expr)) {
    const {
      morethan: [first, second]
    } = expr;
    return `(${parser.val(first)} > ${parser.val(second)})`;
  }
  if (isAlgolBoolSame(expr)) {
    const {
      same: [first, second]
    } = expr;
    return `(${parser.val(first)} === ${parser.val(second)})`;
  }
  if (isAlgolBoolDifferent(expr)) {
    const {
      different: [first, second]
    } = expr;
    return `(${parser.val(first)} !== ${parser.val(second)})`;
  }
  if (isAlgolBoolSamePos(expr)) {
    const {
      samepos: [firstPos, secondPas]
    } = expr;
    return `(${parser.pos(firstPos)} === ${parser.pos(secondPas)})`;
  }
  if (isAlgolBoolHigher(expr)) {
    const {
      higher: [firstPos, secondPos]
    } = expr;
    return `(BOARD.board[${parser.pos(firstPos)}].y > BOARD.board[${parser.pos(
      secondPos
    )}].y)`;
  }
  if (isAlgolBoolFurther(expr)) {
    const {
      further: [firstPos, secondPos]
    } = expr;
    return `(BOARD.board[${parser.pos(firstPos)}].x > BOARD.board[${parser.pos(
      secondPos
    )}].x)`;
  }
  if (isAlgolBoolCmndAvailable(expr)) {
    const { cmndavailable: act } = expr;
    return `!!step.available[${parser.val(act)}]`;
  }
  if (isAlgolBoolMarkAvailable(expr)) {
    const { markavailable: act } = expr;
    return `!!step.available[${parser.val(act)}]`;
  }
  if (isAlgolBoolTruthy(expr)) {
    const { truthy: val } = expr;
    return `!!${parser.val(val)}`;
  }
  if (isAlgolBoolFalsy(expr)) {
    const { falsy: val } = expr;
    return `!${parser.val(val)}`;
  }
  if (isAlgolBoolAnyAt(expr)) {
    const {
      anyat: [set, pos]
    } = expr;
    return `${parser.set(set)}[${parser.pos(pos)}]`;
  }
  if (isAlgolBoolNoneAt(expr)) {
    const {
      noneat: [set, pos]
    } = expr;
    return `!${parser.set(set)}[${parser.pos(pos)}]`;
  }
  if (isAlgolBoolIsEmpty(expr)) {
    const { isempty: set } = expr;
    return `Object.keys(${parser.set(set)}).length === 0`;
  }
  if (isAlgolBoolNotEmpty(expr)) {
    const { notempty: set } = expr;
    return `Object.keys(${parser.set(set)}).length !== 0`;
  }
  if (isAlgolBoolOverlaps(expr)) {
    const { overlaps: sets } = expr;
    return parser.bool({ notempty: { intersect: sets } });
  }
}
