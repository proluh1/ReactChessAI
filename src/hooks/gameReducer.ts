import  BoardBuilder  from "../engine/BoardBuilder";
import HumanPlayer from "../engine/controller/HumanPlayer";
import { GameAction, GameState, PvMode } from "../engine/Game";
import Game from "../engine/Game";
import { Color, MoveType } from "../domain/entitites/Piece";
import AIPlayer from "../engine/controller/AIPlayer";
import { defaultFen } from "../config/defaultFen.json";
import type Board from "../domain/entitites/Board";

export type GameProps = {
  game: Game | null;
  board: Board;
  lastMoveType: MoveType | null;
  mode: PvMode | null;
  gameState: GameState;
};

export default function gameReducer(state: GameProps, action: any): GameProps {
  switch (action.type) {
    case GameAction.START: {
      state.gameState = GameState.PLAYING;
      const board = BoardBuilder.fen(defaultFen).build();
      let game: Game;
      switch (state.mode) {
        case PvMode.LOCAL:
          game = new Game(
            board,
            new HumanPlayer(Color.WHITE),
            new HumanPlayer(Color.BLACK),
            state.mode
          );
          break;
        case PvMode.IA: {
          const humanIsWhite = Math.random() > 0.5;
          const human = new HumanPlayer(
            humanIsWhite ? Color.WHITE : Color.BLACK
          );
          const ai = new AIPlayer(humanIsWhite ? Color.BLACK : Color.WHITE);
          game = new Game(
            board,
            human.color === Color.WHITE ? human : ai,
            human.color === Color.BLACK ? human : ai,
            state.mode
          );
          game.currentPLayer = human;
          break;
        }
        default:
          return state;
      }
      return {
        ...state,
        game,
        board
      };
    }
    case GameAction.SELECT_MODE: {
      return {
        ...state,
        mode: action.mode,
      };
    }
    case GameAction.MOVE: {
      if (!state.game || !state.board) return state;

      const result = state.game.makeMoveById(action.id, action.to);
      if (!result.success) return state;

      const newGame = state.game.clone();

      return {
        ...state,
        game: newGame,
        board: newGame.getBoard(),
        lastMoveType: result.lastMoveType,
      };
    }
    case GameAction.MOVE_IA: {
      if (!state.game || !state.board) return state;
      const result = state.game.makeMoveByFromTo(action.from, action.to);
      if (!result.success) return state;

      const newGame = state.game.clone();

      return {
        ...state,
        game: newGame,
        board: newGame.getBoard(),
        lastMoveType: result.lastMoveType,
      };
    }
    default:
      return state;
  }
}
