import type Board from "../domain/entitites/Board";
import type Box from "../domain/entitites/Box";
import type King from "../domain/entitites/King";
import Knight from "../domain/entitites/Knight";
import { Color } from "../domain/entitites/Piece";
import {  indexToCoord } from "../utils/coord";

export default class FnBuilder {
  constructor(private board: Board) {}

  static board(board: Board) {
    return new FnBuilder(board);
  }

  public build() {
    if (this.board) {
      return this.boardToFen(this.board);
    } else {
      throw new Error("Board is mandatory");
    }
  }

  private boardToFen(board: Board): string {
    const boardBoxes = this.parseBosex(board.boxes);
    const turn = board.turn === Color.WHITE ? "w" : "b";
    const castiling = this.parseCastling(board.availableCastles);
    const halfMoveClock = `${board.halfMoveClock}`;
    const fullMoveCounter = board.fullMoveCounter;
    const passedPanw = board.passedPawn
      ? indexToCoord(board.passedPawn.coordinate)
      : "-";
    return `${boardBoxes} ${turn} ${castiling} ${passedPanw} ${halfMoveClock} ${fullMoveCounter}`;
  }

  private parseCastling(kings: King[]): string {
    let fen = "";

    const whiteKing = kings.find((k) => k.color === Color.WHITE);
    const blackKing = kings.find((k) => k.color === Color.BLACK);

    if (whiteKing) {
      if (whiteKing.castle.kingSide) fen += "K";
      if (whiteKing.castle.queenSide) fen += "Q";
    }

    if (blackKing) {
      if (blackKing.castle.kingSide) fen += "k";
      if (blackKing.castle.queenSide) fen += "q";
    }

    return fen === "" ? "-" : fen;
  }
  private parseBosex(boxes: Box[][]) {
    const parse: string[] = [];
    let emptyBox = 0;
    for (let row = 0; row < boxes.length; row++) {
      for (let col = 0; col < boxes[row].length; col++) {
        const piece = boxes[row][col].piece;
        if (piece !== null) {
          if (emptyBox > 0) {
            parse.push(`${emptyBox}`);
            emptyBox = 0;
          }
          let charPiece;
          if (piece instanceof Knight) {
            charPiece = "n";
          } else {
            charPiece = piece.type.slice(0, 1);
          }
          parse.push(
            Color.WHITE === piece.color
              ? charPiece.toUpperCase()
              : charPiece.toLocaleLowerCase()
          );
        } else {
          emptyBox++;
        }
      }
      if (emptyBox > 0) {
        parse.push(`${emptyBox}`);
        emptyBox = 0;
      }
      parse.push("/");
    }
    return parse.slice(0, -1).join("");
  }
}
