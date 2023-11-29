function removeCurly(inputString) {
  const SPACE_AND_CURLY_REGEX = new RegExp(/\ {.*?}/g);

  return inputString.replace(SPACE_AND_CURLY_REGEX, "");
}

function removeDots(inputString) {
  const DIGITS_AND_THREE_OR_MORE_DOTS_REGEX = new RegExp(/\ (\d)+(\.){3,}/g);

  return inputString.replace(DIGITS_AND_THREE_OR_MORE_DOTS_REGEX, "");
}

function removeNotation(inputString) {
  const CHESS_SYMBOLS_REGEX = new RegExp(/[#+!?]*/g);

  return inputString.replace(CHESS_SYMBOLS_REGEX, "");
}

function removeDuplicateSpaces(inputString) {
  const MULTIPLE_SPACES_REGEX = new RegExp(/[ ]{2,}/g);

  return inputString.replace(MULTIPLE_SPACES_REGEX, " ");
}

function removeTermination(inputString) {
  const POSSIBLE_CHESS_TERMINATIONS_REGEX = new RegExp(/\s(\*|1-0|0-1|1\/2-1\/2)/g);

  return inputString.replace(POSSIBLE_CHESS_TERMINATIONS_REGEX, "");
}

function removeNestedParentheses(inputString) {
  let count = 0;
  let resultString = "";

  for (let i = 0, l = inputString.length; i < l; i++) {
    if (inputString[i] == "(") count++;
    if (count == 0) resultString += inputString[i];
    if (inputString[i] == ")") count--;
  }

  return resultString;
}

function removeEverything(moves = "") {
  const pipeline = [
    removeCurly,
    removeNestedParentheses,
    removeDots,
    removeNotation,
    removeDuplicateSpaces,
    removeTermination,
  ];

  return pipeline
    .reduce((acc, fn) => {
      return fn(acc);
    }, moves)
    .trim();
}

function splitMoves(inputString) {
  const MOVE_NUMBER_REGEX = new RegExp(/\d+\.\s?/g);

  const listOfMoves = inputString.split(MOVE_NUMBER_REGEX);
  const listOfValidMoves = listOfMoves
    .map((moves) => moves.trim())
    .filter((moves) => moves.length > 0);

  return listOfValidMoves.map((moves) => moves.split(" "));
}

function cleanAndParseMoves(dirtyInput = "") {
  const cleanSequenceOfMoves = removeEverything(dirtyInput);
  return splitMoves(cleanSequenceOfMoves);
}

module.exports = {
  removeCurly,
  removeDots,
  removeNotation,
  removeDuplicateSpaces,
  removeTermination,
  removeNestedParentheses,
  removeEverything,
  splitMoves,
  cleanAndParseMoves,
};
