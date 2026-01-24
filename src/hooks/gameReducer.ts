import BoardBuilder from "../engine/BoardBuilder";
import HumanPlayer from "../engine/controller/HumanPlayer";
import { GameAction, GameState, PvMode } from "../engine/Game";
import Game from "../engine/Game";
import { Color, MoveType, type Coordinate } from "../domain/entitites/Piece";
import AIPlayer from "../engine/controller/AIPlayer";
import { defaultFen } from "../config/defaultFen.json";
import type Board from "../domain/entitites/Board";

export type GameProps = {
  game: Game | null;
  board: Board;
  lastMoveType: MoveType | null;
  mode: PvMode | null;
  gameState: GameState;
  bestMove: {from: Coordinate, to: Coordinate} | null
};

export default  function gameReducer(state: GameProps, action: any): GameProps {
  switch (action.type) {
    case GameAction.START: {
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
          const human = new HumanPlayer(Color.WHITE);
          const ai = new AIPlayer(Color.BLACK);
          game = new Game(
            board,
            human,
            ai,
            state.mode
          );
          break;
        }
        default:
          return state;
      }
      return {
        ...state,
        gameState: GameState.PLAYING,
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
    case GameAction.UNDO_MOVE: {
      const game = state.game;
      if (!game || !state.board || game.mode === PvMode.ONLINE) return state;
      const result = game.undoMove();
      if (!result.success) return state;

      if (game.mode === PvMode.IA && (game.getCurrentPlayerTurn() instanceof AIPlayer)) game.undoMove();

      const newGame = game.clone();

      return {
        ...state,
        game: newGame,
        board: newGame.getBoard(),
      };
    }
    case GameAction.SHOW_BEST_MOVE: {

      return {
        ...state,
        bestMove: action.bestMove
      }
    }
    default:
      return state;
  }
}
