import { DuploDefinition } from "./_types";

// This is the source of truth for what terrain layers are available.
// Whenever you update this definition you should also regenerate
// the graphics from the graphics module.

const duploBoardBook: DuploDefinition["boards"] = {
  basic: { height: 8, width: 8, terrain: {} }
};

export default duploBoardBook;
