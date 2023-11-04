const { calculateMoveEffort, isPathEmpty, getCellsFrom } = require("src/helpers/utils");

jest.mock("config", () => {
  return {
    effort: {
      knightMove: 1.5,
      capture: 0.0,
      diagonalMove: 1,
      linearMove: 1,
    },
  };
});

describe("utils test", () => {
  describe("calculateMoveEffort", () => {
    // TODO: the call to getAbsoluteDistanceVector should be mocked

    it("should compute all types of chess moves based on the effort it takes", () => {
      // Diagonal moves
      const resultA = calculateMoveEffort([1, 2], [3, 4]);
      const resultB = calculateMoveEffort([8, 8], [3, 3]);

      expect(resultA).toEqual(2);
      expect(resultB).toEqual(5);

      // Linear moves
      const resultC = calculateMoveEffort([1, 4], [4, 4]);
      const resultD = calculateMoveEffort([5, 7], [5, 3]);

      expect(resultC).toEqual(3);
      expect(resultD).toEqual(4);

      // Knight moves
      const c6 = [3, 6];
      const knightResults = [
        calculateMoveEffort(c6, [1, 5]),
        calculateMoveEffort(c6, [5, 5]),
        calculateMoveEffort(c6, [2, 4]),
        calculateMoveEffort(c6, [4, 8]),
        calculateMoveEffort([1, 7], c6),
        calculateMoveEffort([5, 7], c6),
        calculateMoveEffort([2, 8], c6),
        calculateMoveEffort([4, 4], c6),
      ];

      expect(knightResults).toEqual(Array(8).fill(1.5));
    });

    it("should return any non-standard chess moves the sum of two rook moves to get there", () => {
      const resultA = calculateMoveEffort([2, 1], [8, 4]); // from "b1" to "h4"
      const resultB = calculateMoveEffort([1, 1], [8, 7]); // from "a1" to "h7"

      expect(resultA).toEqual(9);
      expect(resultB).toEqual(13);
    });
  });

  describe("isPathEmpty", () => {
    it("should return true when cells in path are not in occupied set", () => {
      const occupiedSquares = new Set(["a1", "b2", "c3"]);

      const resultA = isPathEmpty(["e8", "e7"], occupiedSquares);
      const resultB = isPathEmpty(["a2", "b1"], occupiedSquares);
      const resultC = isPathEmpty(["c2", "b3", "a4"], occupiedSquares);

      expect(resultA).toBeTruthy();
      expect(resultB).toBeTruthy();
      expect(resultC).toBeTruthy();
    });

    it("should return false when a cell in path is occupied", () => {
      const occupiedSquares = new Set(["a1", "b2", "c3"]);

      const resultA = isPathEmpty(["c6", "c5", "c4", "c3", "c2"], occupiedSquares);
      const resultB = isPathEmpty(["a2", "b2", "c2"], occupiedSquares);
      const resultC = isPathEmpty(["a1", "b2", "c3"], occupiedSquares);

      expect(resultA).toBeFalsy();
      expect(resultB).toBeFalsy();
      expect(resultC).toBeFalsy();
    });
  });

  describe("getCellsFrom", () => {
    it("should return a list of cells that follow a given path without going outside the board", () => {
      const c4 = [3, 4];
      const a6 = [1, 6];

      const resultA = getCellsFrom(c4, [1, 0]);
      const resultB = getCellsFrom(c4, [-1, -1]);
      const resultC = getCellsFrom(c4, [-1, 1]);
      const resultD = getCellsFrom(a6, [1, 1]);
      const resultE = getCellsFrom(a6, [-1, 0]);

      expect(resultA).toEqual(["d4", "e4", "f4", "g4", "h4"]);
      expect(resultB).toEqual(["b3", "a2"]);
      expect(resultC).toEqual(["b5", "a6"]);
      expect(resultD).toEqual(["b7", "c8"]);
      expect(resultE).toEqual([]);
    });
  });
});
