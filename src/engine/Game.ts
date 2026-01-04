import Board from "../domain/entitites/Board";
import Pawn from "../domain/entitites/Pawn";
import Piece, {
  Color,
  MoveType,
  type Coordinate,
} from "../domain/entitites/Piece";
import { type PlayerController } from "./controller/PlayerController";
import King from "../domain/entitites/King";
export default class Game {
  public board: Board;
  public players: { white: PlayerController; black: PlayerController };
  public movesHistory: MoveHistory[];
  public capturePieces: Piece[];
  public winner!: Color | null;
  public mode: PvMode;

  constructor(
    board: Board,
    whitePlayer: PlayerController,
    blackPlayer: PlayerController,
    mode: PvMode
  ) {
    this.board = board;
    this.players = { white: whitePlayer, black: blackPlayer };
    this.movesHistory = [];
    this.capturePieces = [];
    this.winner = null;
    this.mode = mode;
  }

  public makeMoveByFromTo(
    from: Coordinate,
    to: Coordinate
  ): { success: boolean; lastMoveType: MoveType | null } {
    const pieces = this.board.pieces;
    const piece = pieces.find(
      (p) => p.box?.coordinate.x === from.x && p.box.coordinate.y === from.y
    );
    if (!piece || !this.isCurrentTurn(piece.color))
      return { success: false, lastMoveType: null };

    const moveResult = piece.isLegalMove(to);
    if (moveResult === null) return { success: false, lastMoveType: null };

    const box = piece.box;
    if (box === null) return { success: false, lastMoveType: null };

    const move: MoveHistory = {
      piece,
      from: box?.coordinate,
      to,
      moveType: moveResult.type,
      capturedPiece: moveResult.target,
    };
    this.addMove(move);

    const board = this.board;
    switch (moveResult.type) {
      case MoveType.NORMAL:
        if (piece instanceof Pawn) {
          piece.isDoubleMoveAvailable = false;
          this.addHalfMove();
        } else {
          this.resetHalfMove();
        }
        piece.move(to, board);
        break;

      case MoveType.CAPTURE:
        if (moveResult.target) {
          if (piece instanceof Pawn) {
            piece.isDoubleMoveAvailable = false;
          }
          this.resetHalfMove();
          piece.move(to, board);
          this.capturePieces.push(moveResult.target);
        }
        break;

      case MoveType.DOUBLE_STEP:
        if (piece instanceof Pawn) {
          piece.isDoubleMoveAvailable = false;
          piece.justDoubleMoved = true;
        }
        this.resetHalfMove();
        piece.move(to, board);
        break;

      case MoveType.EN_PASSANT:
        if (piece instanceof Pawn && moveResult.target) {
          piece.moveInPassant(to, board, moveResult.target);
          this.capturePieces.push(moveResult.target);
        }
        this.resetHalfMove();
        break;

      case MoveType.PROMOTION:
        if (piece instanceof Pawn) {
          piece.move(to, board);
        }
        this.resetHalfMove();
        break;

      case MoveType.CASTLING:
        this.addFullMove();
        piece.move(to, board);
        break;
    }

    if (moveResult.type !== MoveType.DOUBLE_STEP) {
      if (board.passedPawn) {
        board.passedPawn = null;
      }
    }

    pieces
      .filter((p) => p instanceof Pawn && p.color !== piece.color)
      .forEach((p: Pawn) => (p.justDoubleMoved = false));

    this.toogleTurn();
    this.addFullMove();

    return { success: true, lastMoveType: moveResult.type };
  }

  public makeMoveById(
    pieceId: string,
    to: Coordinate
  ): { success: boolean; lastMoveType: MoveType | null } {
    const pieces = this.board.pieces;
    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece || !this.isCurrentTurn(piece.color))
      return { success: false, lastMoveType: null };

    const moveResult = piece.isLegalMove(to);
    if (moveResult === null) return { success: false, lastMoveType: null };

    const box = piece.box;
    if (box === null) return { success: false, lastMoveType: null };

    const move: MoveHistory = {
      piece,
      from: box?.coordinate,
      to,
      moveType: moveResult.type,
      capturedPiece: moveResult.target,
    };
    this.addMove(move);

    const board = this.board;
    switch (moveResult.type) {
      case MoveType.NORMAL:
        if (piece instanceof Pawn) {
          piece.isDoubleMoveAvailable = false;
          this.addHalfMove();
        } else {
          this.resetHalfMove();
        }
        piece.move(to, board);
        break;

      case MoveType.CAPTURE:
        if (moveResult.target) {
          if (piece instanceof Pawn) {
            piece.isDoubleMoveAvailable = false;
          }
          this.resetHalfMove();
          piece.move(to, board);
          this.capturePieces.push(moveResult.target);
        }
        break;

      case MoveType.DOUBLE_STEP:
        if (piece instanceof Pawn) {
          piece.isDoubleMoveAvailable = false;
          piece.justDoubleMoved = true;
        }
        this.resetHalfMove();
        piece.move(to, board);
        break;

      case MoveType.EN_PASSANT:
        if (piece instanceof Pawn && moveResult.target) {
          piece.moveInPassant(to, board, moveResult.target);
          this.capturePieces.push(moveResult.target);
        }
        this.resetHalfMove();
        break;

      case MoveType.PROMOTION:
        if (piece instanceof Pawn) {
          piece.move(to, board);
        }
        this.resetHalfMove();
        break;

      case MoveType.CASTLING:
        this.addFullMove();
        if(piece instanceof King) {
              piece.moveCastle(to, board, moveResult.target as Piece);
        }
        break;
    }

    if (moveResult.type !== MoveType.DOUBLE_STEP) {
      if (board.passedPawn) {
        board.passedPawn = null;
      }
    }

    pieces
      .filter((p) => p instanceof Pawn && p.color !== piece.color)
      .forEach((p: Pawn) => (p.justDoubleMoved = false));

    this.toogleTurn();
    this.addFullMove();

    return { success: true, lastMoveType: moveResult.type };
  }

  public addMove(move: MoveHistory) {
    this.movesHistory.push(move);
  }

  public getBoard(): Board {
    return this.board;
  }

  private addHalfMove() {
    this.board.halfMoveClock++;
  }

  private resetHalfMove() {
    this.board.halfMoveClock = 0;
  }

  private addFullMove() {
    if (this.isCurrentTurn(Color.BLACK)) {
      this.board.fullMoveCounter++;
    }
  }

  async playTurn() {
    const currentPlayer = this.getCurrentPlayer();
    const move = await currentPlayer.getMove(this.board);
    this.makeMoveByFromTo(move.from, move.to);
  }

  public isGameOver() {
    return this.winner;
  }

  private isCurrentTurn(currentTurn: Color): boolean {
    return this.board.turn === currentTurn;
  }

  private toogleTurn() {
    this.board.turn =
      this.board.turn === Color.WHITE ? Color.BLACK : Color.WHITE;
  }

  getCurrentPlayerTurn(): PlayerController {
    return this.board.turn === Color.WHITE
      ? this.players.white
      : this.players.black;
  }

  isKingChecked(color: Color): boolean {
    return false;
  }

  public getWhitePlayer(): PlayerController {
    return this.players.white;
  }
  public getBlackPlayer(): PlayerController {
    return this.players.black;
  }

  clone(): Game {
    const newGame = new Game(
      this.board.clone(),
      this.players.white,
      this.players.black,
      this.mode
    );
    newGame.movesHistory = this.movesHistory;
    newGame.winner = this.winner;
    newGame.capturePieces = this.capturePieces
    return newGame;
  }
}

interface MoveHistory {
  from: Coordinate;
  to: Coordinate;
  piece: Piece;

  capturedPiece?: Piece;
  moveType: MoveType;

  moveNumber: number;
  player: "white" | "black";
  timestamp: Date;
  notation: string;
}

export enum PvMode {
  LOCAL,
  IA,
  ONLINE
}
export enum GameAction {
  START,
  MOVE,
  UNDO_MOVE,
  SET_PLAYERS,
  SET_WINNER,
  PROMOTE_PIECE,
  MOVE_IA,
  SELECT_MODE
}

export type GameState = {
  game: Game | null;
  board: Board;
  lastMoveType: MoveType | null;
  mode: PvMode | null;
};
