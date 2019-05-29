import { pos2coords } from "..";

test("pos2coords", () =>
  ([
    ["a1", { x: 1, y: 1 }],
    ["a3", { x: 1, y: 3 }],
    ["b4", { x: 2, y: 4 }],
    ["j11", { x: 10, y: 11 }]
  ] as const).forEach(([pos, expectedCoords]) =>
    expect(pos2coords(pos)).toEqual(expectedCoords)
  ));
