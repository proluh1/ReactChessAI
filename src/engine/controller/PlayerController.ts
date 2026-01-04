import type Board from "../../domain/entitites/Board";
import type { Color, Coordinate } from "../../domain/entitites/Piece";

export interface PlayerController {
  getMove(board: Board, depth?:number): Promise<{ from: Coordinate, to: Coordinate } >;
  color: Color;
}
