import { AlgolBool } from "../bool";

type TestBool = AlgolBool<
  "mylayer",
  "mymark",
  "mycmnd",
  "myturnp",
  "myturnv",
  "mybattlep",
  "mybattlev"
>;

const tests: TestBool[] = [
  ["true"],
  ["cmndavailable", "mycmnd"],
  ["markavailable", "mymark"],
  ["higher", ["mark", "mymark"], ["onlyin", "mylayer"]],
  ["anyat", "mylayer", "mymark"],
  ["noneat", "mylayer", "mymark"],
  ["overlaps", "mylayer", ["union", "mylayer", "mylayer"], "mylayer"],
  ["isempty", "mylayer"],
  ["notempty", "mylayer"],
  ["samepos", "mymark", ["onlyin", "mylayer"]],
  ["same", 4, ["value", 4]],
  ["different", 4, ["value", 4]],
  ["morethan", 4, ["value", 4]],
  ["and", ["isempty", "mylayer"], ["samepos", "mymark", ["onlyin", "mylayer"]]],
  ["or", ["isempty", "mylayer"], ["samepos", "mymark", ["onlyin", "mylayer"]]],
  ["truthy", 4],
  ["falsy", ["value", 7]],
  ["valinlist", ["value", 8], ["value", 4], 3, ["value", 9]]
];