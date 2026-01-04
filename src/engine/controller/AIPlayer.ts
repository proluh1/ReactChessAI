import Board from "../../domain/entitites/Board";
import type { Color, Coordinate } from "../../domain/entitites/Piece";
import FnBuilder from "../FnBuilder";
import stockfish from "../../services/stockfishService";
import type { PlayerController } from "./PlayerController";

export default class AIPlayer implements PlayerController {
  public color: Color;
  constructor(color: Color) {
    this.color = color;
  }

  async getMove(
    board: Board,
    depth: number
  ): Promise<{ from: Coordinate; to: Coordinate }> {
    return this.calculateBestMove({ board, depth });
  }

  async calculateBestMove({
    board,
    depth,
  }: {
    board: Board;
    depth: number;
  }): Promise<{ from: Coordinate; to: Coordinate }> {
    const fen = FnBuilder.board(board).build();
    try {
      const response = await stockfish.getRespone(fen, depth);
      if (response === null) throw new Error("Bad request");
      const bestMove = stockfish.getBestMove(response);
      return bestMove;
    } catch (err) {
      throw Error("Fetch error: " +  err);
    }
  }
}
