const { FILES_LETTER } = require("src/helpers/common.constants");
const {
  convertCellToCoordinates,
  convertCoordinatesToCell,
  getUnitVector,
  addVectors,
  getDistanceVector,
  getAbsoluteVectorDistance,
} = require("src/helpers/coordinates");

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

  describe("getAbsoluteVectorDistance", () => {
    it("should compute the absolute difference between two vectors", () => {
      const resultA = getAbsoluteVectorDistance([8, 1], [1, 1]);
      const resultB = getAbsoluteVectorDistance([1, 1], [8, 1]);
      const resultC = getAbsoluteVectorDistance([4, 4], [1, 7]);
      const resultD = getAbsoluteVectorDistance([4, 4], [2, 2]);

      expect(resultA).toEqual([7, 0]);
      expect(resultB).toEqual([7, 0]);
      expect(resultC).toEqual([3, 3]);
      expect(resultD).toEqual([2, 2]);
    });
  });
});
