const { writeFileSync } = require("fs");
const Board = require("src/classes/Board");
const { readPgnFile, getGamesDataFromPgn, countSquares } = require("src/helpers");
// const path = "examples/wrc-22.pgn";
// const path = "examples/wrc-22-r13.pgn";
// const path = "examples/chesscom/ChessCom_erik_200910.pgn";
const path = "examples/collections/Carlsen.pgn";

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
const squares = games
  .map(({ metadata }) => {
    if (metadata.white.name === playerName) {
      return metadata.white.pieces.map((piece) => piece.history).flat();
    }
    return metadata.black.pieces.map((piece) => piece.history).flat();
  })
  .reduce((acc, curr) => {
    acc.push(...curr);
    return acc;
  }, []);

console.log(countSquares(squares));

writeFileSync("result.json", JSON.stringify(games, null, 2));
