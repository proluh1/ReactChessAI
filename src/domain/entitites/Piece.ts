import type Board from "./Board";
import type Box from "./Box";

export default class Piece {
  type: TypePiece;
  color: Color;
  id!: string | number;
  box: Box | null;

  constructor(type: TypePiece, color: Color, box: Box) {
    this.type = type;
    this.color = color;
    this.box = box;
  }

  public setId(id: number | string) {
    this.id = id;
  }

  public move(to: Coordinate, board: Board) {
    if (this.box === null) {
      return;
    }
    const { x, y } = to;
    this.box.setPiece(null);

    const targetBox = board.boxes[y][x];
    targetBox.setPiece(this);
    this.box = targetBox;
  }


  public isLegalMove(
    newC: Coordinate
  ): { type: MoveType; target?: Piece } | null {
    return null;
  }

  posibleMove(piece: Piece, board: Board): PosibleMoves | null {
    return null;
  }
}

export type Coordinate = {
  x: number;
  y: number;
};

export type PosibleMoves = {
  coordinate: Coordinate[];
  capture: boolean;
};

export enum TypePiece {
  BISHOP = "bishop",
  KNIGHT = "knight",
  QUEEN = "queen",
  KING = "king",
  PAWN = "pawn",
  ROOK = "rook",
}

export enum Color {
  WHITE = "white",
  BLACK = "black",
}

export enum MoveType {
  NORMAL = "normal",
  CAPTURE = "capture",
  CASTLING = "castling",
  DOUBLE_STEP = "double",
  EN_PASSANT = "en_passant",
  PROMOTION = "promotion",
}
