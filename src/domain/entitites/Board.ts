import type King from "./King";
import { type PassedPawn } from "./Pawn";
import { Color } from "./Piece";
import Piece from "./Piece";
import type Box from "./Box";

export default class Board {
   dimension: Dimension;
   availableCastles: King[];
   halfMoveClock: number;
   passedPawn?: PassedPawn | null;
   fullMoveCounter: number;
   turn: Color;
   pieces: Piece[];
   boxes: Box[][];

  constructor(
    boxes: Box[][],
    pieces: Piece[],
    turn: Color,
    availableCastles: King[],
    halfMoveClock: number,
    fullMoveCounter: number,
    passedPawn?: PassedPawn | null
  ) {
    this.boxes = boxes;
    this.pieces = pieces;
    this.dimension = { width: boxes.length, heigth: boxes[0].length };
    this.turn = turn;
    this.availableCastles = availableCastles;
    this.halfMoveClock = halfMoveClock;
    this.fullMoveCounter = fullMoveCounter;
    this.passedPawn = passedPawn;
  }


  public clone(): Board {
    return new Board(
      this.boxes.map((box)=> box),
      this.pieces,
      this.turn,
      this.availableCastles,
      this.halfMoveClock,
      this.fullMoveCounter,
      this.passedPawn
    );
  }
}

export type Dimension = {
  width: number;
  heigth: number;
};
