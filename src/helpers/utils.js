const config = require("config");

function calculateMoveEffort(cellA, cellB) {
  let dx = Math.abs(cellA[0] - cellB[0]); // equivalent to getAbsoluteVectorDistance
  let dy = Math.abs(cellA[1] - cellB[1]);

  if (dx != dy && Math.min(dx, dy) > 0) {
    // It's a knight move
    return config.effort.knightMove;
  } else if (dx == dy) {
    // It's a diagonal move
    return dx * config.effort.diagonalMove;
  } else {
    // It's a linear move
    return (dx + dy) * config.effort.linearMove;
  }
}

const pathIsEmpty = function (path = [], occupiedSquares) {
  return !path.some((cell) => occupiedSquares.has(cell));
};

const getCellsFrom = function (cell, unitVect) {
  let res = [];
  for (let i = 0, check = true; i < 8 && check; i++) {
    cell = addVectors(cell, unitVect);
    if (cell[0] > 8 || cell[0] < 1 || cell[1] > 8 || cell[1] < 1) {
      check = false;
    } else res.push(convertCoordinatesToCell(cell));
  }
  return res;
};

/**
 * Precompute useful data for handling pins
 * @param {String[]} cellA King's X and Y position
 * @param {String[]} cellB Pinnee's X and Y position
 */
const cellsAreAligned = function (cellA, cellB) {
  let resp = {
    aligned: false,
    mustBeEmpty: [],
    pieceToLookFor: null,
    possibleCells: [],
  };
  // Create a vect between the two cells
  let vect = getDistanceVector(cellA, cellB);

  // Check for possible alignments
  if (((vect[0] == 0) ^ (vect[1] == 0)) == 1) {
    // Vertical or horizontal alignment
    let unitVect = getUnitVector(vect);
    resp.aligned = true;
    resp.pieceToLookFor = ["R", "Q"];
    resp.mustBeEmpty = getCellsBetween(cellA, cellB, vect, unitVect);
    resp.possibleCells = getCellsFrom(cellB, unitVect);
    // for (let i = 0, check = true; i<10 && check; i++) {
    //   cellB = addVectors(cellB, unitVect);
    //   if (cellB[0] > 8 || cellB[0] < 1 || cellB[1] > 8 || cellB[1] < 1) {
    //     check = false
    //   } else resp.possibleCells.push(convertCoordinatesToCell(cellB));
    // }
  } else if (Math.abs(vect[0]) == Math.abs(vect[1]) && vect[0] != 0) {
    // Diagonally aligned
    let unitVect = getUnitVector(vect);
    resp.aligned = true;
    resp.pieceToLookFor = ["B", "Q"];
    resp.mustBeEmpty = getCellsBetween(cellA, cellB, vect, unitVect);
    resp.possibleCells = getCellsFrom(cellB, unitVect);
    // for (let i = 0, check = true; i<10 && check; i++) {
    //   cellB = addVectors(cellB, unitVect);
    //   if (cellB[0] > 8 || cellB[0] < 1 || cellB[1] > 8 || cellB[1] < 1) {
    //     check = false
    //   } else resp.possibleCells.push(convertCoordinatesToCell(cellB));
    // }
  }
  return resp;
};

const mod = function (n, m) {
  return ((n % m) + m) % m;
};

module.exports = {
  computeEffort(from, to, withCapture) {
    return (
      calculateMoveEffort(convertCellToCoordinates(from), convertCellToCoordinates(to)) +
      (withCapture ? config.effort.capture : 0.0)
    );
  },

  pieceCanReachSquare(turn, type, from, to, occupiedSquares) {
    let cellA = convertCellToCoordinates(from);
    let cellB = convertCellToCoordinates(to);
    let vect;
    switch (type) {
      case "N":
        vect = getAbsoluteVectorDistance(cellA, cellB).sort();
        if (vect[0] == 1 && vect[1] == 2) return true;
        break;
      case "B":
        vect = getAbsoluteVectorDistance(cellA, cellB);
        if (vect[0] == vect[1]) return pathIsEmpty(getCellsBetween(cellA, cellB), occupiedSquares);
        break;
      case "R":
        vect = getAbsoluteVectorDistance(cellA, cellB);
        if (Math.min(...vect) == 0) {
          // It can be reached, only if the path is empty
          return pathIsEmpty(getCellsBetween(cellA, cellB), occupiedSquares);
        }
        break;
      case "K":
        vect = getAbsoluteVectorDistance(cellA, cellB);
        if (Math.max(...vect) == 1) return true;
        break;
      case "Q":
        vect = getAbsoluteVectorDistance(cellA, cellB);
        if (vect[0] == vect[1] || Math.min(...vect) == 0)
          return pathIsEmpty(getCellsBetween(cellA, cellB), occupiedSquares);
        break;
      default:
        // Else we have a pawn
        vect = getDistanceVector(cellA, cellB);
        if ([1, 0, -1].includes(vect[0]) && vect[1] == (-1) ** turn) return true;
        if (vect[0] == 0 && vect[1] == 2 * (-1) ** turn && cellA[1] == mod(2 * (-1) ** turn, 9))
          return true;
        break;
    }
    return false;
  },

  computePin(kingPosition, piecePosition) {
    return cellsAreAligned(
      convertCellToCoordinates(kingPosition),
      convertCellToCoordinates(piecePosition)
    );
  },
};
