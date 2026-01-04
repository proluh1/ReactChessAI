import { Color } from "../domain/entitites/Piece";

export default function  indexToColor(row: number, col: number): Color {
  return (row + col) % 2 === 0 ? Color.WHITE : Color.BLACK;
}
