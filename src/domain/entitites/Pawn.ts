import type Board from "./Board";
import type { NeighborKey } from "./Box";
import type Box from "./Box";
import { Color, MoveType, type PosibleMoves } from "./Piece";
import Piece, { TypePiece, type Coordinate } from "./Piece";

export default class Pawn extends Piece {
  isDoubleMoveAvailable: boolean;
  justDoubleMoved: boolean;

  constructor(color: Color, box: Box) {
    super(TypePiece.PAWN, color, box);
    this.isDoubleMoveAvailable = true;
    this.justDoubleMoved = false;
  }

  moveInPassant(to: Coordinate, board: Board, target: Piece) {
    this.move(to, board);
    target.box?.setPiece(null);
  }

  isLegalMove(newC: Coordinate): { type: MoveType; target?: Piece } | null {
    if (!this.box) return null;

    const { x, y } = this.box.coordinate;
    const dx = newC.x - x;
    const dy = newC.y - y;

    const dir = this.color === Color.BLACK ? 1 : -1;

    if (dy !== dir && dy !== 2 * dir) return null;

    const forward = dir === 1 ? "down" : "up";

    // ===== CAPTURA =====
    if (Math.abs(dx) === 1 && dy === dir) {
      const side = dx === -1 ? "Left" : "Right";
      let targetBox = this.box.neighbor[`${forward}${side}` as NeighborKey];
      if (targetBox === null) return null;

      let target = targetBox.piece;
      if (target) {
        if (target.color === this.color) return null;
        return { type: MoveType.CAPTURE, target };
      }

      targetBox = this.box.neighbor[side.toLowerCase() as NeighborKey];
      if(targetBox === null) return null;
      
      target = targetBox.piece;
      if (!target || target.color === this.color || !(target instanceof Pawn)) {
        return null;
      }

      const pawn = target as Pawn;

      if (!pawn.justDoubleMoved) {
        return null;
      }

      return { target, type: MoveType.EN_PASSANT };
    }

    if (dx !== 0) return null;

    const oneStep = this.box.neighbor[forward] as Box;
    if (!oneStep || oneStep.piece) return null;

    if (dy === dir) {
      return { type: MoveType.NORMAL };
    }

    if (dy === 2 * dir && this.isDoubleMoveAvailable) {
      const twoStep = oneStep.neighbor[forward] as Box;
      if (!twoStep || twoStep.piece) return null;

      return { type: MoveType.DOUBLE_STEP };
    }

    return null;
  }

  posibleMove(piece: Piece, board: Board): PosibleMoves | null {
    return null;
  }
}

export interface PassedPawn {
  coordinate: Coordinate;
  pawn: Pawn;
}
