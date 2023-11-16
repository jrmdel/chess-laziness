const { readFileSync } = require("fs");
const { buildMetadata } = require("src/helpers/tools/metadata-parser");
const { cleanAndParseMoves } = require("src/helpers/tools/move-parser");

function readPgnFile(path) {
  return readFileSync(path, "utf-8");
}

function splitGames(input) {
  const rawData = input.split("\n\n");
  const games = [];
  const game = {};

  for (const data of rawData) {
    const cleanString = data?.replace(/\n/g, " ").trim();

    if (cleanString?.startsWith("1")) {
      game["moves"] = cleanString;
      games.push(Object.assign({}, game));
      continue;
    }
    if (cleanString?.startsWith("[")) {
      game["metadata"] = cleanString;
    }
  }

  return games;
}

function getGamesDataFromPgn(input) {
  if (!input) {
    throw Error("No input");
  }

  const games = splitGames(input).map(({ metadata, moves }) => ({
    metadata: buildMetadata(metadata),
    moves: cleanAndParseMoves(moves),
  }));

  return games;
}

module.exports = {
  readPgnFile,
  splitGames,
  getGamesDataFromPgn,
};
