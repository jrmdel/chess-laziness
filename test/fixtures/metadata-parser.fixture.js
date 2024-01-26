const pgnMetadataFixture = `[Event "WRBC 2022. Rapid Open"]
[Site "Almaty, Kazakhstan"]
[Date "2022.12.26"]
[Round "1.1"]
[White "Ter-Sahakyan, Samvel"]
[Black "Carlsen, Magnus"]
[Result "0-1"]
[WhiteElo "2531"]
[BlackElo "2834"]
[TimeControl "25+10"]
[UTCDate "2022.12.26"]
[UTCTime "09:18:03"]
[Variant "Standard"]
[ECO "C18"]
[Opening "French Defense: Winawer Variation, Advance Variation"]
[Annotator "https://lichess.org/@/loepare"]`;

const metadataObjectFromPgnFixture = {
  white: {
    name: "Ter-Sahakyan, Samvel",
    elo: 2531,
  },
  black: {
    name: "Carlsen, Magnus",
    elo: 2834,
  },
  opening: "French Defense: Winawer Variation, Advance Variation",
  eco: "C18",
  result: "0-1",
  date: "2022.12.26",
  event: "WRBC 2022. Rapid Open",
};

const pgnMetadataWithMissingValues = `[Event "New Orleans"]
[Site "New Orleans, LA USA"]
[Date "1848.??.??"]
[EventDate "?"]
[Round "?"]
[Result "1-0"]
[White "Paul Morphy"]
[Black "NN"]
[ECO "C20"]
[WhiteElo "?"]
[BlackElo "?"]
[PlyCount "37"]`;

const partialMetadataObjectFixture = {
  white: {
    name: "Paul Morphy",
    elo: NaN,
  },
  black: {
    name: "NN",
    elo: NaN,
  },
  opening: "",
  eco: "C20",
  result: "1-0",
  date: "1848.??.??",
  event: "New Orleans",
};

const metadataForSingleLineFixture = {
  white: {
    name: "Adhiban, B.",
    elo: NaN,
  },
  black: {
    name: "Iturrizaga Bonelli, Eduardo",
    elo: NaN,
  },
  opening: "",
  eco: "",
  result: "1-0",
  date: "2023.10.30",
  event: "Grand Suisse FIDE 2023",
};

module.exports = {
  pgnMetadataFixture,
  metadataObjectFromPgnFixture,
  pgnMetadataWithMissingValues,
  partialMetadataObjectFixture,
  metadataForSingleLineFixture,
};
