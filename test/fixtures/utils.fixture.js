const defaultPinDataFixture = {
  isKingAlignedWithOwnPiece: false,
  cellsThatMustBeEmpty: [],
  pieceToLookFor: null,
  possibleOpponentPieceCells: [],
};

const standardDiagonalPinDataFixture = {
  isKingAlignedWithOwnPiece: true,
  cellsThatMustBeEmpty: ["d2"],
  pieceToLookFor: ["B", "Q"],
  possibleOpponentPieceCells: ["b4", "a5"],
};

const advancedDiagonalPinDataFixture = {
  isKingAlignedWithOwnPiece: true,
  cellsThatMustBeEmpty: ["f2", "e3", "d4"],
  pieceToLookFor: ["B", "Q"],
  possibleOpponentPieceCells: ["b6", "a7"],
};

const standardVerticalPinDataFixture = {
  isKingAlignedWithOwnPiece: true,
  cellsThatMustBeEmpty: ["e7", "e6"],
  pieceToLookFor: ["R", "Q"],
  possibleOpponentPieceCells: ["e4", "e3", "e2", "e1"],
};

const standardHorizontalPinDataFixture = {
  isKingAlignedWithOwnPiece: true,
  cellsThatMustBeEmpty: ["b6", "c6", "d6", "e6", "f6"],
  pieceToLookFor: ["R", "Q"],
  possibleOpponentPieceCells: ["h6"],
};

const listOfVisitedSquaresFixture = ["a1", "a3", "a1", "h8", "a3", "a1"];

module.exports = {
  defaultPinDataFixture,
  standardDiagonalPinDataFixture,
  advancedDiagonalPinDataFixture,
  standardVerticalPinDataFixture,
  standardHorizontalPinDataFixture,
  listOfVisitedSquaresFixture,
};
