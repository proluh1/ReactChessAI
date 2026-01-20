import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useContext, useState } from "react";
import type Piece from "../domain/entitites/Piece";
import { useGameContext } from "./GameContex";
import type { Coordinate } from "../domain/entitites/Piece";
import PieceIcon from "../componets/board/piece/PieceIcon";

export default function BoardDndProvider({children} : {children : React.ReactNode}) {
  const [activePiece, setActivePiece] = useState<null | Piece>(null);
  const { markDrop, onMove } = useGameContext();

  return (
    <DndContext
      onDragStart={({ active }) => setActivePiece(active.data.current?.piece)}
      onDragEnd={({ active, over }) => {
        setActivePiece(null);
        if (over && over.data.current && over.data.current) {
          markDrop();
          onMove(active.id as string, over.data.current.coordinate);
        }
      }}
    >{children}
          <DragOverlay>
            {activePiece && (
              <PieceIcon name={activePiece.type} color={activePiece.color} className="w-full h-full"/>
            )}
          </DragOverlay>
    </DndContext>
  );
}
