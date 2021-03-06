import { GowiththefloeDefinition } from "./_types";

// This is the source of truth for what terrain layers are available.
// Whenever you update this definition you should also regenerate
// the graphics from the graphics module.

const gowiththefloeBoardBook: GowiththefloeDefinition["boards"] = {
  basic: {
    height: 8,
    width: 8,
    terrain: {
      water: [
        "a1",
        "a2",
        "a7",
        "a8",
        "b1",
        "b8",
        "g1",
        "g8",
        "h1",
        "h2",
        "h7",
        "h8"
      ]
    }
  }
};

export default gowiththefloeBoardBook;
