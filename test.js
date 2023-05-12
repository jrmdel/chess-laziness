const Util = require("./helpers/utils");
const Board = require("./classes/Board");

// console.log(Util.pieceCanReachSquare(0, "N", "b8", "d7")) // expect true
// console.log(Util.pieceCanReachSquare(1, "N", "b8", "d7")) // expect true
// console.log(Util.pieceCanReachSquare(0, "e", "e4", "f5")) // expect true
// console.log(Util.pieceCanReachSquare(1, "e", "e4", "f5")) // expect false
// console.log(Util.pieceCanReachSquare(1, "e", "e2", "e4")) // expect false
// console.log(Util.pieceCanReachSquare(0, "e", "e2", "e4")) // expect true
// console.log(Util.pieceCanReachSquare(0, "Q", "e2", "e4")) // expect true
// console.log(Util.pieceCanReachSquare(0, "Q", "e2", "f4")) // expect false
// console.log(Util.pieceCanReachSquare(0, "Q", "e2", "g4")) // expect true
// console.log(Util.pieceCanReachSquare(0, "Q", "g1", "a7")) // expect true
// console.log(Util.pieceCanReachSquare(0, "K", "g1", "h2")) // expect true
// console.log(Util.pieceCanReachSquare(0, "K", "g1", "g3")) // expect false



const b = new Board();
// console.log(b.getCurrentPosition());
console.time("inputMoves")
// Testing diagonal pin
// b.setMove("d4");
// b.setMove("e6");
// b.setMove("Nc3");
// b.setMove("Bb4");
// b.setMove("e3");
// b.setMove("Nf6");
// b.setMove("Ne2");
// b.setMove("d5");
// b.setMove("Bd2");
// b.setMove("Nbd7");
// b.setMove("Ng3");

// Testing vertical pin
b.setMove("e4");
b.setMove("d5");
b.setMove("exd5");
b.setMove("e6");
b.setMove("dxe6");
b.setMove("Qe7");
b.setMove("Ne2");
b.setMove("Qxe6");
b.setMove("Nc3");

// Testing promotion
// b.setMove("b4")
// b.setMove("Nf6")
// b.setMove("b5")
// b.setMove("a6")
// b.setMove("b6")
// b.setMove("Ra7")
// b.setMove("bxa7")
// b.setMove("e6")
// b.setMove("a8=Q")
// b.setMove("b6")
// b.setMove("Qc6")
// b.setMove("Qe7")
// b.setMove("c3")
// b.setMove("Ne4")
// b.setMove("Qda4")
// b.setMove("Nxf2")
// b.setMove("Qac4")
// b.setMove("Nxh1")
// b.setMove("Q4c5")

// Testing doubled pawns
// b.setMove("Nc3")
// b.setMove("e6")
// b.setMove("g3")
// b.setMove("Bb4")
// b.setMove("Bg2")
// b.setMove("Bxc3")
// b.setMove("dxc3")
// b.setMove("Nc6")
// b.setMove("Nf3")
// b.setMove("Nb4")
// b.setMove("c4")
console.timeEnd("inputMoves")
console.log(JSON.stringify(b.getPieces(), null, 2))
