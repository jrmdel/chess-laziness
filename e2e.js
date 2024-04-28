const { writeFileSync, createWriteStream } = require("fs");
const Board = require("src/classes/Board");
const { readPgnFile, getGamesDataFromPgn, countSquares } = require("src/helpers");
// const path = "examples/wrc-22.pgn";
// const path = "examples/wrc-22-r13.pgn";
// const path = "examples/chesscom/ChessCom_erik_200910.pgn";
// const path = "examples/collections/Carlsen.pgn";
const path =
  "examples/lichess/lichess_broadcast_fide-candidates-2024--open_wEuVhT9c_2024.04.22.pgn";

const input = readPgnFile(path);
const games = getGamesDataFromPgn(input);
games.forEach((game) => {
  const board = new Board(game.moves?.flat());
  const { white, black } = board.getLazyScore();
  game.metadata.black = { ...game.metadata.black, ...black };
  game.metadata.white = { ...game.metadata.white, ...white };
  return game;
});

const playerName = "Carlsen,Magnus";
const squares = games.flatMap(({ metadata }) => {
  // if (metadata.white.name === playerName) {
  //   return metadata.white.pieces.flatMap((piece) => piece.history);
  // }
  // return metadata.black.pieces.flatMap((piece) => piece.history);
  return metadata.white.pieces
    .flatMap((piece) => piece.history)
    .concat(metadata.black.pieces.flatMap((piece) => piece.history));
});

const count = countSquares(squares);
writeFileSync("data/count.json", JSON.stringify(count));
console.log(count);

writeFileSync("data/result.json", JSON.stringify(games, null, 2));

function saveArrayToFile(array, filePath) {
  const stream = createWriteStream(filePath);
  stream.write("[\n");
  array.forEach((obj, i) => {
    stream.write("\t" + JSON.stringify(obj));
    if (i !== array.length - 1) {
      stream.write(",");
    }
    stream.write("\n");
  });
  stream.write("]");
  stream.end();
}

// saveArrayToFile(games, "result.json");
