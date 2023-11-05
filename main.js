const fs = require("fs");
const Board = require("src/classes/Board");
const { cleanAndParseMoves } = require("src/helpers");

let r1 = fs.readFileSync("./examples/wrc-22-r1-b1.pgn", "utf-8");

const parsePgn = (str) => {
  let variant = str.match(/(?<=variant ").*(?=")+/gi)?.[0] || "standard";
  return variant.match(/standard/i)
    ? {
        white: str.match(/(?<=white ").*(?=")/gi)?.[0] || "",
        whiteElo: str.match(/(?<=whiteelo ")\d+/gi)?.[0] || "",
        black: str.match(/(?<=black ").*(?=")/gi)?.[0] || "",
        blackElo: str.match(/(?<=blackelo ")\d+/gi)?.[0] || "",
        opening: str.match(/(?<=opening ").*(?=")/gi)?.[0] || "",
        result: str.match(/(?<=result ").*(?=")/gi)?.[0] || "",
        moves: cleanAndParseMoves(
          str
            ?.replace(/\[.*?\]\r?\n/g, "")
            ?.trim()
            ?.replace(/\r?\n/g, " ")
        ),
      }
    : {};
};

const getDiagonals = (cell) => {
  let [ind, n] = getCoordinates(cell);
  const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];
  return []
    .concat(
      cols
        .map((c, i) => `${c}${n - i + ind}`)
        .slice(Math.max(0, n - 8 + ind), Math.min(8, n + ind)),
      cols
        .map((c, i) => `${c}${n + i - ind}`)
        .slice(Math.max(0, ind - n + 1), Math.min(8, 9 - n + ind))
    )
    .filter((c) => c != cell);
};

const getRanksAndFiles = (cell) => {
  const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];
  return []
    .concat(
      [...Array(8).keys()].map((n) => `${cell[0]}${n + 1}`),
      cols.map((c) => `${c}${cell[1]}`)
    )
    .filter((c) => c != cell);
};

const getCoordinates = (cell) => {
  const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];
  let x = cols.indexOf(cell[0]);
  let y = +cell[1];
  return [x, y];
};

let m1 = parsePgn(r1);

let lazy = [];

console.time("process");
const b1 = new Board();
for (let m of m1.moves.flat()) {
  b1.setMove(m);
}
console.timeEnd("process");

lazy.push({ result: m1.result, ...b1.getLazyScore() });

// fs.writeFileSync("analysis.json", JSON.stringify(lazy, null, 2));
