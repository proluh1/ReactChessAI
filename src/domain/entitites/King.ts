import type Board from "./Board";
import type Box from "./Box";
import { MoveType, Color, type PosibleMoves } from "./Piece";
import Piece, { TypePiece, type Coordinate } from "./Piece";
import Rook from "./Rook";

export default class King extends Piece {
  castle: Castle;

  constructor(color: Color, box: Box, castle?: Castle) {
    super(TypePiece.KING, color, box);
    this.castle = castle ?? {
      kingSide: true,
      queenSide: true,
    };
  }

  public moveCastle(to:Coordinate, board:Board, piece:Piece) {
    if (this.box === null || piece.box === null) {
      return;
    }
    const { x, y } = to;
    const side = x > this.box.coordinate.x ? 'left' : 'right';

    this.box.setPiece(null);

    let targetBox = board.boxes[y][x];
    targetBox.setPiece(this);
    this.box = targetBox;

    piece.box.setPiece(null);
    
    targetBox = targetBox.neighbor[side] as Box;
    targetBox.setPiece(piece);
    piece.box =targetBox;
  }

  isLegalMove(newC: Coordinate): { type: MoveType; target?: Piece } | null {
    const box = this.box;
    if (box === null) return null;

    const { x, y } = box.coordinate;
    const dx = Math.abs(newC.x - x);
    const dy = Math.abs(newC.y - y);

    if (dx === 2 && dy === 0) {
      if (!this.castle.kingSide) {
        return null;
      }
      const dir = newC.x > x ? 1 : -1;
      if (
        (dir === -1)
      ) {
        return null;
      }
      const targetBox = box.getNeightborsByCoord(newC);
      if (targetBox === null) return null;
      const somePiece = targetBox.find((box) => box.piece !== null);
      if (somePiece !== undefined) return null;
      const targetPiece = targetBox.pop()?.neighbor[
        dir === 1 ? "right" : "left"
      ]?.piece as Rook | null | undefined;
      if (
        !targetPiece ||
        !(targetPiece instanceof Rook) ||
        !targetPiece.isFirstMove
      ) {
        return null;
      }
      return {
        type: MoveType.CASTLING,
        target: targetPiece,
      };
    }

    if (dx === 3 && dy === 0) {
      if (!this.castle.queenSide) {
        return null;
      }
      const dir = newC.x > x ? 1 : -1;
      if (
        (dir === 1)
      ) {
        return null;
      }
      const targetBox = box.getNeightborsByCoord(newC);
      if (targetBox === null) return null;
      const somePiece = targetBox.find((box) => box.piece !== null);
      if (somePiece !== undefined) return null;
      const targetPiece = targetBox.pop()?.neighbor[
        dir === 1 ? "right" : "left"
      ]?.piece as Rook | null | undefined;
      if (
        !targetPiece ||
        !(targetPiece instanceof Rook) ||
        !targetPiece.isFirstMove
      ) {
        return null;
      }
      return {
        type: MoveType.CASTLING,
        target: targetPiece,
      };
    }

    if (
      (dx === 0 && dy === 0) ||
      (dx !== 0 && dx !== 1) ||
      (dy !== 0 && dy !== 1)
    ) {
      return null;
    }

    const targetBox = box.getNeightborByCoord(newC);
    if (targetBox === null) return null;
    const target = targetBox.piece;

    if (target) {
      if (target.color === this.color) return null;
      return { type: MoveType.CAPTURE, target };
    }

    return { type: MoveType.NORMAL };
  }

  posibleMove(piece: Piece, board: Board): PosibleMoves | null {
    return null;
  }
}

export type Castle = {
  kingSide: boolean;
  queenSide: boolean;
};
