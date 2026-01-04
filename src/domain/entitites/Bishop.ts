import type Board from "./Board";
import type Box from "../../chess-board/chess-entities/Box";
import { Color, type PosibleMoves } from "./Piece";
import Piece, { MoveType, TypePiece, type Coordinate } from "./Piece";

export default class Bishop extends Piece {
  constructor(color: Color, box: Box) {
    super(TypePiece.BISHOP, color, box);
  }

  isLegalMove(newC: Coordinate): { type: MoveType; target?: Piece } | null {
    const box = this.box;
    if (box === null) return null;
    const { x, y } = box.coordinate;
    const dx = Math.abs(newC.x - x);
    const dy = Math.abs(newC.y - y);

    if ((dx === 0 && dy === 0) || dx !== dy) {
      return null;
    }

    const boxesBettwen = box.getNeightborsByCoord(newC);
    if(boxesBettwen === null) return null;
    const target = boxesBettwen.pop()?.piece;

    const isPieceBettwen = boxesBettwen.find((box) => {
      return box.piece !== null;
    });

    if (isPieceBettwen !== undefined) {
      return null;
    }

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
