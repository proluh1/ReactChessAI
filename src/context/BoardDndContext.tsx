import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useContext, useState } from "react";
import type Piece from "../domain/entitites/Piece";
import { MoveOriginContext } from "./MoveOriginContex";
import type { Coordinate } from "../domain/entitites/Piece";
import PieceIcon from "../componets/board/piece/PieceIcon";

export default function BoardDndProvider({children, onMove} : {children : React.ReactNode, onMove?: (id: string, to: Coordinate) => void;}) {
  const [activePiece, setActivePiece] = useState<null | Piece>(null);
  const { markDrop } = useContext(MoveOriginContext);

  return (
    <DndContext
      onDragStart={({ active }) => setActivePiece(active.data.current?.piece)}
      onDragEnd={({ active, over }) => {
        setActivePiece(null);

        if (over && over.data.current) {
          markDrop();
          onMove(active.id as string, over.data.current.coordinate as Coordinate);
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
