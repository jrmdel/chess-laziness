const { writeFileSync } = require("fs");
const { readPgnFile, getGamesDataFromPgn } = require("src/helpers");
// const path = "examples/wrc-22.pgn";
// const path = "examples/wrc-22-r13.pgn";
const path = "examples/chesscom/ChessCom_erik_200910.pgn";

const input = readPgnFile(path);
const games = getGamesDataFromPgn(input);

writeFileSync("result.json", JSON.stringify(games, null, 2));
