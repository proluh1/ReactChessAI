import Rook from "./svg/RookSVG";
import Knight from "./svg/KnightSVG";
import Bishop from "./svg/BishopSVG";
import King from "./svg/KingSVG";
import Queen from "./svg/QueenSVG"
import Pawn from "./svg/PawnSVG"
import type { FC } from "react";
import type { Color, TypePiece } from "../../../../domain/entitites/Piece";

export const icons: Record<TypePiece, FC<{ primary?: string; secondary?: string; third?: string; className?: string, color?:Color }>> = {
  rook: Rook,
  knight: Knight,
  bishop: Bishop,
  pawn: Pawn,
  queen: Queen,
  king: King,
};


