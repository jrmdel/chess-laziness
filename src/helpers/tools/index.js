module.exports = Object.assign(
  {},
  {
    ...require("src/helpers/tools/metadata-parser"),
    ...require("src/helpers/tools/move-parser"),
    ...require("src/helpers/tools/game-parser"),
  }
);
