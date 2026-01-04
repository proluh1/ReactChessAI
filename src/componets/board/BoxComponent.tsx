import { memo, type ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Color, type Coordinate } from "../../domain/entitites/Piece";
import useArrow from "../../hooks/useArrow";

const Box = memo(
  ({
    children,
    coord,
    color,
  }: {
    children: ReactNode;
    coord: Coordinate;
    color: string;
  }) => {
    const dropId = `${coord.x}-${coord.y}`;
    const { setNodeRef, isOver } = useDroppable({
      id: dropId,
      data: { coordinate: coord },
    });

    const { handleMouseUp, handleMouseDownRemoveArrows } = useArrow(coord);

    return (
      <div
        ref={setNodeRef}
        onMouseDown={handleMouseDownRemoveArrows}
        onMouseUp={handleMouseUp}
        style={{
          backgroundColor:
            color === Color.WHITE
              ? "var(--color-whiteBox)"
              : "var(--color-blackBox)",
        }}
        className={` ${isOver ? "target-dragging" : ""} 
      flex justify-center align-center focus:border-[4px] focus:border-focus focus:outline-none`}
      >
        {children}
      </div>
    );
  }
);

export default Box;
