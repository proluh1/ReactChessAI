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
  public lastMoveAnimation!: MoveAnimation[];

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

    return this.executeMove(piece, to);
  }

  public makeMoveById(
    pieceId: string,
    to: Coordinate
  ): { success: boolean; lastMoveType: MoveType | null } {
    const pieces = this.board.pieces;
    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece || !this.isCurrentTurn(piece.color))
      return { success: false, lastMoveType: null };

    return this.executeMove(piece, to);
  }

  private executeMove(
    piece: Piece,
    to: Coordinate
  ): { success: boolean; lastMoveType: MoveType | null } {
    const moveResult = piece.isLegalMove(to);
    if (moveResult === null) return { success: false, lastMoveType: null };

    const box = piece.box;
    if (box === null) return { success: false, lastMoveType: null };

    let secondaryMoveData: SecondaryMove | undefined;
    if (moveResult.type === MoveType.CASTLING && moveResult.target) {
      const rook = moveResult.target;
      secondaryMoveData = {
        from: rook.box!.coordinate,
        to: this.calculateRookDestination(box.coordinate, to),
        piece: rook,
      };
    }

    const move: MoveHistory = {
      piece,
      target: moveResult.target,
      from: box?.coordinate,
      to,
      moveType: moveResult.type,
      capturedPiece: moveResult.target,
      moveNumber: this.getFullMovesCounter(),
      player: this.getCurrentTurn(),
      timestamp: Date.now(),
      notation: parseNotation(box?.coordinate, to, moveResult.type),
      secondaryMove: secondaryMoveData,
    };
    this.addMove(move);
    const moveAnimation: MoveAnimation = {
      id: piece.id,
      from: box?.coordinate,
      to,
    }

    this.lastMoveAnimation = [moveAnimation];


    this.do(moveResult.type, { piece, to, target: moveResult.target });

    const board = this.board;
    if (moveResult.type !== MoveType.DOUBLE_STEP) {
      if (board.passedPawn) {
        board.passedPawn = null;
      }
    }

    // Resetear halfMoveClock por captura o movimiento de peón
    if (moveResult.type === MoveType.CAPTURE || piece instanceof Pawn) {
      this.resetHalfMove();
    } else {
       this.addHalfMove();
    }

    const pieces = this.board.pieces;
    pieces
      .filter((p): p is Pawn => p instanceof Pawn && p.color !== piece.color)
      .forEach((p) => {
        p.justDoubleMoved = false;
      });

    this.toogleTurn();
    this.addFullMove();

    return { success: true, lastMoveType: moveResult.type };
  }

  private calculateRookDestination(kingFrom: Coordinate, kingTo: Coordinate): Coordinate {
    if (kingTo.x > kingFrom.x) {
      return { x: 5, y: kingFrom.y };
    }
    return { x: 3, y: kingFrom.y };
  }

  public undoMove(): { success: boolean } {
    const lastMove = this.movesHistory.pop();
    if (lastMove === undefined) return { success: false };

    const { piece, from, to, moveType, capturedPiece, secondaryMove } = lastMove;

    const moveAnimation: MoveAnimation = { id: piece.id,  from: to, to: from };
    if(this.lastMoveAnimation.length === 3) {
      this.lastMoveAnimation.shift();
    }
    this.lastMoveAnimation.push(moveAnimation);

    this.undo(moveType, { piece, from, target: capturedPiece, secondaryMove });

    const pieces = this.board.pieces;
    pieces
      .filter((p): p is Pawn => p instanceof Pawn && p.color !== piece.color)
      .forEach((p) => {
        p.justDoubleMoved = false;
      });

    if (piece instanceof Pawn && moveType === MoveType.DOUBLE_STEP) {
      piece.justDoubleMoved = false;
    }


    if (capturedPiece) {
      this.capturePieces = this.capturePieces.filter(p => p !== capturedPiece);
    }

    this.toogleTurn();
    if (lastMove.player === "white") {
      this.board.fullMoveCounter--;
    }
    this.board.halfMoveClock--;

    return { success: true };
  }

  private undo(type: MoveType, content: { piece: Piece; from: Coordinate; target?: Piece; secondaryMove?: SecondaryMove }) {
    this.undoActionList[type](content);
  }

  private undoActionList = {
    [MoveType.NORMAL]: this.undo_move.bind(this),
    [MoveType.CAPTURE]: this.undo_moveCapture.bind(this),
    [MoveType.DOUBLE_STEP]: this.undo_moveDouble.bind(this),
    [MoveType.EN_PASSANT]: this.undo_moveEnPassant.bind(this),
    [MoveType.PROMOTION]: this.undo_movePromotion.bind(this),
    [MoveType.CASTLING]: this.undo_moveCastling.bind(this),
  }

  private undo_move({ piece, from }: { piece: Piece; from: Coordinate }) {
    if (piece.box === null) return;
    piece.box.setPiece(null);
    const targetBox = this.board.boxes[from.y][from.x];
    targetBox.setPiece(piece);
    piece.box = targetBox;
    if (piece instanceof Pawn) {
      piece.isDoubleMoveAvailable = true;
    }
  }

  private undo_moveDouble({ piece, from }: { piece: Piece; from: Coordinate }) {
    if (piece.box === null) return;
    piece.box.setPiece(null);
    const targetBox = this.board.boxes[from.y][from.x];
    targetBox.setPiece(piece);
    piece.box = targetBox;
    if (piece instanceof Pawn) {
      piece.justDoubleMoved = false;
      piece.isDoubleMoveAvailable = true;
    }
  }

  private undo_moveCapture({ piece, from, target }: { piece: Piece; from: Coordinate; target?: Piece }) {
    if (piece.box === null || !target) return;
    const box = piece.box;
    piece.move(from, this.board);
    box.piece = target;
    target.box = box;
  }

  private undo_moveEnPassant({ piece, from, target }: { piece: Piece; from: Coordinate; target?: Piece }) {
    if (piece.box === null || !target) return;
    const box = piece.box;
    piece.move(from, this.board);
    box.piece = target;
    target.box = box;
    this.board.halfMoveClock = 0;
  }

  private undo_movePromotion({ piece, from }: { piece: Piece; from: Coordinate }) {
    if (piece.box === null) return;
    piece.box.setPiece(null);
    const targetBox = this.board.boxes[from.y][from.x];
    targetBox.setPiece(piece);
    piece.box = targetBox;
    this.board.halfMoveClock = 0;
  }

  private undo_moveCastling({ piece, from, secondaryMove }: { piece: Piece; from: Coordinate; secondaryMove?: SecondaryMove }) {
    if (piece.box === null || !secondaryMove) return;

    piece.box.setPiece(null);
    const kingTargetBox = this.board.boxes[from.y][from.x];
    kingTargetBox.setPiece(piece);
    piece.box = kingTargetBox;

    const rook = secondaryMove.piece;
    if (rook.box === null) return;
    rook.box.setPiece(null);
    const rookTargetBox = this.board.boxes[secondaryMove.from.y][secondaryMove.from.x];
    rookTargetBox.setPiece(rook);
    rook.box = rookTargetBox;

    if (piece instanceof King) {
      piece.castle.kingSide = true;
      piece.castle.queenSide = true;
    }
  }

  private do(type: MoveType, content: { piece: Piece; to: Coordinate, target?: Piece }) {
    this.actionList[type](content);
  }

  private actionList = {
    [MoveType.NORMAL]: this.do_move.bind(this),
    [MoveType.CAPTURE]: this.do_moveCapture.bind(this),
    [MoveType.DOUBLE_STEP]: this.do_moveDouble.bind(this),
    [MoveType.EN_PASSANT]: this.do_moveEnPassant.bind(this),
    [MoveType.PROMOTION]: this.do_movePromotion.bind(this),
    [MoveType.CASTLING]: this.do_moveCastling.bind(this),
  }

  private do_move({ piece, to }: { piece: Piece; to: Coordinate }) {
    if (piece instanceof Pawn) {
      piece.isDoubleMoveAvailable = false;
    }
    piece.move(to, this.board);
  }

  private do_moveDouble({ piece, to }: { piece: Piece; to: Coordinate }) {
    if (piece instanceof Pawn) {
      piece.justDoubleMoved = true
    }
    piece.move(to, this.board);
  }

  private do_moveCapture({ piece, to, target }: { piece: Piece; to: Coordinate; target?: Piece }) {
    if (target) {
      if (piece instanceof Pawn) {
        piece.isDoubleMoveAvailable = false;
      }
      piece.move(to, this.board);
      this.capturePieces.push(target);
    }
  }

  private do_moveEnPassant({ piece, to, target }: { piece: Piece; to: Coordinate; target?: Piece }) {
    if (piece instanceof Pawn && target) {
      piece.moveInPassant(to, this.board, target);
      this.capturePieces.push(target);
    }
  }

  private do_movePromotion({ piece, to, target }: { piece: Piece; to: Coordinate; target?: Piece }) {
    if (piece instanceof Pawn) {
      piece.move(to, this.board);
    }
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

  public isCurrentTurn(currentTurn: Color): boolean {
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
    newGame.lastMoveAnimation = this.lastMoveAnimation;
    newGame.currentPLayer = this.currentPLayer;
    return newGame;
  }
}

export type MoveHistory = {
  from: Coordinate;
  to: Coordinate;
  piece: Piece;
  target?: Piece;

  capturedPiece?: Piece;
  moveType: MoveType;

  secondaryMove?: SecondaryMove;

  moveNumber: number;
  player: "white" | "black";
  timestamp: number;
  notation: string;
}

type SecondaryMove = {
  from: Coordinate;
  to: Coordinate;
  piece: Piece;
};

export type MoveAnimation = {
  id: string | number,
  from: Coordinate,
  to: Coordinate
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
  SHOW_BEST_MOVE
}
export enum GameState {
  IDLE,
  PLAYING,
  PAUSED,
  GAME_OVER
};
