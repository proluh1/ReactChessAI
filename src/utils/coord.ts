import type { Coordinate } from "../domain/entitites/Piece";


export function coordToIndex(coord: string): Coordinate {
    const x = coord.charCodeAt(0) - 97; 
    const y = 8 - parseInt(coord[1]);   
    return { x, y };
}

export function indexToCoord(coord: Coordinate):string {
    const x = String.fromCharCode( 97 + coord.x);
    const y = 8 - coord.y;

    return  `${x}${y}`
}