const { readFileSync, writeFileSync } = require("fs");
const path = require("path");
const { countSquares } = require("src/helpers");

const games = JSON.parse(readFileSync(path.join(__dirname, "result.json"), "utf-8"));

function extractMovesFromPiece(games, pieceTypes = []) {
  return games.flatMap(({ metadata }) => {
    const whitePieces = metadata.white.pieces;
    const blackPieces = metadata.black.pieces;
    return [].concat(
      whitePieces
        .filter((piece) => pieceTypes.includes(piece.type))
        .flatMap((piece) => piece.history),
      blackPieces
        .filter((piece) => pieceTypes.includes(piece.type))
        .flatMap((piece) => piece.history)
    );
  });
}

const knights = extractMovesFromPiece(games, ["N"]);
const bishops = extractMovesFromPiece(games, ["B"]);
const rooks = extractMovesFromPiece(games, ["R"]);
const queens = extractMovesFromPiece(games, ["Q"]);
const kings = extractMovesFromPiece(games, ["K"]);
const pawns = extractMovesFromPiece(games, ["a", "b", "c", "d", "e", "f", "g", "h"]);

const knightCount = countSquares(knights);
const bishopCount = countSquares(bishops);
const rookCount = countSquares(rooks);
const queenCount = countSquares(queens);
const kingCount = countSquares(kings);
const pawnCount = countSquares(pawns);

writeFileSync(path.join(__dirname, "cell-count/knight.json"), JSON.stringify(knightCount));
writeFileSync(path.join(__dirname, "cell-count/bishop.json"), JSON.stringify(bishopCount));
writeFileSync(path.join(__dirname, "cell-count/rook.json"), JSON.stringify(rookCount));
writeFileSync(path.join(__dirname, "cell-count/queen.json"), JSON.stringify(queenCount));
writeFileSync(path.join(__dirname, "cell-count/king.json"), JSON.stringify(kingCount));
writeFileSync(path.join(__dirname, "cell-count/pawn.json"), JSON.stringify(pawnCount));
