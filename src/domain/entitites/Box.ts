import type { Coordinate } from "../../domain/entitites/Piece";
import type Piece from "../../domain/entitites/Piece";

export default class Box {
  piece: Piece | null;
  neighbor: Neighbor;
  coordinate: Coordinate;

  constructor(coordinate: Coordinate) {
    this.coordinate = coordinate;
    this.piece = null;
    this.neighbor = {
      up: null,
      down: null,
      left: null,
      right: null,
      upLeft: null,
      upRight: null,
      downLeft: null,
      downRight: null,
    };
  }

  setPiece(piece: Piece | null) {
    if (this.piece !== null) {
      this.piece.box = null;
    }
    this.piece = piece;
  }

  getNeightborByCoord(target: Coordinate): Box | null {
    let current: Box = this as Box;

    let dx = target.x - this.coordinate.x;
    let dy = target.y - this.coordinate.y;

    const stepX = dx === 0 ? "" : dx > 0 ? "right" : "left";
    const stepY = dy === 0 ? "" : dy > 0 ? "down" : "up";

    while (dx !== 0 || dy !== 0) {
      const dir = this.getCombinationDireactionPath({
        directionPathX: dx !== 0 ? stepX : "",
        directionPathY: dy !== 0 ? stepY : "",
      });

      const next = current.neighbor[dir] as Box;
      if (next === null) {
        return null
      };

      current = next;

      if (dx !== 0) dx += dx > 0 ? -1 : 1;
      if (dy !== 0) dy += dy > 0 ? -1 : 1;
    }

    return current;
  }

  getNeightborsByCoord(target: Coordinate): Box[] | null{
    let current: Box = this as Box;
    const neighbors: Box[] = [];

    let dx = target.x - this.coordinate.x;
    let dy = target.y - this.coordinate.y;

    const stepX = dx === 0 ? "" : dx > 0 ? "right" : "left";
    const stepY = dy === 0 ? "" : dy > 0 ? "down" : "up";

    while (dx !== 0 || dy !== 0) {
      const dir = this.getCombinationDireactionPath({
        directionPathX: dx !== 0 ? stepX : "",
        directionPathY: dy !== 0 ? stepY : "",
      });

      const next = current.neighbor[dir] as Box;
      if (next === null) return null;

      current = next;
      neighbors.push(current);

      if (dx !== 0) dx += dx > 0 ? -1 : 1;
      if (dy !== 0) dy += dy > 0 ? -1 : 1;
    }

    return neighbors;
  }

  private getCombinationDireactionPath({
    directionPathX,
    directionPathY,
  }: {
    directionPathX: string;
    directionPathY: string;
  }): string {
    if (directionPathX === "") {
      return directionPathY;
    }
    if (directionPathY === "") {
      return directionPathX;
    }

    return directionPathY.concat(
      directionPathX.at(0)?.toUpperCase() + directionPathX.slice(1)
    );
  }
}

export type Neighbor = {
  up: Box | null;
  down: Box | null;
  right: Box | null;
  left: Box | null;
  upRight: Box | null;
  upLeft: Box | null;
  downRight: Box | null;
  downLeft: Box | null;
};
