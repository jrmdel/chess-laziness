function grepPgnValue(inputPgn, searchValue, defaultValue = "") {
  const GREP_VALUE_BETWEEN_QUOTES_REGEX = new RegExp(`(?<=${searchValue} ").*?(?=")`, "gi");

  return inputPgn.match(GREP_VALUE_BETWEEN_QUOTES_REGEX)?.[0] || defaultValue;
}

function buildMetadata(inputPgn) {
  const variant = grepPgnValue(inputPgn, "variant", "standard").toUpperCase();
  if (variant !== "STANDARD") {
    return null;
  }

  return {
    white: {
      name: grepPgnValue(inputPgn, "white"),
      elo: parseInt(grepPgnValue(inputPgn, "whiteElo")),
    },
    black: {
      name: grepPgnValue(inputPgn, "black"),
      elo: parseInt(grepPgnValue(inputPgn, "blackElo")),
    },
    opening: grepPgnValue(inputPgn, "opening"),
    eco: grepPgnValue(inputPgn, "eco"),
    result: grepPgnValue(inputPgn, "result"),
    date: grepPgnValue(inputPgn, "date"),
    event: grepPgnValue(inputPgn, "event"),
  };
}

module.exports = {
  grepPgnValue,
  buildMetadata,
};
