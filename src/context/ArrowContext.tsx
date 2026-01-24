import { createContext, useCallback, useEffect, useRef } from "react";
import type { Coordinate } from "../domain/entitites/Piece";


export const ArrowContext = createContext<{
  mouseDown: (initial: Coordinate) => void;
  mouseUp: (last: Coordinate, color?: string) => void;
  clearAllArrows: () => void
}>({
  mouseDown: () => { },
  mouseUp: () => { },
  clearAllArrows: () => { }
});

export function ArrowProvider({
  cellSize,
  children,
  suggest,
}: {
  cellSize: number;
  children: React.ReactNode;
  suggest?: { from: Coordinate, to: Coordinate } | null
}) {
  const initialState = useRef<Coordinate | null>(null);
  const arrowCanvas = useRef<HTMLCanvasElement | null>(null);


  const drawArrow = useCallback(
    ({
      initial,
      last,
      arrow,
      color = "rgba(0,0,0, .6)",
    }: {
      initial: Coordinate;
      last: Coordinate;
      arrow: HTMLCanvasElement;
      color?: string;
    }) => {
      if (initial.x === last.x && initial.y === last.y) return;

      const from = {
        px: initial.x * cellSize + cellSize / 2,
        py: initial.y * cellSize + cellSize / 2,
      };
      const to = {
        px: last.x * cellSize + cellSize / 2,
        py: last.y * cellSize + cellSize / 2,
      };

      const ctx = arrow.getContext("2d");
      if (!ctx) return;

      const dx = Math.abs(last.x - initial.x);
      const dy = Math.abs(last.y - initial.y);

      let withCurve = false;
      if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2)) {
        withCurve = true;
      }

      const lineWidth = cellSize / 5;
      const headSize = cellSize / 1.9;
      const tipOffset = headSize * Math.cos(Math.PI / 5.9);
      const offSetBegin = cellSize * 0.4;

      let angle;

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = lineWidth;

      if (withCurve) {
        const dx = to.px - from.px;
        const dy = to.py - from.py;
        const begin = { px: from.px, py: from.py };
        const mid = { px: from.px, py: from.py };
        const end = { px: to.px, py: to.py };

        if (Math.abs(dx) > Math.abs(dy)) {
          begin.px = begin.px - offSetBegin;
          mid.px += (dx > 0 ? 2 : -2) * (cellSize / 1);
          mid.py += 0;
          angle = Math.atan2(to.py - mid.py, to.px - mid.px);
          end.py = end.py - tipOffset * Math.sin(angle);
        } else {
          begin.py = begin.py - offSetBegin;
          mid.px += 0;
          mid.py += (dy > 0 ? 2 : -2) * (cellSize / 1);
          angle = Math.atan2(to.py - mid.py, to.px - mid.px);
          end.px = end.px - tipOffset * Math.cos(angle);
        }

        ctx.beginPath();
        ctx.moveTo(begin.px, begin.py);
        ctx.lineTo(mid.px, mid.py);
        ctx.lineTo(end.px, end.py);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(to.px, to.py);
        ctx.lineTo(
          to.px - headSize * Math.cos(angle - Math.PI / 6),
          to.py - headSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          to.px - headSize * Math.cos(angle + Math.PI / 6),
          to.py - headSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
      } else {
        angle = Math.atan2(to.py - from.py, to.px - from.px);

        const lineStart = {
          px: from.px + offSetBegin * Math.cos(angle),
          py: from.py + offSetBegin * Math.sin(angle),
        };

        const lineEnd = {
          px: to.px - tipOffset * Math.cos(angle),
          py: to.py - tipOffset * Math.sin(angle),
        };

        ctx.beginPath();
        ctx.moveTo(lineStart.px, lineStart.py);
        ctx.lineTo(lineEnd.px, lineEnd.py);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(to.px, to.py);
        ctx.lineTo(
          to.px - headSize * Math.cos(angle - Math.PI / 6),
          to.py - headSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          to.px - headSize * Math.cos(angle + Math.PI / 6),
          to.py - headSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
      }
    },
    [cellSize]
  );

  const mouseDown = useCallback((initial: Coordinate) => {
    initialState.current = initial;
  }, []);

  const mouseUp = useCallback(
    (last: Coordinate, color?: string) => {
      const initial = initialState.current;
      const arrow = arrowCanvas.current;
      if (!initial || !arrow) return;

      drawArrow({ initial, last, arrow, color });
    },
    [drawArrow]
  );

  const clearArrow = useCallback(() => { }, []);

  const clearAllArrows = useCallback(() => {
    const arrow = arrowCanvas.current;
    if (arrow == null) return;
    const ctx = arrow.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, arrow.width, arrow.height);
  }, []);

  useEffect(() => {
    if (!suggest) return
    const arrow = arrowCanvas.current;
    if (arrow == null) return;
    drawArrow({ initial: suggest.from, last: suggest.to, arrow, color: undefined });

  }, [suggest, drawArrow])

  return (
    <ArrowContext.Provider value={{ mouseDown, mouseUp, clearAllArrows }}>
      <canvas
        ref={arrowCanvas}
        width={cellSize * 8}
        height={cellSize * 8}
        className="pointer-events-none inset-0 absolute"
        id="arrow-canvas"
      ></canvas>
      {children}
    </ArrowContext.Provider>
  );
}
