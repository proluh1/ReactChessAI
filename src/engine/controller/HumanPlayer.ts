import type { Color, Coordinate } from "../../domain/entitites/Piece";
import type { PlayerController } from "./PlayerController";

export default class HumanPlayer implements PlayerController {
  resolveMove!: (move: { from: Coordinate; to: Coordinate }) => void;
  color: Color;
  constructor(color: Color) {
    this.color = color;
  }

  async getMove(): Promise<{ from: Coordinate; to: Coordinate }> {
    return new Promise((resolve) => {
      this.resolveMove = resolve;
    });
  }

  onUserClick(from: Coordinate, to: Coordinate) {
    if (this.resolveMove) {
      this.resolveMove({from, to });
    }
  }
}
