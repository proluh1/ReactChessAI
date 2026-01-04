import { type Coordinate } from "../domain/entitites/Piece";
import { coordToIndex } from "../utils/coord";

export default class stockfish {
  static async getRespone(
    fen: string,
    depth: number
  ): Promise<ResponseStockFish | null> {
    const res: Response = await fetch(
      `${API_STOCKFISH.GET}?fen=${fen}&depth=${depth}`
    );
    const moves: ResponseStockFish = await res.json();
    if (moves.success) {
      return moves;
    }
    return null;
  }

  static getBestMove({ bestmove } : { bestmove:string }) : { from:Coordinate, to:Coordinate } {
    const fromToMove = bestmove.split(" ")[1];
    const from = coordToIndex(fromToMove.slice(0, 2));
    const to = coordToIndex(fromToMove.slice(2, 4));
    return { from, to };
  }


}

const API_STOCKFISH = {
  GET: "https://stockfish.online/api/s/v2.php",
};

type ResponseStockFish = {
  success: boolean;
  evaluation: number;
  mate: string | null;
  bestmove: string;
  continuation: string;
};
