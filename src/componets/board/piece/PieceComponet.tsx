import { memo, useRef, useContext, useLayoutEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import type Piece from "../../../domain/entitites/Piece";
import { MoveOriginContext } from "../../../context/MoveOriginContex";
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
    const { previousCoord, consumeDrop } = useContext(MoveOriginContext);
    const { handleMouseDown } = useArrow(piece.box?.coordinate as Coordinate);

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
      id: piece.id,
      data: { piece },
    });

    useLayoutEffect(() => {
      if (!piece.box || !imgRef.current) return;

      const prevCoord = previousCoord();
      if (!prevCoord) return;

      const curr = piece.box.coordinate;

      const wasDrop = consumeDrop();
      if (wasDrop) return;
      const dx = (prevCoord.x - curr.x) * size;
      const dy = (prevCoord.y - curr.y) * size;

      imgRef.current.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: "translate(0px, 0px)" },
        ],
        {
          duration: 200,
          easing: "ease-out",
        }
      );
    }, [piece.box]);

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
