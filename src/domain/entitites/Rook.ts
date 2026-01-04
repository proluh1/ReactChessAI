import { Color, MoveType, type PosibleMoves } from "./Piece";
import Piece, { TypePiece, type Coordinate } from "./Piece";
import Board from "./Board";
import type Box from "../../chess-board/chess-entities/Box";

export default class Rook extends Piece {
  public isFirstMove:boolean;

  constructor(color: Color, box: Box) {
    super(TypePiece.ROOK, color, box);
    this.isFirstMove = true;
  }

  isLegalMove(
    newC: Coordinate
  ): { type: MoveType; target?: Piece } | null {
    const box = this.box;
    if(box === null) return null;
    const { x , y } = box.coordinate;
    const dx = Math.abs(newC.x - x);
    const dy = Math.abs(newC.y - y);


    if(dx === 0 && dy === 0 || dx !== 0 && dy !== 0){
      return null;
    }

    const boxesBettwen  = box.getNeightborsByCoord(newC);
    if(boxesBettwen === null) return null;

    const target = boxesBettwen.pop()?.piece;
    const isPieceBettwen = boxesBettwen.find((box)=>{
      return box.piece !== null;
    })

    if(isPieceBettwen !== undefined) {
      return null;
    }

    if(target) {
      if(target.color === this.color) return null;
      return { type:MoveType.CAPTURE, target}
    }

    return { type:MoveType.NORMAL };
  }

  posibleMove(piece: Piece, board: Board): PosibleMoves | null {
    return null;
  }
}
