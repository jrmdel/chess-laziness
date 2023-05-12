const config = require("../config");

const cols = ["a","b","c","d","e","f","g","h"];

const getXYCoordinates = function(cell) {
  let x = cols.indexOf(cell[0]) + 1;
  let y = +cell[1];
  return [x, y]
};

const convertXYToCell = function([x,y]) {
  return `${x > 0 ? cols[x-1] : ""}${y}`
};

const distanceBetweenCells = function(cellA, cellB) {
  let dx = Math.abs(cellA[0] - cellB[0]); // equivalent to absDiffCells
  let dy = Math.abs(cellA[1] - cellB[1]);

  if (dx != dy && Math.min(dx, dy) > 0) {
    // It's a knight move
    return config.effort.knightMove;
  }
  else if (dx == dy) {
    // It's a diagonal move
    return dx * config.effort.diagonalMove;
  } else {
    // It's a linear move
    return dx * config.effort.linearMove + dy * config.effort.linearMove;
  }
};

const unitVector = function(vect) {
  let max = Math.max( ...vect.map(v => Math.abs(v)) );
  return vect.map(n => ~~(n/max))
};

const addVect = function(v1, v2) {
  return v1.map((n,i) => n + v2[i]);
};

const getCellsBetween = function(cellA, cellB, vect = diffCells(cellA, cellB), unitVect = unitVector(vect)) {
  let from = Array.from(cellA);
  let res = [];
  for (let i = 1, l = Math.max(...vect.map(n => Math.abs(n))); i < l; i++) {
    from = addVect(from, unitVect);
    res.push(convertXYToCell(from));
  }
  return res;
};

const pathIsEmpty = function(path = [], occupiedSquares) {
  return !path.some(cell => occupiedSquares.has(cell));
};

const getCellsFrom = function(cell, unitVect) {
  let res = [];
  for (let i = 0, check = true; i<8 && check; i++) {
    cell = addVect(cell, unitVect);
    if (cell[0] > 8 || cell[0] < 1 || cell[1] > 8 || cell[1] < 1) {
      check = false
    } else res.push(convertXYToCell(cell));
  }
  return res;
};

/**
 * Precompute useful data for handling pins
 * @param {String[]} cellA King's X and Y position
 * @param {String[]} cellB Pinnee's X and Y poisition
 */
const cellsAreAligned = function(cellA, cellB) {
  let resp = {
    aligned: false,
    mustBeEmpty: [],
    pieceToLookFor: null,
    possibleCells: [],
  };
  // Create a vect between the two cells
  let vect = diffCells(cellA, cellB);

  // Check for possible alignments
  if ((vect[0] == 0 ^ vect[1] == 0) == 1) {
    // Vertical or horizontal alignment
    let unitVect = unitVector(vect);
    resp.aligned = true;
    resp.pieceToLookFor = ["R", "Q"];
    resp.mustBeEmpty = getCellsBetween(cellA, cellB, vect, unitVect);
    resp.possibleCells = getCellsFrom(cellB, unitVect);
    // for (let i = 0, check = true; i<10 && check; i++) {
    //   cellB = addVect(cellB, unitVect);
    //   if (cellB[0] > 8 || cellB[0] < 1 || cellB[1] > 8 || cellB[1] < 1) {
    //     check = false
    //   } else resp.possibleCells.push(convertXYToCell(cellB));
    // }
  } else if ((Math.abs(vect[0]) == Math.abs(vect[1])) && vect[0] != 0) {
    // Diagonally aligned
    let unitVect = unitVector(vect);
    resp.aligned = true;
    resp.pieceToLookFor = ["B", "Q"];
    resp.mustBeEmpty = getCellsBetween(cellA, cellB, vect, unitVect);
    resp.possibleCells = getCellsFrom(cellB, unitVect);
    // for (let i = 0, check = true; i<10 && check; i++) {
    //   cellB = addVect(cellB, unitVect);
    //   if (cellB[0] > 8 || cellB[0] < 1 || cellB[1] > 8 || cellB[1] < 1) {
    //     check = false
    //   } else resp.possibleCells.push(convertXYToCell(cellB));
    // }
  }
  return resp;
}

const diffCells = function(cellA, cellB) {
  return cellB.map((v,i) => v-cellA[i]);
};

const absDiffCells = function(cellA, cellB) {
  return cellB.map((v,i) => Math.abs(v-cellA[i]));
};

const mod = function (n, m) {
  return ((n % m) + m) % m;
}

module.exports = {
  computeEffort(from, to, withCapture) {
    return distanceBetweenCells(
      getXYCoordinates(from),
      getXYCoordinates(to)
    ) + (withCapture ? config.effort.capture : 0.0);
  },

  pieceCanReachSquare(turn, type, from, to, occupiedSquares) {
    let cellA = getXYCoordinates(from);
    let cellB = getXYCoordinates(to);
    let vect;
    switch (type) {
      case "N":
        vect = absDiffCells(cellA, cellB).sort();
        if (vect[0] == 1 && vect[1] == 2) return true;
        break;
      case "B":
        vect = absDiffCells(cellA, cellB);
        if (vect[0] == vect[1])
          return pathIsEmpty(getCellsBetween(cellA, cellB), occupiedSquares);
        break;
      case "R":
        vect = absDiffCells(cellA, cellB);
        if (Math.min(...vect) == 0) {
          // It can be reached, only if the path is empty
          return pathIsEmpty(getCellsBetween(cellA, cellB), occupiedSquares);
        }
        break;
      case "K":
        vect = absDiffCells(cellA, cellB);
        if (Math.max(...vect) == 1) return true;
        break;
      case "Q":
        vect = absDiffCells(cellA, cellB);
        if (vect[0] == vect[1] || Math.min(...vect) == 0)
          return pathIsEmpty(getCellsBetween(cellA, cellB), occupiedSquares);
        break;
      default:
        // Else we have a pawn
        vect = diffCells(cellA, cellB);
        if ([1, 0, -1].includes(vect[0]) && vect[1] == ((-1) ** turn)) return true;
        if (
          vect[0] == 0 &&
          vect[1] == 2*((-1) ** turn) &&
          cellA[1] == mod(2 * ((-1) ** turn),9)
        ) return true;
        break;
    }
    return false;
  },

  computePin(kingPosition, piecePosition) {
    return cellsAreAligned(
      getXYCoordinates(kingPosition),
      getXYCoordinates(piecePosition)
    );
  },
}