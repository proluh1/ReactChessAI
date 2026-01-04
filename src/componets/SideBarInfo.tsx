import { memo } from "react";

const SidebarInfo = memo(
  ({ className, startGame }: { className: string; startGame: () => void }) => {
    return (
      <aside className={className}>
        <div className="w-full h-full flex flex-col justify-end p-4 bg-black rounded-[4px]">
          <button onClick={startGame} className="w-full p-4 text-[1.7rem] font-bold rounded-[8px] bg-gradient-to-b from-white/20 to-primary hover:from-white/40 transition-all duration-300">
            Jugar
          </button>
        </div>
      </aside>
    );
  }
);

export default SidebarInfo;
