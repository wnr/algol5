import { MomentumBoard } from "./_types";

// This is the source of truth for what terrain layers are available.
// Whenever you update this definition you should also regenerate
// the graphics from the graphics module.

const momentumBoard: MomentumBoard = {
  height: 7,
  width: 7,
  terrain: {},
};

export default momentumBoard;