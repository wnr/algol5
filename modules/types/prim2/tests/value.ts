import { AlgolVal } from "../value";

type TestVal = AlgolVal<
  "FOO" | "BAR",
  "mybattlep",
  "mybattlev",
  "mycmnd",
  "mylayer",
  "mymark",
  "myturnp",
  "myturnv"
>;

const tests: TestVal[] = [
  "FOO",
  "BAR",
  { value: "FOO" },
  { value: { value: "BAR" } },
  { ifelse: [["true"], "FOO", { value: "BAR" }] },
  {
    ifactionelse: ["mycmnd", "FOO", "BAR"]
  },
  { playercase: ["FOO", "BAR"] },
  { read: ["mylayer", "mymark", "someProp"] },
  { battlevar: "mybattlev" },
  { idat: "mymark" }
];