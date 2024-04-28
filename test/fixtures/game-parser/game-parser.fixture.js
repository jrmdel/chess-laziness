const simpleGameInput = `[Event "FIDE Grand Swiss 2023"]
[White "Adhiban, B."]
[Black "Iturrizaga Bonelli, Eduardo"]
[Result "1-0"]
[WhiteElo "2551"]
[BlackElo "2615"]
[Variant "Standard"]
[ECO "B42"]
[Opening "Sicilian Defense: Kan Variation, Polugaevsky Variation"]

1. e4 { [%eval 0.36] [%clk 1:40:53] } 1... c5 { [%eval 0.32] [%clk 1:40:55] } 2. Nf3 { [%eval 0.0] [%clk 1:41:17] } 2... e6 { [%eval 0.0] [%clk 1:41:19] } 1-0


`;

const simpleGameOutput = [
  {
    metadata: `[Event "FIDE Grand Swiss 2023"] [White "Adhiban, B."] [Black "Iturrizaga Bonelli, Eduardo"] [Result "1-0"] [WhiteElo "2551"] [BlackElo "2615"] [Variant "Standard"] [ECO "B42"] [Opening "Sicilian Defense: Kan Variation, Polugaevsky Variation"]`,
    moves: `1. e4 { [%eval 0.36] [%clk 1:40:53] } 1... c5 { [%eval 0.32] [%clk 1:40:55] } 2. Nf3 { [%eval 0.0] [%clk 1:41:17] } 2... e6 { [%eval 0.0] [%clk 1:41:19] } 1-0`,
  },
];

const simpleGameCleanOutput = [
  {
    metadata: {
      black: {
        elo: 2615,
        name: "Iturrizaga Bonelli, Eduardo",
      },
      date: "",
      eco: "B42",
      event: "FIDE Grand Swiss 2023",
      opening: "Sicilian Defense: Kan Variation, Polugaevsky Variation",
      result: "1-0",
      white: {
        elo: 2551,
        name: "Adhiban, B.",
      },
    },
    moves: [
      ["e4", "c5"],
      ["Nf3", "e6"],
    ],
  },
];

const multipleLineGameInput = `[Event "FIDE Grand Swiss 2023"]
[White "Adhiban, B."]
[Black "Iturrizaga Bonelli, Eduardo"]
[Result "1-0"]
[WhiteElo "2551"]
[BlackElo "2615"]
[Variant "Standard"]
[ECO "B42"]
[Opening "Sicilian Defense: Kan Variation, Polugaevsky Variation"]

1. e4 { [%eval 0.36] [%clk 1:40:53] } 1... c5 { [%eval 0.32] [%clk 1:40:55] } 2. Nf3 { [%eval 0.0] 
[%clk 1:41:17] } 2... e6 { [%eval 0.0] [%clk 1:41:19] } 3. d4 { [%eval 0.42] [%clk 1:41:41] } 3... cxd4 
{ [%eval 0.26] [%clk 1:41:41] } 4. Nxd4 { [%eval 0.4] [%clk 1:42:09] } 4... a6 { [%eval 0.58] 
[%clk 1:42:06] } 1-0


`;

const multipleLineGameOutput = [
  {
    metadata: `[Event "FIDE Grand Swiss 2023"] [White "Adhiban, B."] [Black "Iturrizaga Bonelli, Eduardo"] [Result "1-0"] [WhiteElo "2551"] [BlackElo "2615"] [Variant "Standard"] [ECO "B42"] [Opening "Sicilian Defense: Kan Variation, Polugaevsky Variation"]`,
    moves: `1. e4 { [%eval 0.36] [%clk 1:40:53] } 1... c5 { [%eval 0.32] [%clk 1:40:55] } 2. Nf3 { [%eval 0.0]  [%clk 1:41:17] } 2... e6 { [%eval 0.0] [%clk 1:41:19] } 3. d4 { [%eval 0.42] [%clk 1:41:41] } 3... cxd4  { [%eval 0.26] [%clk 1:41:41] } 4. Nxd4 { [%eval 0.4] [%clk 1:42:09] } 4... a6 { [%eval 0.58]  [%clk 1:42:06] } 1-0`,
  },
];

const multipleOneLinersGamesInput = `[Event "WRBC 2022. Rapid Open"]
[Site "Almaty, Kazakhstan"]
[Date "2022.12.28"]
[Round "13.1"]

1. e4 { [%eval 0.32] [%clk 0:15:19] } 1... c5 { [%eval 0.0] [%clk 0:15:03] } 2. Nf3 1-0


[Event "WRBC 2022. Rapid Open"]
[Site "Almaty, Kazakhstan"]
[Date "2022.12.28"]
[Round "13.2"]

1. e4 { [%eval 0.32] [%clk 0:15:18] } 1... e5 { [%eval 0.29] [%clk 0:15:18] } 2. Nf3 { [%eval 0.39] [%clk 0:15:26] } 2... Nc6 1-0


[Event "WRBC 2022. Rapid Open"]
[Site "Almaty, Kazakhstan"]
[Date "2022.12.28"]
[Round "13.3"]

1. e4 { [%eval 0.32] [%clk 0:15:19] } 1... e5 { [%eval 0.29] [%clk 0:15:19] } 2. Nf3 { [%eval 0.39] [%clk 0:15:27] } 2... Nc6 { [%eval 0.2] [%clk 0:15:28] } 3. Bb5 1/2-1/2

`;

const multipleOneLinersGamesOutput = [
  {
    metadata: `[Event "WRBC 2022. Rapid Open"] [Site "Almaty, Kazakhstan"] [Date "2022.12.28"] [Round "13.1"]`,
    moves: `1. e4 { [%eval 0.32] [%clk 0:15:19] } 1... c5 { [%eval 0.0] [%clk 0:15:03] } 2. Nf3 1-0`,
  },
  {
    metadata: `[Event "WRBC 2022. Rapid Open"] [Site "Almaty, Kazakhstan"] [Date "2022.12.28"] [Round "13.2"]`,
    moves: `1. e4 { [%eval 0.32] [%clk 0:15:18] } 1... e5 { [%eval 0.29] [%clk 0:15:18] } 2. Nf3 { [%eval 0.39] [%clk 0:15:26] } 2... Nc6 1-0`,
  },
  {
    metadata: `[Event "WRBC 2022. Rapid Open"] [Site "Almaty, Kazakhstan"] [Date "2022.12.28"] [Round "13.3"]`,
    moves: `1. e4 { [%eval 0.32] [%clk 0:15:19] } 1... e5 { [%eval 0.29] [%clk 0:15:19] } 2. Nf3 { [%eval 0.39] [%clk 0:15:27] } 2... Nc6 { [%eval 0.2] [%clk 0:15:28] } 3. Bb5 1/2-1/2`,
  },
];

const multipleLinesAndGamesInput = `[Event "Grand Suisse FIDE 2023"]
[Date "2023.10.30"]
[White "Adhiban, B."]
[Black "Iturrizaga Bonelli, Eduardo"]
[Result "1-0"]

1. e4 {[%clk 1:40:53]} 1... c5 {[%clk 1:40:55]} 2. Nf3 {[%clk 1:41:17]} 2... e6
{[%clk 1:41:19]} 3. d4 {[%clk 1:41:41]} 3... cxd4 {[%clk 1:41:41]} 4. Nxd4
{[%clk 1:42:09]} 4... a6 {[%clk 1:42:06]} 5. Bd3 {[%clk 1:42:23]} 5... Bc5


[Event "New Orleans"]
[Site "New Orleans, LA USA"]
[Date "1848.??.??"]
[Result "1-0"]
[White "Paul Morphy"]
[Black "NN"]

1.e4 e5 2.h3 d5 3.exd5 Bc5 4.Bc4 c6 5.Nc3 Nf6 6.d3 a5 7.Bg5
Nbd7 8.dxc6 bxc6 9.Nf3 O-O 10.O-O h6 11.Bh4 Qc7 12.d4 exd4
13.Nxd4 Bd6 14.Nf5 Bh2+ 15.Kh1 Ne5 16.Bb3 Ba6 17.Re1 Ng6
18.Bxf6 gxf6 19.Qh5 1-0


`;

const multipleLinesAndGamesOutput = [
  {
    metadata: `[Event "Grand Suisse FIDE 2023"] [Date "2023.10.30"] [White "Adhiban, B."] [Black "Iturrizaga Bonelli, Eduardo"] [Result "1-0"]`,
    moves: `1. e4 {[%clk 1:40:53]} 1... c5 {[%clk 1:40:55]} 2. Nf3 {[%clk 1:41:17]} 2... e6 {[%clk 1:41:19]} 3. d4 {[%clk 1:41:41]} 3... cxd4 {[%clk 1:41:41]} 4. Nxd4 {[%clk 1:42:09]} 4... a6 {[%clk 1:42:06]} 5. Bd3 {[%clk 1:42:23]} 5... Bc5`,
  },
  {
    metadata: `[Event "New Orleans"] [Site "New Orleans, LA USA"] [Date "1848.??.??"] [Result "1-0"] [White "Paul Morphy"] [Black "NN"]`,
    moves: `1.e4 e5 2.h3 d5 3.exd5 Bc5 4.Bc4 c6 5.Nc3 Nf6 6.d3 a5 7.Bg5 Nbd7 8.dxc6 bxc6 9.Nf3 O-O 10.O-O h6 11.Bh4 Qc7 12.d4 exd4 13.Nxd4 Bd6 14.Nf5 Bh2+ 15.Kh1 Ne5 16.Bb3 Ba6 17.Re1 Ng6 18.Bxf6 gxf6 19.Qh5 1-0`,
  },
];

module.exports = {
  simpleGameInput,
  simpleGameOutput,
  simpleGameCleanOutput,
  multipleLineGameInput,
  multipleLineGameOutput,
  multipleOneLinersGamesInput,
  multipleOneLinersGamesOutput,
  multipleLinesAndGamesInput,
  multipleLinesAndGamesOutput,
};
