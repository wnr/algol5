import { playingDemos } from "./playingDemos";

describe("the playingDemos selector", () => {
  let result: number;
  describe("when no demos are playing", () => {
    beforeEach(
      () =>
        (result = playingDemos({
          demo: { demos: {} }
        }))
    );
    test("we get 0", () => expect(result).toBe(0));
  });
  describe("when two demos are playing", () => {
    beforeEach(
      () =>
        (result = playingDemos({
          demo: {
            demos: {
              amazons: {
                anims: {},
                frame: 0,
                positions: [],
                playing: true
              },
              aries: {
                anims: {},
                frame: 0,
                positions: [],
                playing: false
              },
              atrium: {
                anims: {},
                frame: 0,
                positions: [],
                playing: true
              }
            }
          }
        }))
    );
    test("we get 2", () => expect(result).toBe(2));
  });
});