const Board = require("../classes/Board");

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

const parseMultiPgn = file => {};



module.exports = {
  parseMultiPgn: function(file) {},
};