const applyFunctionToBlocks = (blocks, fieldFunctions) => {
  for (const block of blocks) {
    for (const key in fieldFunctions) {
      if (key in block) fieldFunctions[key](block[key], block);
    }
    if (block.intents) applyFunctionToBlocks(block.intents, fieldFunctions);
  }
};

module.exports = applyFunctionToBlocks;
