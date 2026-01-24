import { memo, useRef, useLayoutEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import type Piece from "../../../domain/entitites/Piece";
import { useGameContext } from "../../../context/GameContex";
import PieceIcon from "./PieceIcon";
import type { Coordinate } from "../../../domain/entitites/Piece";
import useArrow from "../../../hooks/useArrow";

const PieceComponent = memo(
  ({
    piece,
    size,
    flipped,
  }: {
    piece: Piece;
    size: number;
    flipped: boolean;
  }) => {
    const imgRef = useRef<HTMLDivElement>(null);
    const rotation = flipped ? "rotate(180deg)" : "";
    const { previousMove, consumeDrop } = useGameContext();
    const { handleMouseDown } = useArrow(piece.box?.coordinate as Coordinate);

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
      id: piece.id,
      data: { piece },
    });

    useLayoutEffect(() => {
      const curr = piece.box?.coordinate;
      const img = imgRef.current
      if (!curr || img === null) return;

      const wasDrop = consumeDrop();
      if (wasDrop) return;

      const lastMoves = previousMove();

      if (lastMoves === undefined) return;

      lastMoves.forEach((lastMove) => {
        if (lastMove.id !== piece.id) return;

        const prevCoord = lastMove.from;
        const dx = (prevCoord.x - curr.x) * size;
        const dy = (prevCoord.y - curr.y) * size;

        img.animate(
          [
            { transform: `translate(${dx}px, ${dy}px)` },
            { transform: "translate(0px, 0px)" },
          ],
          {
            duration: 200,
            easing: "ease-out",
          }
        );
      })


    }, [piece.box?.coordinate]);

    return (
      <div className="w-full h-full" style={{ transform: rotation }}>
        <PieceIcon
          name={piece.type}
          primary="#fff"
          secondary="#000"
          color={piece.color}
          className="w-full h-full"
          draggable={false}
          ref={(node) => {
            imgRef.current = node;
            setNodeRef(node);
          }}
          {...listeners}
          {...attributes}
          onMouseDown={handleMouseDown}
          style={{
            cursor: "grab",
            visibility: isDragging ? "hidden" : "visible",
          }}
        />
      </div>
    );
  }
);

export default PieceComponent;
