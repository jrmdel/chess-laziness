const { grepPgnValue, buildMetadata } = require("src/helpers/tools/metadata-parser");
const {
  partialMetadataObjectFixture,
  pgnMetadataWithMissingValues,
  pgnMetadataFixture,
  metadataObjectFromPgnFixture,
} = require("test/fixtures/metadata-parser.fixture");

describe("metadata parser", () => {
  describe("grepPgnValue", () => {
    it("should extract variant value inside double quotes", () => {
      const inputWithStandardVariant = `[UTCTime "09:18:03"]\n[Variant "Standard"]`;
      const inputWithAtomicVariant = `[Variant "Atomic"]\n[ECO "C18"]`;
      const inputWithoutVariant = `[UTCTime "09:18:03"]\n[ECO "C18"]`;

      const resultA = grepPgnValue(inputWithStandardVariant, "variant");
      const resultB = grepPgnValue(inputWithAtomicVariant, "variant", "default");
      const resultC = grepPgnValue(inputWithoutVariant, "variant", "default");

      expect(resultA).toEqual("Standard");
      expect(resultB).toEqual("Atomic");
      expect(resultC).toEqual("default");
    });

    it("should return nothing when there are no quotes and no default value", () => {
      const result = grepPgnValue("[Elo 1900]", "elo");

      expect(result).toEqual("");
    });

    it("should return default value when nothing matches the searched value", () => {
      const result = grepPgnValue("[Elo 1900]", "variant", "oops");

      expect(result).toEqual("oops");
    });
  });

  describe("buildMetadata", () => {
    it("should build a metadata object with all values when the input is correct", () => {
      const result = buildMetadata(pgnMetadataFixture);

      expect(result).toEqual(metadataObjectFromPgnFixture);
    });

    it("should return a partial object when data is missing", () => {
      const result = buildMetadata(pgnMetadataWithMissingValues);

      expect(result).toEqual(partialMetadataObjectFixture);
    });

    it("should return null when the variant is not standard", () => {
      const result = buildMetadata('[Variant "Chess960"]');

      expect(result).toBeNull();
    });
  });
});
