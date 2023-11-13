function splitGames(input) {
  const rawData = input.split("\n\n");
  const games = [];
  const game = {};

  for (const data of rawData) {
    const cleanString = data?.replace(/\n/g, " ").trim();

    if (cleanString?.startsWith("1")) {
      game["moves"] = cleanString;
      games.push(Object.assign({}, game));
      continue;
    }
    if (cleanString?.startsWith("[")) {
      game["metadata"] = cleanString;
    }
  }

  return games;
}

module.exports = {
  splitGames,
};
