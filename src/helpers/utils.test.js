const {
  computeEffort,
  isPathEmpty,
  getCellsFrom,
  computePin,
  pieceCanReachSquare,
} = require("src/helpers");
const {
  standardDiagonalPinDataFixture,
  advancedDiagonalPinDataFixture,
  standardVerticalPinDataFixture,
  standardHorizontalPinDataFixture,
  defaultPinDataFixture,
} = require("test/fixtures/utils.fixture");

jest.mock("config", () => {
  return {
    effort: {
      knightMove: 1.5,
      capture: 42,
      diagonalMove: 1,
      linearMove: 1,
    },
  };
});

describe("utils test", () => {
  describe("computeEffort", () => {
    // TODO: the call to getAbsoluteDistanceVector should be mocked

    it("should compute all types of chess moves based on the effort it takes", () => {
      // Diagonal moves
      const resultA = computeEffort("a2", "c4");
      const resultB = computeEffort("h8", "c3");

      expect(resultA).toEqual(2);
      expect(resultB).toEqual(5);

      // Linear moves
      const resultC = computeEffort("a4", "d4");
      const resultD = computeEffort("f7", "f3");

      expect(resultC).toEqual(3);
      expect(resultD).toEqual(4);

      // Knight moves
      const knightResults = [
        computeEffort("c6", "a5"),
        computeEffort("c6", "e5"),
        computeEffort("c6", "b4"),
        computeEffort("c6", "d8"),
        computeEffort("a7", "c6"),
        computeEffort("e7", "c6"),
        computeEffort("b8", "c6"),
        computeEffort("d4", "c6"),
      ];

      expect(knightResults).toEqual(Array(8).fill(1.5));
    });

    it("should return any non-standard chess moves the sum of two rook moves to get there", () => {
      const resultA = computeEffort("b1", "h4");
      const resultB = computeEffort("a1", "h7");

      expect(resultA).toEqual(9);
      expect(resultB).toEqual(13);
    });

    it("should add capture effort", () => {
      const diagonalCaptureResult = computeEffort("h8", "c3", true);
      const linearCaptureResult = computeEffort("a4", "d4", true);
      const knightCaptureResult = computeEffort("b8", "c6", true);

      expect(diagonalCaptureResult).toEqual(47);
      expect(linearCaptureResult).toEqual(45);
      expect(knightCaptureResult).toEqual(43.5);
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

  describe("computePin", () => {
    it("should work for diagonal pins", () => {
      const resultA = computePin("e1", "c3");
      const resultB = computePin("g1", "c5");

      expect(resultA).toEqual(standardDiagonalPinDataFixture);
      expect(resultB).toEqual(advancedDiagonalPinDataFixture);
    });

    it("should work for linear pins", () => {
      const resultA = computePin("e8", "e5");
      const resultB = computePin("a6", "g6");

      expect(resultA).toEqual(standardVerticalPinDataFixture);
      expect(resultB).toEqual(standardHorizontalPinDataFixture);
    });

    it("should return that cells are not aligned when indeed they are not", () => {
      const resultA = computePin("b8", "c6");
      const resultB = computePin("f7", "g3");
      const resultC = computePin("a1", "d7");
      const resultD = computePin("e5", "b4");

      expect(resultA).toEqual(defaultPinDataFixture);
      expect(resultB).toEqual(defaultPinDataFixture);
      expect(resultC).toEqual(defaultPinDataFixture);
      expect(resultD).toEqual(defaultPinDataFixture);
    });
  });

  describe("pieceCanReachSquare", () => {
    it("should return true when it's a legal piece move and the board is empty", () => {
      const emptyBoard = new Set([]);

      // Knight moves
      const knightResultA = pieceCanReachSquare(0, "N", "b1", "c3", emptyBoard);
      const knightResultB = pieceCanReachSquare(1, "N", "e4", "g5", emptyBoard);

      expect(knightResultA).toBeTruthy();
      expect(knightResultB).toBeTruthy();

      // Bishop moves
      const bishopResultA = pieceCanReachSquare(0, "B", "c1", "g5", emptyBoard);
      const bishopResultB = pieceCanReachSquare(1, "B", "h2", "c7", emptyBoard);

      expect(bishopResultA).toBeTruthy();
      expect(bishopResultB).toBeTruthy();

      // Rook moves
      const rookResultA = pieceCanReachSquare(0, "R", "c1", "g1", emptyBoard);
      const rookResultB = pieceCanReachSquare(1, "R", "h8", "h3", emptyBoard);

      expect(rookResultA).toBeTruthy();
      expect(rookResultB).toBeTruthy();

      // Queen moves
      const queenResultA = pieceCanReachSquare(0, "Q", "c1", "g1", emptyBoard);
      const queenResultB = pieceCanReachSquare(1, "Q", "h2", "b8", emptyBoard);

      expect(queenResultA).toBeTruthy();
      expect(queenResultB).toBeTruthy();

      // King moves
      const kingResultA = pieceCanReachSquare(0, "K", "e1", "f2", emptyBoard);
      const kingResultB = pieceCanReachSquare(1, "K", "c6", "c5", emptyBoard);

      expect(kingResultA).toBeTruthy();
      expect(kingResultB).toBeTruthy();

      // Pawn moves
      const pawnResultA = pieceCanReachSquare(0, "b", "b2", "b4", emptyBoard);
      const pawnResultB = pieceCanReachSquare(1, "b", "b7", "b5", emptyBoard);
      const pawnResultC = pieceCanReachSquare(0, "h", "g6", "g7", emptyBoard);
      const pawnResultD = pieceCanReachSquare(1, "c", "h6", "h5", emptyBoard);

      expect(pawnResultA).toBeTruthy();
      expect(pawnResultB).toBeTruthy();
      expect(pawnResultC).toBeTruthy();
      expect(pawnResultD).toBeTruthy();
    });
  });
});
