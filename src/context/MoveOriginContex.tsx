import {  createContext, useRef } from "react";
import type Game from "../engine/Game";
import type { Coordinate } from "../domain/entitites/Piece";

export const MoveOriginContext = createContext<{
  previousCoord: () => Coordinate | null;
  markDrop: () => void;
  consumeDrop: () => boolean;
}>({
  previousCoord: () => null,
  markDrop: () => {},
  consumeDrop: () => false,
});

export function MoveOriginProvider({
  children,
  game,
}: {
  children: React.ReactNode;
  game: Game | null;
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
    <MoveOriginContext.Provider value={{ previousCoord, markDrop, consumeDrop }}>
      {children}
    </MoveOriginContext.Provider>
  );
}
