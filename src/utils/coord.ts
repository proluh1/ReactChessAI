import type { Coordinate } from "../domain/entitites/Piece";
import { MoveType, TypePiece } from "../domain/entitites/Piece";

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


function pieceLetter(tp: TypePiece | undefined) {
    switch (tp) {
        case TypePiece.KNIGHT:
            return "N";
        case TypePiece.BISHOP:
            return "B";
        case TypePiece.ROOK:
            return "R";
        case TypePiece.QUEEN:
            return "Q";
        case TypePiece.KING:
            return "K";
        default:
            return "";
    }
}

export function parseNotation(
    from: Coordinate,
    to: Coordinate,
    moveType?: MoveType,
    promotionTo?: TypePiece
): string {
    const fromStr = indexToCoord(from);
    const toStr = indexToCoord(to);

    if (moveType === MoveType.CASTLING) {
        const dx = to.x - from.x;
        return dx === 2 ? "O-O" : dx === -2 ? "O-O-O" : `${fromStr}-${toStr}`;
    }

    if (moveType === MoveType.EN_PASSANT) {
        return `${fromStr}x${toStr} e.p.`;
    }

    if (moveType === MoveType.CAPTURE) {
        return `${fromStr}x${toStr}`;
    }

    if (moveType === MoveType.PROMOTION) {
        const p = pieceLetter(promotionTo) || "Q";
        return `${fromStr}-${toStr}=${p}`;
    }

    // NORMAL, DOUBLE_STEP or fallback
    return `${fromStr}-${toStr}`;
}

