const fs = require("fs");
const Board = require("./classes/Board");

let r1 = fs.readFileSync("./examples/wrc-22-r1-b1.pgn","utf-8");



const parseMoves = function (moves = "") {
  let b = removeCurly(moves);
  let c = removeNestedParentheses(b);
  let d = removeDots(c);
  let e = removeNotation(d);
  let f = removeDuplicateSpaces(e);
  let g = removeTermination(f)
  let h = splitMoves(g.trim());
  return h;
};

const removeCurly = str => str.replace(/\ {.*?}/g, "");

const removeDots = str => str.replace(/\ (\d){1,}(\.){3}/g, "");

const removeNotation = str => str.replace(/[#+!?*]*/g, "");

const removeDuplicateSpaces = str => str.replace(/[ ]{2,}/g, " ");

const splitMoves = str => str.split(/\d+\.\s/g).map(s => s.trim()).filter(s => s.length > 0).map(s => s.split(/\s/));

const removeTermination = str => str.replace(/(\s1-0)*(\s0-1)*(\s1\/2-1\/2)*/g, "")

const removeNestedParentheses = (str) => {
  let count = 0;
  let res = "";
  for (let i=0,l=str.length; i<l; i++) {
    if (str[i] == "(") count++;
    if (count == 0) res += str[i];
    if (str[i] == ")") count--;
  }
  return res;
}

const parsePgn = str => {
  let variant = str.match(/(?<=variant ").*(?=")+/gi)?.[0] || "standard";
  return variant.match(/standard/i) ? {
    white: str.match(/(?<=white ").*(?=")/gi)?.[0] || "",
      whiteElo: str.match(/(?<=whiteelo ")\d+/gi)?.[0] || "",
      black: str.match(/(?<=white ").*(?=")/gi)?.[0] || "",
      blackElo: str.match(/(?<=blackelo ")\d+/gi)?.[0] || "",
      opening: str.match(/(?<=opening ").*(?=")/gi)?.[0] || "",
      result: str.match(/(?<=result ").*(?=")/gi)?.[0] || "",
    moves: parseMoves(str?.replace(/\[.*?\]\n/g, "")?.trim()?.replace(/\n/g, " ")),
  } : {};
};


const getDiagonals = cell => {
  let [ind, n] = getCoordinates(cell);
  const cols = ["a","b","c","d","e","f","g","h"];
  return [].concat(
    cols.map((c,i) => `${c}${n - i + ind}`).slice(Math.max(0,n-8+ind), Math.min(8,n+ind)),
    cols.map((c,i) => `${c}${n + i - ind}`).slice(Math.max(0,ind-n+1), Math.min(8,9-n+ind)),
  ).filter(c => c != cell);
}

const getRanksAndFiles = cell => {
  const cols = ["a","b","c","d","e","f","g","h"];
  return [].concat(
    [...Array(8).keys()].map(n => `${cell[0]}${n+1}`),
    cols.map(c => `${c}${cell[1]}`),
  ).filter(c => c != cell);
}

const getCoordinates = cell => {
  const cols = ["a","b","c","d","e","f","g","h"];
  let x = cols.indexOf(cell[0]);
  let y = +cell[1];
  return [x, y]
}



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