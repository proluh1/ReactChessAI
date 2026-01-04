import type { Color, PosibleMoves } from "./Piece";
import Piece, { MoveType, TypePiece, type Coordinate } from "./Piece";
import Board from "./Board";
import type Box from "./Box";

export default class Knight extends Piece {
  constructor(color: Color, box: Box) {
    super(TypePiece.KNIGHT, color, box);
  }

  isLegalMove(newC: Coordinate): { type: MoveType; target?: Piece } | null {
    const box = this.box;
    if (box === null) return null;

    const { x, y } = box.coordinate;
    const dx = Math.abs(newC.x - x);
    const dy = Math.abs(newC.y - y);

    if (!((dx === 2 && dy === 1) || (dx === 1 && dy === 2))) {
      return null;
    }

    const targetBox = box.getNeightborByCoord(newC);
    if(targetBox === null) return null;
    const target = targetBox.piece;

    if (target) {
      if (target.color === this.color) {
        return null;
      }
      return { target, type: MoveType.CAPTURE };
    }

    return { type: MoveType.NORMAL };
  }

  posibleMove(piece: Piece, board: Board): PosibleMoves | null {
    return null;
  }
}
