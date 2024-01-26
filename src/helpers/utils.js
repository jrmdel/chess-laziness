const {
  getAbsoluteDistanceVector,
  addVectors,
  convertCoordinatesToCell,
  convertCellToCoordinates,
  getDistanceVector,
  getUnitVector,
  getCellsBetween,
} = require("src/helpers/coordinates");
const config = require("../../config");
const { INITIAL_SQUARE_COUNT } = require("src/helpers/common.constants");

/**
 * Calculate how much effort is needed to go from one cell to another
 * @param {Number[]} fromCell - Starting cell
 * @param {Number[]} toCell - Ending cell
 * @returns {Number} The computed effort
 */
function calculateMoveEffort(fromCell, toCell) {
  const cellCoordinatesA = convertCellToCoordinates(fromCell);
  const cellCoordinatesB = convertCellToCoordinates(toCell);
  const [dx, dy] = getAbsoluteDistanceVector(cellCoordinatesA, cellCoordinatesB);

  if (isKnight([dx, dy])) {
    return config.effort.knightMove;
  }
  if (isDiagonal([dx, dy])) {
    return dx * config.effort.diagonalMove;
  }
  return (dx + dy) * config.effort.linearMove;
}

/**
 * Calculate the effort it took to do the move and its eventual capture
 * @param {String} from - Origin cell
 * @param {String} to - Destination cell
 * @param {Boolean} isWithCapture - True if the move is a capture, false otherwise
 * @returns {Number} The resulting effort
 */
function computeEffort(from, to, isWithCapture = false) {
  return calculateMoveEffort(from, to) + (isWithCapture ? config.effort.capture : 0.0);
}

/**
 * Determines if none of the cells in path are occupied
 * @param {String[]} path - A sequence of cells
 * @param {Set<String>} occupiedSquares - All currently occupied cells on the board
 * @returns {Boolean}
 */
function isPathEmpty(path = [], occupiedSquares) {
  return !path.some((cell) => occupiedSquares.has(cell));
}

/**
 * Determines if the given cell is outside the boundaries of the chess board
 * @param {Number[]} cellCoordinates - The cell to check
 * @returns {Boolean}
 */
function isOutsideTheBoard([x, y]) {
  return x > 8 || y > 8 || x < 1 || y < 1;
}

/**
 * Get the list of cells following a starting point and a direction until it reaches the edge of the board
 * @param {Number[]} cellCoordinates - The starting cell
 * @param {Number[]} unitVector - A direction
 * @returns {String[]}
 */
function getCellsFrom(cellCoordinates, unitVector) {
  const cells = [];

  for (let i = 0, check = true; i < 8 && check; i++) {
    cellCoordinates = addVectors(cellCoordinates, unitVector);

    if (isOutsideTheBoard(cellCoordinates)) {
      check = false;
    } else {
      cells.push(convertCoordinatesToCell(cellCoordinates));
    }
  }

  return cells;
}

/**
 * Get useful data for handling pins
 * @param {String} kingPosition - King's cell name
 * @param {String} piecePosition - Possible pinned piece's cell name
 * @returns
 */
function computePin(kingPosition, piecePosition) {
  const kingCellCoordinates = convertCellToCoordinates(kingPosition);
  const pieceCellCoordinates = convertCellToCoordinates(piecePosition);

  const pinData = {
    isKingAlignedWithOwnPiece: false,
    cellsThatMustBeEmpty: [],
    pieceToLookFor: null,
    possibleOpponentPieceCells: [],
  };
  // Create vectors between the two cells
  const kingToPieceVector = getDistanceVector(kingCellCoordinates, pieceCellCoordinates);
  const unitVector = getUnitVector(kingToPieceVector);

  if (isHorizontalOrVertical(kingToPieceVector)) {
    pinData.isKingAlignedWithOwnPiece = true;
    pinData.pieceToLookFor = ["R", "Q"];
    pinData.cellsThatMustBeEmpty = getCellsBetween(
      kingCellCoordinates,
      pieceCellCoordinates,
      kingToPieceVector,
      unitVector
    );
    pinData.possibleOpponentPieceCells = getCellsFrom(pieceCellCoordinates, unitVector);
  } else if (isDiagonal(kingToPieceVector)) {
    pinData.isKingAlignedWithOwnPiece = true;
    pinData.pieceToLookFor = ["B", "Q"];
    pinData.cellsThatMustBeEmpty = getCellsBetween(
      kingCellCoordinates,
      pieceCellCoordinates,
      kingToPieceVector,
      unitVector
    );
    pinData.possibleOpponentPieceCells = getCellsFrom(pieceCellCoordinates, unitVector);
  }

  return pinData;
}

/**
 * Determines if the given vector is horizontal or vertical
 * @param {Number[]} vector - Vector to check
 * @returns {Boolean} `true` if it is horizontal or vertical, `false` otherwise
 */
function isHorizontalOrVertical([dx, dy]) {
  return ((dx === 0) ^ (dy === 0)) === 1;
}

/**
 * Determines if the given vector follows a diagonal
 * @param {Number[]} vector - Vector to check
 * @returns {Boolean} `true` if it does, `false` otherwise
 */
function isDiagonal([dx, dy]) {
  return dx + dy === 0 || dx - dy === 0;
}

/**
 * Determines if the given vector looks like a queen move
 * @param {Number[]} vector - Vector to check
 * @returns {Boolean} `true` if it does, `false` otherwise
 */
function isQueen(vector) {
  return isDiagonal(vector) || isHorizontalOrVertical(vector);
}

/**
 * Determines if the given vector draws an L-shape
 * @param {Number[]} vector - Vector to check
 * @returns {Boolean} `true` if it does, `false` otherwise
 */
function isKnight([dx, dy]) {
  return dx * dx + dy * dy === 5;
}

/**
 * Determines if the given vector is within a distance of 1 on the board
 * @param {Number[]} vector - Vector to check
 * @returns {Boolean} `true` if it is, `false` otherwise
 */
function isKing([dx, dy]) {
  return Math.abs(dx) < 2 && Math.abs(dy) < 2;
}

/**
 * Determines if the given move can be a legal pawn move
 * @param {Number} turn - 0 if white to move, 1 if black to move
 * @param {Number[]} startCoordinates - Starting position
 * @param {Number[]} endCoordinates - Ending position
 * @param {Number[]} vector - Distance vector between the 2 positions
 * @param {Set<String>} occupiedSquares - All currently occupied squares on the board
 * @returns {Boolean} - `true` if it is, `false` otherwise
 */
function isLegalPawnMove(turn, startCoordinates, endCoordinates, vector, occupiedSquares) {
  if (Math.abs(vector[0]) < 2 && vector[1] === (-1) ** turn) {
    return true;
  }
  if (
    vector[0] === 0 &&
    vector[1] === 2 * (-1) ** turn &&
    startCoordinates[1] === mod(2 * (-1) ** turn, 9)
  ) {
    return isPathEmpty(getCellsBetween(startCoordinates, endCoordinates, vector), occupiedSquares);
  }
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function pieceCanReachSquare(turn, type, from, to, occupiedSquares) {
  const cellCoordinatesA = convertCellToCoordinates(from);
  const cellCoordinatesB = convertCellToCoordinates(to);
  const vector = getDistanceVector(cellCoordinatesA, cellCoordinatesB);

  switch (type) {
    case "N":
      return isKnight(vector);

    case "B":
      return (
        isDiagonal(vector) &&
        isPathEmpty(getCellsBetween(cellCoordinatesA, cellCoordinatesB), occupiedSquares)
      );

    case "R":
      return (
        isHorizontalOrVertical(vector) &&
        isPathEmpty(getCellsBetween(cellCoordinatesA, cellCoordinatesB), occupiedSquares)
      );

    case "Q":
      return (
        isQueen(vector) &&
        isPathEmpty(getCellsBetween(cellCoordinatesA, cellCoordinatesB), occupiedSquares)
      );

    case "K":
      return isKing(vector);

    default:
      return isLegalPawnMove(turn, cellCoordinatesA, cellCoordinatesB, vector, occupiedSquares);
  }
}

function countSquares(list) {
  const squares = INITIAL_SQUARE_COUNT;
  for (const square of list) {
    squares[square] += 1;
  }
  return squares;
}

module.exports = {
  isPathEmpty,
  getCellsFrom,
  computeEffort,
  pieceCanReachSquare,
  computePin,
  countSquares,
};
