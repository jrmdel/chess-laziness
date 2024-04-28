const { splitGames, getGamesDataFromPgn, readPgnFile } = require("src/helpers/tools/game-parser");
const {
  simpleGameInput,
  simpleGameOutput,
  multipleLineGameInput,
  multipleLineGameOutput,
  multipleOneLinersGamesInput,
  multipleOneLinersGamesOutput,
  multipleLinesAndGamesInput,
  multipleLinesAndGamesOutput,
  simpleGameCleanOutput,
} = require("test/fixtures/game-parser/game-parser.fixture");
const { readFileSync } = require("fs");

jest.mock("fs", () => ({
  readFileSync: jest.fn(),
}));

describe("game parser", () => {
  describe("readPgnFile", () => {
    const error = new Error("Path should be valid");

    it("should call readFileSync with the correct parameters", () => {
      const path = "some-path.pgn";

      readPgnFile(path);

      expect(readFileSync).toHaveBeenCalledWith(path, "utf-8");
    });

    it("should throw if input is empty", () => {
      const call = () => readPgnFile(undefined);

      expect(call).toThrow(error);
    });

    it("should throw if input doesn't have a pgn extension", () => {
      const call = () => readPgnFile("some-path.txt");

      expect(call).toThrow(error);
    });
  });

  describe("splitGames", () => {
    it("should split metadata and moves from a very simple game file", () => {
      const result = splitGames(simpleGameInput);

      expect(result).toEqual(simpleGameOutput);
    });

    it("should split metadata and moves from a unique game file with moves spread across multiple lines", () => {
      const result = splitGames(multipleLineGameInput);

      expect(result).toEqual(multipleLineGameOutput);
    });

    it("should split metadata and moves from multiple games in separate objects", () => {
      const result = splitGames(multipleOneLinersGamesInput);

      expect(result).toEqual(multipleOneLinersGamesOutput);
    });

    it("should split metadata and moves from multiple games with moves on multiple lines", () => {
      const result = splitGames(multipleLinesAndGamesInput);

      expect(result).toEqual(multipleLinesAndGamesOutput);
    });
  });

  describe("getGamesDataFromPgn", () => {
    it("should return an object with metadata and moves", () => {
      const result = getGamesDataFromPgn(simpleGameInput);

      expect(result).toEqual(simpleGameCleanOutput);
    });

    it("should throw an error if the input is empty", () => {
      const error = new Error("No input");

      const call = () => getGamesDataFromPgn();

      expect(call).toThrow(error);
    });
  });
});
