import { Color } from "../../../../../domain/entitites/Piece";

export default function KingSVG({
  primary,
  secondary,
  third,
  className,
  color = Color.WHITE,
}: {
  primary?: string;
  secondary?: string;
  third?: string;
  className?: string;
  color?: Color;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 45 45"
    >
      <g
        style={{
          fill: primary,
          stroke: third,
          strokeWidth: 1.5,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
      >
        <path
          d="M22.5 11.63V6M20 8h5"
          style={{ stroke: third, fill: "none" }}
        />
        <path
          d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"
          style={{
            fill: primary,
            stroke: third,
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
          }}
        />

        <path
          d="M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37"
          style={{ fill: primary, stroke: third }}
        />
        <path
          d="M12.5 30c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0"
          style={{ fill: "none", stroke: secondary }}
        />

        {color && Color.BLACK === color && (
          <>
            <path
              d="M 32,29.5 C 32,29.5 40.5,25.5 38.03,19.85 C 34.15,14 25,18 22.5,24.5 L 22.5,26.6 L 22.5,24.5 C 20,18 10.85,14 6.97,19.85 C 4.5,25.5 13,29.5 13,29.5"
              style={{ fill: "none", stroke: secondary }}
            />
          </>
        )}
      </g>
    </svg>
  );
}
