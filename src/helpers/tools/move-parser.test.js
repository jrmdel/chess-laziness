const {
  movesFoundInPgnFilesFixture,
  movesAfterRemovingSuperfluousContentFixture,
  parsedMovesFromPgnFixture,
} = require("test/fixtures/move-parser.fixtures");
const {
  removeCurly,
  removeDots,
  removeNotation,
  removeDuplicateSpaces,
  removeTermination,
  splitMoves,
  removeNestedParentheses,
  cleanAndParseMoves,
  removeEverything,
} = require("src/helpers");

describe("pgn parser", () => {
  describe("removeCurly", () => {
    it("should remove everything inside curly braces", () => {
      const result = removeCurly(
        "1. e4 { [%eval 0.0] [%clk 0:15:17] } 1... e6 { [%eval 0.3] [%clk 0:15:18] } 2. d4"
      );

      expect(result).toEqual("1. e4 1... e6 2. d4");
    });

    it("should remove curly braces only when there is a space before", () => {
      const result = removeCurly("{ [%eval 0.0] } { to be deleted }");

      expect(result).toEqual("{ [%eval 0.0] }");
    });
  });

  describe("removeDots", () => {
    it("should remove numbers followed by 3 dots", () => {
      const result = removeDots("1. e4 1... e6 2. d4 2... d5");

      expect(result).toEqual("1. e4 e6 2. d4 d5");
    });

    it("should remove numbers followed by 3 dots or more but not those with less dots", () => {
      const resultA = removeDots("1. 1.. 2...");
      const resultB = removeDots("1. 1.. 2... 2.... 3.....");
      const resultC = removeDots("1. 1... 23. 23... 145. 145...");

      expect(resultA).toEqual("1. 1..");
      expect(resultB).toEqual("1. 1..");
      expect(resultC).toEqual("1. 23. 145.");
    });

    it("should return the input if it doesnt contain any number with 3 dots", () => {
      const result = removeDots("abcdef");

      expect(result).toEqual("abcdef");
    });
  });

  describe("removeNotation", () => {
    it("should remove all chess related symbols in strings", () => {
      const result = removeNotation("1. e4!! 7. O-O-O?! 34. g4#");

      expect(result).toEqual("1. e4 7. O-O-O 34. g4");
    });

    it("should keep promotion symbol but remove checks", () => {
      const result = removeNotation("27. e8=Q+ Kh7?? 28. axb8=N *");

      expect(result).toEqual("27. e8=Q Kh7 28. axb8=N *");
    });
  });

  describe("removeDuplicateSpaces", () => {
    it("should ", () => {
      const result = removeDuplicateSpaces("1. e4  7. O-O      34. g4");

      expect(result).toEqual("1. e4 7. O-O 34. g4");
    });
  });

  describe("removeTermination", () => {
    it("should remove all possible terminations", () => {
      const resultA = removeTermination("1. e4 1/2-1/2");
      const resultB = removeTermination("1. e4 e5 0-1");
      const resultC = removeTermination("1. e4 1-0");
      const resultD = removeTermination("1. e4 Cf6 *");

      expect(resultA).toEqual("1. e4");
      expect(resultB).toEqual("1. e4 e5");
      expect(resultC).toEqual("1. e4");
      expect(resultD).toEqual("1. e4 Cf6");
    });
  });

  describe("removeNestedParentheses", () => {
    it("should remove everything inside parentheses", () => {
      const input = "me (and you (and you) or him (or her (and her))) and the world";
      const output = "me  and the world";

      const result = removeNestedParentheses(input);

      expect(result).toEqual(output);
    });

    it("should work even when there are more open parentheses", () => {
      const input = "oh ((() this will disappear)(((())";
      const output = "oh ";

      const result = removeNestedParentheses(input);

      expect(result).toEqual(output);
    });

    it("should not work well when there are more closing parentheses", () => {
      const input = "oh ()))) this will disappear ((((()))))";
      const output = "oh )()";

      const result = removeNestedParentheses(input);

      expect(result).toEqual(output);
    });
  });

  describe("splitMoves", () => {
    it("should convert a string of moves to a list containing the two plies", () => {
      const moves = "1. e4 e5 2. Cf3 Cf6 3. Bc4";
      const listOfMoves = [["e4", "e5"], ["Cf3", "Cf6"], ["Bc4"]];

      const result = splitMoves(moves);

      expect(result).toEqual(listOfMoves);
    });

    it("should return a list of list of words if the input string is a sequence of words", () => {
      const result = splitMoves("Once upon a time");
      const words = [["Once", "upon", "a", "time"]];

      expect(result).toEqual(words);
    });
  });

  describe("removeEverything", () => {
    it("should execute all the remove functions one after the other", () => {
      const result = removeEverything(movesFoundInPgnFilesFixture);

      expect(result).toEqual(movesAfterRemovingSuperfluousContentFixture);
    });
  });

  describe("cleanAndParseMoves", () => {
    it("should execute every single functions above and return a list of moves", () => {
      const result = cleanAndParseMoves(movesFoundInPgnFilesFixture);

      expect(result).toEqual(parsedMovesFromPgnFixture);
    });
  });
});
