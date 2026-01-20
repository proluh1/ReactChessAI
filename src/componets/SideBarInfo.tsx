import { memo, useEffect, useRef } from "react";
import Game, { GameState } from "../engine/Game";
import IconUndo from "../assets/undo.svg?react";
import IconSurrender from "../assets/surrender.svg?react";
import IconSuggest from "../assets/suggest.svg?react";

const SidebarInfo = memo(
  ({ className, startGame, gameState, game }: { className: string; startGame: () => void, gameState: GameState, game: Game }) => {

    const moveHistoryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (moveHistoryRef.current) {
        moveHistoryRef.current.scrollTo({
          top: moveHistoryRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, [game?.movesHistory.length]);

    return (
      <aside className={className}>
        <div className="w-full h-full flex flex-col justify-end bg-black rounded-[4px]">
          {gameState === GameState.PLAYING && (
            <div ref={moveHistoryRef} className="h-4/7  flex flex-col justify-start bg-blackBox/5 overflow-y-scroll">
              <ul>
                {game.movesHistory.map((move, index) => (
                  <li key={index} className="text-secondary/80 mb-2 text-[.9rem] px-4 py-1 flex justify-between even:bg-blackBox/20">
                    <span className="font-bold w-1/4">{index+1}. </span>
                    <span className="w-1/2">{move.notation.split("-")[0]}</span>
                    <span className="w-1/1">{move.notation.split("-")[1]}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <footer className="h-1/7 flex justify-center items-center gap-5 px-5">
            {gameState === GameState.IDLE && (
              <button onClick={startGame} className="w-full p-4 text-[1.7rem] font-bold rounded-[8px] bg-gradient-to-b from-white/20 to-primary hover:from-white/40 transition-all duration-300">
                Jugar
              </button>
            )}
            {gameState === GameState.PLAYING && (
              <>
                <button onClick={startGame} className="w-full flex justify-center items-center p-4 text-[1.7rem] font-bold rounded-[8px] bg-gradient-to-b from-white/20 to-primary hover:from-white/40 transition-all duration-300">
                  <IconSurrender fill="white" width={20} height={20} />
                </button>
                <button onClick={startGame} className="w-full flex justify-center items-center p-4 text-[1.7rem] font-bold rounded-[8px] bg-gradient-to-b from-white/20 to-primary hover:from-white/40 transition-all duration-300">
                  <IconUndo fill="white" width={20} height={20} />
                </button>
                <button onClick={startGame} className="w-full flex justify-center items-center p-4 text-[1.7rem] font-bold rounded-[8px] bg-gradient-to-b from-white/20 to-primary hover:from-white/40 transition-all duration-300">
                  <IconSuggest fill="white" width={25} height={20} />
                </button>
              </>
            )}
          </footer>

        </div>
      </aside>
    );
  }
);

export default SidebarInfo;
