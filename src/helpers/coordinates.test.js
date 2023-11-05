const { FILES_LETTER } = require("src/helpers/common.constants");
const {
  convertCellToCoordinates,
  convertCoordinatesToCell,
  getUnitVector,
  addVectors,
  getDistanceVector,
  getAbsoluteDistanceVector,
  getCellsBetween,
} = require("src/helpers");

describe("coordinates test", () => {
  describe("convertCellToCoordinates", () => {
    it("should convert all 64 cells correctly", () => {
      for (let i = 0; i < FILES_LETTER.length; i++) {
        for (let j = 1; j < 9; j++) {
          const cell = `${FILES_LETTER[i]}${j}`;

          const result = convertCellToCoordinates(cell);

          expect(result).toEqual([i + 1, j]);
        }
      }
    });

    it("should throw an error if at least 1 coordinate is not valid", () => {
      const error = new Error("Invalid coordinates");

      expect(() => convertCellToCoordinates("i7")).toThrowError(error);
      expect(() => convertCellToCoordinates("a0")).toThrowError(error);
      expect(() => convertCellToCoordinates("")).toThrowError(error);
    });
  });

  describe("convertCoordinatesToCell", () => {
    it("should convert all 64 coordinates back to cells correctly", () => {
      for (let i = 0; i < FILES_LETTER.length; i++) {
        for (let j = 1; j < 9; j++) {
          const coordinates = [i + 1, j];
          const cell = `${FILES_LETTER[i]}${j}`;

          const result = convertCoordinatesToCell(coordinates);

          expect(result).toEqual(cell);
        }
      }
    });

    it("should throw an error if at least 1 coordinate is not valid", () => {
      const error = new Error("Invalid coordinates");

      expect(() => convertCoordinatesToCell([9, 7])).toThrowError(error);
      expect(() => convertCoordinatesToCell([3, 0])).toThrowError(error);
      expect(() => convertCoordinatesToCell([0, 0])).toThrowError(error);
    });
  });

  describe("getUnitVector", () => {
    it("should compute possible chess vectors correctly", () => {
      // Bishop moves
      const bishopResultA = getUnitVector([3, -3]);
      const bishopResultB = getUnitVector([6, 6]);
      const bishopResultC = getUnitVector([-2, 2]);
      const bishopResultD = getUnitVector([-3, -3]);

      expect(bishopResultA).toEqual([1, -1]);
      expect(bishopResultB).toEqual([1, 1]);
      expect(bishopResultC).toEqual([-1, 1]);
      expect(bishopResultD).toEqual([-1, -1]);

      // Rook moves
      const rookResultA = getUnitVector([3, 0]);
      const rookResultB = getUnitVector([0, 6]);
      const rookResultC = getUnitVector([-2, 0]);
      const rookResultD = getUnitVector([0, -3]);

      expect(rookResultA).toEqual([1, 0]);
      expect(rookResultB).toEqual([0, 1]);
      expect(rookResultC).toEqual([-1, 0]);
      expect(rookResultD).toEqual([0, -1]);

      // King move (is already a unit vector move)
      const kingResultA = getUnitVector([1, 0]);
      const kingResultB = getUnitVector([-1, -1]);

      expect(kingResultA).toEqual([1, 0]);
      expect(kingResultB).toEqual([-1, -1]);
    });

    it("should not be used for knight moves, since it always omits one vector component", () => {
      const knightResultA = getUnitVector([2, 1]);
      const knightResultB = getUnitVector([2, -1]);

      expect(knightResultA).toEqual([1, 0]);
      expect(knightResultB).toEqual([1, 0]);
    });
  });

  describe("addVectors", () => {
    it("should sum two vectors correctly", () => {
      const resultA = addVectors([3, 3], [0, -1]);
      const resultB = addVectors([3, -3], [0, -1]);
      const resultC = addVectors([2, 0], [-1, 1]);

      expect(resultA).toEqual([3, 2]);
      expect(resultB).toEqual([3, -4]);
      expect(resultC).toEqual([1, 1]);
    });
  });

  describe("getDistanceVector", () => {
    it("should compute the difference between two vectors", () => {
      const resultA = getDistanceVector([8, 1], [1, 1]);
      const resultB = getDistanceVector([1, 1], [8, 1]);
      const resultC = getDistanceVector([4, 4], [1, 7]);
      const resultD = getDistanceVector([4, 4], [2, 2]);

      expect(resultA).toEqual([-7, 0]);
      expect(resultB).toEqual([7, 0]);
      expect(resultC).toEqual([-3, 3]);
      expect(resultD).toEqual([-2, -2]);
    });
  });

  describe("getAbsoluteDistanceVector", () => {
    it("should compute the absolute difference between two vectors", () => {
      const resultA = getAbsoluteDistanceVector([8, 1], [1, 1]);
      const resultB = getAbsoluteDistanceVector([1, 1], [8, 1]);
      const resultC = getAbsoluteDistanceVector([4, 4], [1, 7]);
      const resultD = getAbsoluteDistanceVector([4, 4], [2, 2]);

      expect(resultA).toEqual([7, 0]);
      expect(resultB).toEqual([7, 0]);
      expect(resultC).toEqual([3, 3]);
      expect(resultD).toEqual([2, 2]);
    });
  });

  describe("getCellsBetween", () => {
    it("should return the list of cells between two input cells", () => {
      const resultA = getCellsBetween([8, 1], [1, 1]); // "a1" and "h1"
      const resultB = getCellsBetween([8, 8], [8, 1]); // "h8" and "h1"
      const resultC = getCellsBetween([4, 4], [1, 7]); // "d4" and "a7"
      const resultD = getCellsBetween([3, 4], [1, 2]); // "c4" and "a2"

      expect(resultA).toEqual(["g1", "f1", "e1", "d1", "c1", "b1"]);
      expect(resultB).toEqual(["h7", "h6", "h5", "h4", "h3", "h2"]);
      expect(resultC).toEqual(["c5", "b6"]);
      expect(resultD).toEqual(["b3"]);
    });
  });
});
