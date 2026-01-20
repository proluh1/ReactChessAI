import PieceComponent from "./piece/PieceComponet";
import Board from "../../domain/entitites/Board";
import indexToColor from "../../utils/color";
import type { Color, Coordinate } from "../../domain/entitites/Piece";
import BoxComponent from "./BoxComponent";
import { useContext, useRef } from "react";
import BoardDndProvider from "../../context/BoardDndContext";
import useCellSize from "../../hooks/useCellSize";
import { ArrowContext, ArrowProvider } from "../../context/ArrowContext";
import BoardWrapper from "./BoardWrapper";

function BoardComponent({
  board,
  className,
  toogleBoard,
}: {
  board: Board;
  className?: string;
  toogleBoard: boolean;
}) {
  const boxComponentWrapper = useRef<HTMLDivElement | null>(null);
  const { cellSize } = useCellSize(boxComponentWrapper);

  return (
    <div
      onContextMenu={(event) => {
        event.preventDefault();
      }}
      ref={boxComponentWrapper}
      className={`relative grid grid-rows-8 grid-cols-8 aspect-square select-none ${className}`}
      style={{ transform: toogleBoard ? "rotate(180deg)" : "" }}
    >
      <BoardDndProvider>
        <ArrowProvider cellSize={cellSize}>
          {board.boxes.map((boxsRow, row) =>
            boxsRow.map((box, col) => {
              const hasSearch = box.piece;
              const color: Color = indexToColor(row, col);
              return (
                <BoxComponent
                  coord={box.coordinate}
                  key={`${col}-${row}`}
                  color={color}
                >
                  {hasSearch && cellSize > 0 && (
                    <PieceComponent
                      size={cellSize}
                      key={hasSearch.id}
                      piece={hasSearch}
                      flipped={toogleBoard}
                    />
                  )}
                </BoxComponent>
              );
            })
          )}
        </ArrowProvider>
      </BoardDndProvider>
    </div>
  );
}

export default BoardComponent;
