import {  createContext, useContext, useRef } from "react";
import type Game from "../engine/Game";
import type { Coordinate } from "../domain/entitites/Piece";

export const GameContext = createContext<{
  previousCoord: () => Coordinate | null;
  markDrop: () => void;
  consumeDrop: () => boolean;
  onMove: (id: string, to: Coordinate) => void;
  startGame: () => void;
}>({
  previousCoord: () => null,
  markDrop: () => {},
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

  const previousCoord = () =>
    game && game.movesHistory.length
      ? game.movesHistory.at(-1)!.from
      : null;

  return (
    <GameContext.Provider value={{ previousCoord, markDrop, consumeDrop, onMove, startGame }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGameContext = () => useContext(GameContext);