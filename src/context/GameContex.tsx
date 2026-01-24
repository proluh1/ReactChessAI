import { createContext, useContext, useRef } from "react";
import type Game from "../engine/Game";
import type { Coordinate } from "../domain/entitites/Piece";
import type { MoveAnimation  } from "../engine/Game";

export const GameContext = createContext<{
  previousMove: () => MoveAnimation[] | undefined;
  markDrop: () => void;
  consumeDrop: () => boolean;
  onMove: (id: string, to: Coordinate) => void;
  startGame: () => void;
}>({
  previousMove: () => undefined,
  markDrop: () => { },
  consumeDrop: () => false,
  onMove: () => undefined,
  startGame: () => undefined
});

export default function GameProvider({
  children,
  game,
  onMove,
  startGame
}: {
  children: React.ReactNode;
  game: Game | null;
  onMove: (id: string, to: Coordinate) => void;
  startGame: () => void;
}) {
  const dropRef = useRef(false);

  const markDrop = () => {
    dropRef.current = true;
  };

  const consumeDrop = () => {
    const value = dropRef.current;
    dropRef.current = false;
    return value;
  };

  const previousMove = () => game?.lastMoveAnimation;
  

  return (
    <GameContext.Provider value={{ previousMove, markDrop, consumeDrop, onMove, startGame }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGameContext = () => useContext(GameContext);