const { FILES_LETTER } = require("src/helpers/common.constants");

/**
 * Mathematically compute the x and y coordinates of a given cell
 * @param {String} cell - Human readable cell name (eg. `"e4"`)
 * @returns {Number[]} x and y coordinates
 */
function convertCellToCoordinates(cell) {
  let x = FILES_LETTER.indexOf(cell[0]) + 1;
  let y = +cell[1];
  return [x, y];
}

/**
 * Convert x and y values to a cell name
 * @param {Number[]} coordinates - x and y coordinates of a cell (eg. `[4, 4]`)
 * @returns {String} Human readable cell name
 */
function convertCoordinatesToCell([x, y]) {
  return `${x > 0 ? FILES_LETTER[x - 1] : ""}${y}`;
}

function getAbsoluteMaximumValue(list) {
  return Math.max(...list.map((value) => Math.abs(value)));
}

/**
 * Get the unit vector direction
 * @param {Number[]} vector - The relative distance between two cells
 * @returns {Number[]} A 2D-vector with only 3 possible values: -1, 0 and 1
 */
function getUnitVector(vector) {
  const longestAbsoluteDistance = getAbsoluteMaximumValue(vector);
  return vector.map((distance) => ~~(distance / longestAbsoluteDistance));
}

/**
 * Sum each terms of the given vectors and return the result
 * @param {Number[]} vectorA - A 2D-vector (eg. `[3, -3]`)
 * @param {Number[]} vectorB - Another 2D-vector
 * @returns {Number[]} The addition of the 2 arguments
 */
function addVectors(vectorA, vectorB) {
  return vectorA.map((value, i) => value + vectorB[i]);
}

/**
 * Compute the distance from the first cell to the second
 * @param {Number[]} cellCoordinatesA - Coordinates of the first cell (eg. `[3, 2]`)
 * @param {Number[]} cellCoordinatesB - Coordinates of the second cell
 * @returns {Number[]} The distance between the cells as a 2D-vector
 */
function getDistanceVector(cellCoordinatesA, cellCoordinatesB) {
  return cellCoordinatesB.map((value, i) => value - cellCoordinatesA[i]);
}

/**
 * Compute the absolute distance from the first cell to the second
 * @param {Number[]} cellCoordinatesA - Coordinates of the first cell (eg. `[3, 2]`)
 * @param {Number[]} cellCoordinatesB - Coordinates of the second cell
 * @returns {Number[]} The absolute distance between the cells as a 2D-vector
 */
function getAbsoluteVectorDistance(cellCoordinatesA, cellCoordinatesB) {
  return cellCoordinatesB.map((value, i) => Math.abs(value - cellCoordinatesA[i]));
}

function getCellsBetween(
  cellCoordinatesA,
  cellCoordinatesB,
  distanceVector = getDistanceVector(cellCoordinatesA, cellCoordinatesB),
  unitVector = getUnitVector(distanceVector)
) {
  const cellNames = [];
  let from = Array.from(cellCoordinatesA);

  for (let i = 1, l = getAbsoluteMaximumValue(distanceVector); i < l; i++) {
    from = addVectors(from, unitVector);
    cellNames.push(convertCoordinatesToCell(from));
  }

  return cellNames;
}

module.exports = {
  convertCellToCoordinates,
  convertCoordinatesToCell,
  getUnitVector,
  addVectors,
  getDistanceVector,
  getAbsoluteVectorDistance,
};
