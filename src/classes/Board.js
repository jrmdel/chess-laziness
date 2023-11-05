const utils = require("../helpers");

class Board {
  constructor() {
    this.variant = "standard";
    // this.chessboard = this.#initBoard();
    this.turn = 0; // 0 = white to play, 1 = black to play
    this.pieces = {
      black: this.#initPieces(true),
      white: this.#initPieces(false),
    };
  }

  #initBoard() {
    let pieces = ["r", "n", "b", "q", "k", "b", "n", "r"]; // black pieces are lowercase
    let pawns = [...Array(8).keys()].map(() => "p");
    let emptyRank = [...Array(8).keys()].map(() => ".");
    return [
      pieces,
      pawns,
      ...[...Array(4).keys()].map(() => emptyRank),
      pawns.map((s) => s.toUpperCase()),
      pieces.map((s) => s.toUpperCase()),
    ];
  }

  #initPieces(areBlack) {
    if (this.variant == "standard") {
      return [
        { type: "K", position: areBlack ? "e8" : "e1" },
        { type: "Q", position: areBlack ? "d8" : "d1" },
        ...(areBlack ? ["c8", "f8"] : ["c1", "f1"]).map((p) => ({ type: "B", position: p })),
        ...(areBlack ? ["b8", "g8"] : ["b1", "g1"]).map((p) => ({ type: "N", position: p })),
        ...(areBlack ? ["a8", "h8"] : ["a1", "h1"]).map((p) => ({ type: "R", position: p })),
        ...["a", "b", "c", "d", "e", "f", "g", "h"].map((col) => ({
          type: col,
          position: col + (areBlack ? "7" : "2"),
        })),
      ].map(({ type, position }) => this.#initPiece(type, position));
    }
  }

  #initPiece(type, position, ancestor) {
    return {
      type,
      moves: 0,
      distance: 0,
      position,
      isAlive: true,
      startedOn: position,
      history: [position],
      isPromoted: ancestor != null,
      ancestor,
    };
  }

  /*
  getCurrentPosition() {
    return this.chessboard;
  };
  */

  getPieces() {
    return this.pieces;
  }

  #getOwnPieces() {
    return (this.turn == 0 ? this.pieces["white"] : this.pieces["black"]).filter((p) => p.isAlive);
  }

  #getOpponentPieces() {
    return (this.turn == 0 ? this.pieces["black"] : this.pieces["white"]).filter((p) => p.isAlive);
  }

  getOccupiedSquares() {
    return new Set(
      [].concat(this.#getOwnPieces(), this.#getOpponentPieces()).map((p) => p.position)
    );
  }

  getKingPosition() {
    return this.#getOwnPieces().find((p) => p.type == "K")?.position;
  }

  lazyReducer(acc, curr) {
    acc.moves += curr.moves;
    acc.distance += curr.distance;
    acc.perMove = parseFloat((acc.distance / acc.moves).toFixed(3));
    return acc;
  }

  getLazyScore() {
    return {
      white: {
        ...this.pieces.white.reduce(this.lazyReducer, { moves: 0, distance: 0, perMove: 0 }),
      },
      black: {
        ...this.pieces.black.reduce(this.lazyReducer, { moves: 0, distance: 0, perMove: 0 }),
      },
    };
  }

  addPromotedPiece(type, position, ancestor) {
    let color = this.turn == 0 ? "white" : "black";
    this.pieces[color].push(this.#initPiece(type, position, ancestor));
  }

  #changeTurn() {
    this.turn = 1 - this.turn;
  }

  setMove(move) {
    // Deal with special moves
    if (move === "O-O") this.applyShortCastle();
    else if (move === "O-O-O") this.applyLongCastle();
    else if (move.includes("=")) {
      let splitMove = move.split("=");
      let destination = splitMove[0].slice(-2);
      this.applyPromotion(splitMove[0][0], destination, splitMove[0].match(/x/), splitMove[1]);
    }
    // Focus on simple cases
    else {
      let destination = move.slice(-2);
      if (move.length == 2) {
        // It's a pawn move
        this.findPieceAndApply(move[0], destination);
      } else {
        let isCapture = move.includes("x");
        let piece = isCapture ? move.match(/^.*(?=x)/g)[0] : move.slice(0, -2);
        this.findPieceAndApply(piece[0], destination, isCapture, piece.slice(1));
      }
    }
    // Finally, change turn
    this.#changeTurn();
  }

  findPieceAndApply(piece, destination, hasCaptured = false, from = "") {
    // piece = Q, K, N, B, R, a, b, c, d, e, f, g, h
    // destination = g4, e1, a5 ...
    // from = "", "b", "f8"
    console.log(`${piece} (${from})\t-->  ${destination} ${hasCaptured ? "and captured" : ""} `);
    let possiblePieces = this.#getOwnPieces().filter(
      (p) => p.type == piece && p.position.match(from)
    );

    if (possiblePieces.length == 0) {
      throw new Error(`Move ${piece}${from}${hasCaptured ? "x" : ""}${destination} is impossible`);
    }
    // Only one instance of this piece type is found on the board
    else if (possiblePieces.length == 1) {
      return this.applyMove(possiblePieces[0], destination, hasCaptured);
    }

    // From here on, there are multiple candidate pieces
    let occupied = this.getOccupiedSquares();
    let canReachSquare = possiblePieces.filter((p) =>
      utils.pieceCanReachSquare(this.turn, piece, p.position, destination, occupied)
    );
    if (canReachSquare.length == 1) {
      return this.applyMove(canReachSquare[0], destination, hasCaptured);
    } else if (canReachSquare.length == 0) {
      throw new Error(`Move ${piece}${from}${hasCaptured ? "x" : ""}${destination} is impossible`);
    }
    // Multiple pieces can reach the destination square: how to select the right one?
    // First, deal with pawns, because it's easy: choose the closest
    if (piece.toLowerCase() == piece) {
      let candidateMove = canReachSquare.sort(
        (a, b) =>
          utils.computeEffort(a.position, destination) -
          utils.computeEffort(b.position, destination)
      )[0];
      return this.applyMove(candidateMove, destination, hasCaptured);
    } else {
      // It has to be a pin...
      let K = this.getKingPosition();
      // First, check if all the pieces left can be pinned (position, no obstacles between K and piece)
      let notPinned = canReachSquare.filter((p) => {
        let data = utils.computePin(K, p.position);
        let empty = data.cellsThatMustBeEmpty.map((c) => !occupied.has(c)).every((c) => c);
        let possibleCell = data.possibleOpponentPieceCells.find((c) => occupied.has(c));
        let found = this.#getOpponentPieces().find(
          (opp) => opp.position == possibleCell && data.pieceToLookFor.includes(opp.type)
        );
        return !(data.isKingAlignedWithOwnPiece && empty && possibleCell && found != null);
      });
      console.log("IT WAS A PIN !!");
      this.applyMove(notPinned[0], destination, hasCaptured);
    }
  }

  applyShortCastle() {
    let rank = this.turn == 0 ? "1" : "8";
    let K = this.#getOwnPieces().find((p) => p.type == "K");
    let R = this.#getOwnPieces().find((p) => p.position == `h${rank}`);
    this.applyMove(K, `g${rank}`);
    this.applyMove(R, `f${rank}`, false, true);
  }

  applyLongCastle() {
    let rank = this.turn == 0 ? "1" : "8";
    let K = this.#getOwnPieces().find((p) => p.type == "K");
    let R = this.#getOwnPieces().find((p) => p.position == `a${rank}`);
    this.applyMove(K, `c${rank}`);
    this.applyMove(R, `d${rank}`, false, true);
  }

  applyPromotion(pawn, destination, hasCaptured, promotedTo) {
    let currentPawn = this.#getOwnPieces().find(
      (p) => p.position == pawn + (this.turn == 0 ? "7" : "2")
    );
    this.applyMove(currentPawn, destination, hasCaptured);
    // After applying move, a new piece needs to spawn
    currentPawn.isAlive = false;
    this.addPromotedPiece(promotedTo, destination, currentPawn.startedOn);
  }

  applyMove(piece, destination, hasCaptured, cancelMove = false) {
    let currentPosition = piece.position;
    let distance = utils.computeEffort(currentPosition, destination, hasCaptured);
    // Apply updates
    piece.position = destination;
    piece.moves += cancelMove ? 0 : 1;
    piece.distance += distance;
    piece.history.push(destination);
    // In case of a capture, kill the piece from opponents list
    if (hasCaptured) {
      let capturedPiece = this.#getOpponentPieces().find((p) => p.position == destination);
      if (!capturedPiece) {
        // It was en passant
        let adjustedPosition = destination[0] + (this.turn == 0 ? "5" : "4");
        capturedPiece = this.#getOpponentPieces().find((p) => p.position == adjustedPosition);
      }
      // Update opponent's piece
      capturedPiece.isAlive = false;
      // If the capturing piece is a pawn, change its type
      if (piece.type.toLowerCase() == piece.type) {
        piece.type = destination[0];
      }
    }
  }
}

module.exports = Board;
