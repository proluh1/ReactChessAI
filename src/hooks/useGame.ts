import { useEffect, useReducer, useState } from "react";
import BoardBuilder from "../engine/BoardBuilder";
import { GameAction, GameState, PvMode } from "../engine/Game";
import { type Coordinate } from "../domain/entitites/Piece";
import gameReducer from "./gameReducer";
import { defaultFen } from "../config/defaultFen.json";
import AIPlayer from "../engine/controller/AIPlayer";

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, {
    game: null,
    board: BoardBuilder.fen(defaultFen).build(),
    lastMoveType: null,
    mode: PvMode.LOCAL,
    gameState: GameState.IDLE,
    bestMove: null
  });
  const [isThinking, setIsThinking] = useState(false);

  const startGame = () => {
    dispatch({ type: GameAction.START });
  };

  const selectMode = (mode: PvMode) => {
    dispatch({ type: GameAction.SELECT_MODE, mode });
  }

  const undoMove = () => {
    dispatch({ type: GameAction.UNDO_MOVE });
  }

  const showBestMove = () => {
    if (isThinking) {
      return
    }
    new AIPlayer().getMove(state.board, 15).then((bestMove) => { dispatch({ type: GameAction.SHOW_BEST_MOVE, bestMove }); }).finally(()=> setIsThinking(false));
    setIsThinking(true);

  }

  const handleMove = (id: string, to: Coordinate) => {
    if (isThinking) {
      return
    }
    if (state.game === null) {
      startGame();
    }
    dispatch({ type: GameAction.MOVE, id, to });
  };

  const handleMoveIA = (from: Coordinate, to: Coordinate) => {
    dispatch({ type: GameAction.MOVE_IA, from, to });
  };


  useEffect(() => {
    const { game } = state;
    if (game === null || game.mode !== PvMode.IA || isThinking) return;
    const currentPlayer = game.getCurrentPlayerTurn();
    if (!(currentPlayer instanceof AIPlayer)) return;
    setIsThinking(true);
    let cancelled = false;
    (async () => {
      try {
        const move = await currentPlayer.getMove(game.getBoard(), 15);
        if (cancelled) return;
        handleMoveIA(move.from, move.to);
      } catch (err) {
        console.error("AI failed:", err);
      } finally {
        setIsThinking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [state.game]);

  return {
    state,
    startGame,
    selectMode,
    handleMoveIA,
    handleMove,
    undoMove,
    showBestMove,
  };
}
