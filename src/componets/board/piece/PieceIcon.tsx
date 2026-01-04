import React from "react";
import { icons } from "./icons/icons";
import { Color, TypePiece } from "../../../domain/entitites/Piece";

type IconProps = {
  name: TypePiece;
  primary?: string;
  secondary?: string;
  third?: string;
  color: Color;
  className?: string;
  style?: React.CSSProperties;
  draggable?: boolean;
  onMouseDown?: (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
};

const PieceIcon = React.forwardRef<HTMLDivElement, IconProps>(
  ({ name, primary = "#fff", secondary = "#000", third="#000", color, className, style, draggable, onMouseDown, onMouseUp, ...listeners }, ref) => {
    const Svg = icons[name];
    if (!Svg) return null;

    if (color === Color.BLACK) {
      [primary, secondary] = [secondary, primary];
    }

    return (
      <div
        ref={ref}
        style={{ ...style, width: "100%", height: "100%" }}
        draggable={draggable}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        {...listeners}
      >
        <Svg primary={primary} secondary={secondary} third={third} color={color} className={className} />
      </div>
    );
  }
);

export default PieceIcon;
