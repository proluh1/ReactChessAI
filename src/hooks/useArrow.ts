import { useCallback, useContext } from "react";
import { ArrowContext } from "../context/ArrowContext";
import type { Coordinate } from "../domain/entitites/Piece";

export default function useArrow(props: Coordinate) {
  const { mouseDown, mouseUp, clearAllArrows } = useContext(ArrowContext);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
      if (event.button !== 2) {
        return;
      }
      mouseDown(props);
    },
    [props, mouseDown, clearAllArrows]
  );

  const handleMouseUp = useCallback(
    (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
      if (event.button !== 2) {
        return;
      }
      let color;
      if (event.ctrlKey) {
        color = "rgba(255,0,0, .6)";
      }
      else if (event.altKey) {
        color = "rgba(100,255,255, .6)";
      }
      else if (event.shiftKey) {
        color = "rgba(0,255,0, .6)";
      }
      mouseUp(props, color);
    },
    [props, mouseUp]
  );

  const handleMouseDownRemoveArrows = useCallback(
    (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
      if (event.button === 0) {
        clearAllArrows();
        return;
      }
    },
    [clearAllArrows]
  );

  return { handleMouseDown, handleMouseUp, handleMouseDownRemoveArrows };
}
