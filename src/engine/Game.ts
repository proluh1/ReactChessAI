import Board from "../domain/entitites/Board";
import Pawn from "../domain/entitites/Pawn";
import Piece, {
  Color,
  MoveType,
  type Coordinate,
} from "../domain/entitites/Piece";
import { type PlayerController } from "./controller/PlayerController";
import King from "../domain/entitites/King";
import { parseNotation } from "../utils/coord";
export default class Game {
  public board: Board;
  public players: { white: PlayerController; black: PlayerController };
  public movesHistory: MoveHistory[];
  public capturePieces: Piece[];
  public winner!: Color | null;
  public mode: PvMode;
  public currentPLayer!: PlayerController;

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
      moveNumber: this.getFullMovesCounter(),
      player: this.getCurrentTurn(),
      timestamp: Date.now(),
      notation: parseNotation(box?.coordinate, to, moveResult.type)
    };
    this.addMove(move);

    this.do(moveResult.type, { piece, to, target: moveResult.target });
    
    const board = this.board;
    if (moveResult.type !== MoveType.DOUBLE_STEP) {
      if (board.passedPawn) {
        board.passedPawn = null;
      }
    }

    pieces
      .filter((p): p is Pawn => p instanceof Pawn && p.color !== piece.color)
      .forEach((p) => {
        p.justDoubleMoved = false;
      });

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
      moveNumber: this.getFullMovesCounter(),
      player: this.getCurrentTurn(),
      timestamp: Date.now(),
      notation: parseNotation(box?.coordinate, to, moveResult.type)
    };
    this.addMove(move);

    const board = this.board;
    this.do(moveResult.type, { piece, to, target: moveResult.target });

    if (moveResult.type !== MoveType.DOUBLE_STEP) {
      if (board.passedPawn) {
        board.passedPawn = null;
      }
    }

    pieces
      .filter((p): p is Pawn => p instanceof Pawn && p.color !== piece.color)
      .forEach((p) => {
        p.justDoubleMoved = false;
      });

    this.toogleTurn();
    this.addFullMove();

    return { success: true, lastMoveType: moveResult.type };
  }



  private do(type: MoveType, content: { piece: Piece; to: Coordinate, target?: Piece }) {
    this.actionList[type](content);
  }

  private actionList = {
    [MoveType.NORMAL]: this.do_move.bind(this),
    [MoveType.CAPTURE]: this.do_moveCapture.bind(this),
    [MoveType.DOUBLE_STEP]: this.do_move.bind(this),
    [MoveType.EN_PASSANT]: this.do_moveEnPassant.bind(this),
    [MoveType.PROMOTION]: this.do_movePromotion.bind(this),
    [MoveType.CASTLING]: this.do_moveCastling.bind(this),
  }

  private do_move({ piece, to }: { piece: Piece; to: Coordinate }) {
    if (piece instanceof Pawn) {
      piece.isDoubleMoveAvailable = false;
      this.addHalfMove();
    } else {
      this.resetHalfMove();
    }
    piece.move(to, this.board);
  }

  private do_moveCapture({ piece, to, target }: { piece: Piece; to: Coordinate; target?: Piece }) {
    if (target) {
      if (piece instanceof Pawn) {
        piece.isDoubleMoveAvailable = false;
      }
      this.resetHalfMove();
      piece.move(to, this.board);
      this.capturePieces.push(target);
    }
  }

  private do_moveEnPassant({ piece, to, target }: { piece: Piece; to: Coordinate; target?: Piece }) {
    if (piece instanceof Pawn && target) {
      piece.moveInPassant(to, this.board, target);
      this.capturePieces.push(target);
    }
    this.resetHalfMove();
  }

  private do_movePromotion({ piece, to, target }: { piece: Piece; to: Coordinate; target?: Piece }) {
    if (piece instanceof Pawn) {
      piece.move(to, this.board);
    }
    this.resetHalfMove();
  }

  private do_moveCastling({ piece, to, target }: { piece: Piece; to: Coordinate; target?: Piece }) {
    if (piece instanceof King) {
      piece.moveCastle(to, this.board, target as Piece);
    }
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
    const currentPlayerTurn = this.getCurrentPlayerTurn();
    const move = await currentPlayerTurn.getMove(this.board);
    this.makeMoveByFromTo(move.from, move.to);
  }

  public isGameOver() {
    return this.winner;
  }

  private isCurrentTurn(currentTurn: Color): boolean {
    return this.board.turn === currentTurn;
  }

  private getCurrentTurn() {
    return this.board.turn;
  }

  private toogleTurn() {
    this.board.turn =
      this.board.turn === Color.WHITE ? Color.BLACK : Color.WHITE;
  }

  public getCurrentPlayerTurn(): PlayerController {
    return this.board.turn === Color.WHITE
      ? this.players.white
      : this.players.black;
  }

  public isKingChecked(color: Color): boolean {
    return false;
  }

  public getWhitePlayer(): PlayerController {
    return this.players.white;
  }
  public getBlackPlayer(): PlayerController {
    return this.players.black;
  }

  public getFullMovesCounter(): number {
    return this.board.fullMoveCounter;
  }

  public clone(): Game {
    const newGame = new Game(
      this.board.clone(),
      this.players.white,
      this.players.black,
      this.mode
    );
    newGame.movesHistory = this.movesHistory;
    newGame.winner = this.winner;
    newGame.capturePieces = this.capturePieces;
    return newGame;
  }
}

type MoveHistory = {
  from: Coordinate;
  to: Coordinate;
  piece: Piece;

  capturedPiece?: Piece;
  moveType: MoveType;

  moveNumber: number;
  player: "white" | "black";
  timestamp: number;
  notation: string;
}

export enum PvMode {
  LOCAL,
  IA,
  ONLINE,
}
export enum GameAction {
  START,
  MOVE,
  UNDO_MOVE,
  SET_PLAYERS,
  SET_WINNER,
  PROMOTE_PIECE,
  MOVE_IA,
  SELECT_MODE,
}
export enum GameState {
  IDLE,
  PLAYING,
  PAUSED,
  GAME_OVER
};
