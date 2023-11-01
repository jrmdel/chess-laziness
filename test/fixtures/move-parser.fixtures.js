const movesFoundInPgnFilesFixture =
  "1. e4 { [%eval 0.0] [%clk 0:15:17] } 1... e6 { [%eval 0.3] [%clk 0:15:18] } 21. dxe5?! { [%eval 1.06] } { Inaccuracy. Bxe4 was best. } { [%clk 0:01:55] } (21. Bxe4 Bxg4) 21... Qa5?? { [%eval -0.16] } { Blunder. Bxg4 was best. } { [%clk 0:09:21] } (21... Bxg4 22. Bxg4+ Kb8 23. Bf4 Rxh4 24. e6+ Ka8 25. Rxh4 Rxh4 26. f3 Rh1+ 27. Ke2 Rxa1 28. fxe4) 22. Ra3? { [%eval -0.32] } { Mistake. Kf1 was best. } { [%clk 0:01:11] } (22. Kf1 Ne7) 22... Bf5 42. Rc7+ { [%eval -5.39] [%clk 0:00:23] } 42... Kd8 { [%clk 0:01:57] } 0-1";

const movesAfterRemovingSuperfluousContentFixture =
  "1. e4 e6 21. dxe5 Qa5 22. Ra3 Bf5 42. Rc7 Kd8";

const parsedMovesFromPgnFixture = [
  ["e4", "e6"],
  ["dxe5", "Qa5"],
  ["Ra3", "Bf5"],
  ["Rc7", "Kd8"],
];

module.exports = {
  movesFoundInPgnFilesFixture,
  movesAfterRemovingSuperfluousContentFixture,
  parsedMovesFromPgnFixture,
};
