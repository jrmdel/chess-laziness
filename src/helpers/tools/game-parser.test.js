const { splitGames } = require("src/helpers/tools/game-parser");
const {
  simpleGameInput,
  simpleGameOutput,
  multipleLineGameInput,
  multipleLineGameOutput,
  multipleOneLinersGamesInput,
  multipleOneLinersGamesOutput,
  multipleLinesAndGamesInput,
  multipleLinesAndGamesOutput,
} = require("test/fixtures/game-parser/game-parser.fixture");

describe("game parser", () => {
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
});
