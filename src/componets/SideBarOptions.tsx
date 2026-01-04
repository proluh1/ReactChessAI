import { PvMode } from "../engine/Game";
import BotIcon from "../assets/bot.svg?react";
import GlobalMultiPLayerIcon from "../assets/global-multiplayer.svg?react";
import LocalMultiPlayerIcon from "../assets/local-multiplayer.svg?react";
import { type ReactElement } from "react";
import useOverlay from "../hooks/useOverlay";

export default function SideBar({
  selectMode,
  className,
}: {
  selectMode: (selectedMode: PvMode) => void;
  className?: string;
}) {
  const {
    handleClick,
    handleHover,
    handleUnHover,
    overlayHover,
    overlayWrapper,
    selectedOption,
  } = useOverlay();

  return (
    <nav className={className}>
      <div className="h-full w-full flex flex-col justify-start p-4 bg-black">
        <img
          src="/ReactChessAI-logo.png"
          className="object-contain w-[120px] mt-5 mb-8"
          alt="Logo ReactChessAI"
        />

        <div
          ref={overlayWrapper}
          className="relative z-0"
          onMouseLeave={handleUnHover}
        >
          <div
            ref={overlayHover}
            className="bg-focus/20 absolute rounded-[8px] transition-all -z-10"
          ></div>
          {gameOptions.map(({ icon, mode, name }, i) => (
            <button
              key={`${i}-${name}`}
              className="p-1 w-full min-h-[50px] text-left text-secondary/90 font-bold text-[1rem] flex justify-start items-center gap-3 z-100"
              onClick={(event) => {
                handleClick(event);
                selectMode(mode);
              }}
              onMouseEnter={handleHover}
              ref={i === 0 ? selectedOption : null}
            >
              {icon}
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

const gameOptions: GameOption[] = [
  {
    icon: (
      <LocalMultiPlayerIcon
        height="25"
        width="25"
        fill="white"
      ></LocalMultiPlayerIcon>
    ),
    mode: PvMode.LOCAL,
    name: "Local",
  },
  {
    icon: <BotIcon height="25" width="25" fill="white"></BotIcon>,
    mode: PvMode.IA,
    name: "IA",
  },
  {
    icon: (
      <GlobalMultiPLayerIcon
        height="25"
        width="25"
        fill="white"
      ></GlobalMultiPLayerIcon>
    ),
    mode: PvMode.ONLINE,
    name: "Online",
  },
];

type GameOption = {
  icon: ReactElement;
  mode: PvMode;
  name: string;
};
