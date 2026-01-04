import Bishop from "../domain/entitites/Bishop";
import King from "../domain/entitites/King";
import Knight from "../domain/entitites/Knight";
import Pawn, { type PassedPawn } from "../domain/entitites/Pawn";
import Piece, {  type Coordinate } from "../domain/entitites/Piece";
import Queen from "../domain/entitites/Queen";
import Rook from "../domain/entitites/Rook";
import Board from "../domain/entitites/Board";
import { Color } from "../domain/entitites/Piece";
import { coordToIndex } from "../utils/coord";
import Box from "../domain/entitites/Box";

export default class BoardBuilder {
  private constructor(private fen: string) {}

  public static fen(fen: string): BoardBuilder {
    return new BoardBuilder(fen);
  }

  public build(): Board {
    if (this.fen) {
      return this.fenToBoard(this.fen);
    } else {
      throw new Error("Set Fen is mandatory");
    }
  }

  private fenToBoard(fen: string): Board {
    const dataArray: string[] = fen.trim().split(" ");

    const { boxs, pieces }: { boxs: Box[][]; pieces: Piece[] } =
      this.extractBoard(dataArray[0]);
    this.connectNeighbors(boxs);

    const turn: Color = this.extractTurn(dataArray[1]);
    const availableCastles = this.extractCastle(dataArray[2], pieces);
    const passedPawn = this.extractPassedPawn(dataArray[3], pieces);
    const halfMoveClock = this.extractHalfMoveClock(dataArray[4]);
    const fullMoveCounter = this.extractFullMoveCounter(dataArray[5]);

    return new Board(
      boxs,
      pieces,
      turn,
      availableCastles,
      halfMoveClock,
      fullMoveCounter,
      passedPawn
    );
  }

  private connectNeighbors(boxs: Box[][]) {
    const rows = boxs.length;
    const cols = boxs[0].length;

    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
        const box = boxs[y][x];

        box.neighbor = {
          up: y > 0 ? boxs[y - 1][x] : null,
          down: y < rows - 1 ? boxs[y + 1][x] : null,
          left: x > 0 ? boxs[y][x - 1] : null,
          right: x < cols - 1 ? boxs[y][x + 1] : null,
          upLeft: y > 0 && x > 0 ? boxs[y - 1][x - 1] : null,
          upRight: y > 0 && x < cols - 1 ? boxs[y - 1][x + 1] : null,
          downLeft: y < rows - 1 && x > 0 ? boxs[y + 1][x - 1] : null,
          downRight: y < rows - 1 && x < cols - 1 ? boxs[y + 1][x + 1] : null,
        };
      }
    }
  }

  private extractBoard(boardData: string): { boxs: Box[][]; pieces: Piece[] } {
    const rowsData = boardData.split("/");
    const boxs: Box[][] = [];
    const pieces: Piece[] = [];
    let counter = 0;

    rowsData.forEach((rowData, y) => {
      boxs[y] = [];
      let offset = 0;

      rowData.split("").forEach((charData, x) => {
        if (isNaN(Number(charData))) {
          const color: Color =
            charData === charData.toUpperCase() ? Color.WHITE : Color.BLACK;
          const coord: Coordinate = { x: x + offset, y };
          const box = new Box(coord);

          let piece: Piece;
          switch (charData.toUpperCase()) {
            case "R":
              piece = new Rook(color, box);
              break;
            case "N":
              piece = new Knight(color, box);
              break;
            case "B":
              piece = new Bishop(color, box);
              break;
            case "Q":
              piece = new Queen(color, box);
              break;
            case "K":
              piece = new King(color, box);
              break;
            case "P":
              piece = new Pawn(color, box);
              break;
            default:
              throw new Error(
                "FEN notation is not correct. Result: " + charData
              );
          }

          counter++;
          piece.setId(`${piece.type}-${piece.color}-${counter}`);
          box.piece = piece;
          boxs[y].push(box);
          pieces.push(piece);
        } else {
          const emptyCount = Number(charData);
          for (let i = 0; i < emptyCount; i++) {
            const coord: Coordinate = { x: x + offset, y };
            const box = new Box(coord);
            boxs[y].push(box);
            offset++;
          }
        }
      });
    });

    return { boxs, pieces };
  }

  private extractTurn(turnData: string): Color {
    return turnData === "w" ? Color.WHITE : Color.BLACK;
  }

  private extractCastle(castleData: string, pieces: Piece[]): King[] {
    const piecesCastle: King[] = [];

    const blackKing = pieces.find(
      (p) => p instanceof King && p.color === Color.BLACK
    ) as King;
    const whiteKing = pieces.find(
      (p) => p instanceof King && p.color === Color.WHITE
    ) as King;

    castleData.split("").forEach((charData) => {
      switch (charData) {
        case "K":
          if (whiteKing) whiteKing.castle.kingSide = true;
          break;
        case "Q":
          if (whiteKing) whiteKing.castle.queenSide = true;
          break;
        case "k":
          if (blackKing) blackKing.castle.kingSide = true; 
          break;
        case "q":
          if (blackKing) blackKing.castle.queenSide = true;
          break;
        case "-":
          break;
        default:
          throw new Error(
            "FEN notation is not correct in the castle: " + charData
          );
      }
    });

    if (blackKing) piecesCastle.push(blackKing);
    if (whiteKing) piecesCastle.push(whiteKing);

    return piecesCastle;
  }

  private extractPassedPawn(
    dataPassedPawn: string,
    pieces: Piece[]
  ): PassedPawn | null {
    if ("-" === dataPassedPawn) {
      return null;
    }

    let coordinate: Coordinate, pawn: Pawn | undefined;

    try {
      coordinate = coordToIndex(dataPassedPawn);
      pawn = pieces.find(
        (p): p is Pawn => p instanceof Pawn && p.coordinate.y === coordinate.y
      ) as Pawn | undefined;
    } catch (err) {
      throw new Error("FEN notation pawn passed . Result: " + dataPassedPawn);
    }

    if (!pawn) {
      throw new Error(
        "FEN notation pawn passed dont match with the game logic. Result: " +
          dataPassedPawn
      );
    }

    pawn.justDoubleMoved = true;

    return { pawn, coordinate };
  }

  private extractHalfMoveClock(dataHalfMoveClock: string): number {
    if (isNaN(Number(dataHalfMoveClock))) {
      throw Error(
        "FEN notation is not correct in the half move clock. Result: " +
          dataHalfMoveClock
      );
    }

    const dataHalfMoveClockParsed = parseInt(dataHalfMoveClock);

    if (dataHalfMoveClockParsed >= 50) {
      throw Error(
        "FEN notation number of half move clock exceed 50. Result: " +
          dataHalfMoveClock
      );
    }

    if (dataHalfMoveClockParsed < 0) {
      throw Error(
        "FEN notation number of half move clock is lower than 0. Result: " +
          dataHalfMoveClock
      );
    }

    return dataHalfMoveClockParsed;
  }

  private extractFullMoveCounter(fullMoveCounter: string): number {
    if (isNaN(Number(fullMoveCounter))) {
      throw Error(
        "FEN notation is not correct in the full move counter. Result: " +
          fullMoveCounter
      );
    }

    const fullMoveCounterParsed = parseInt(fullMoveCounter);

    if (fullMoveCounterParsed < 0) {
      throw Error(
        "FEN notation number of full move counter is lower than 0. Result: " +
          fullMoveCounterParsed
      );
    }

    return fullMoveCounterParsed;
  }
}
