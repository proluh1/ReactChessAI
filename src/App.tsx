import { useEffect, useState } from "react";
import BoardComponent from "./componets/board/BoardComponent";
import { useGame } from "./hooks/useGame";
import SidebarOptions from "./componets/SideBarOptions";
import useAudio from "./hooks/useAudio";
import GameProvider from "./context/GameContex";
import SidebarInfo from "./componets/SideBarInfo";

function App() {
  const { state, selectMode, startGame, handleMove, undoMove, showBestMove } =
    useGame();
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [toogleBoard, setToogleBoard] = useState(false);

  const tooggleModal = () => {
    setOpenModal((prev) => !prev);
  };

  const playAudio = useAudio();
  useEffect(() => {
    if (!state.lastMoveType) return;
    if (Array.isArray(state.lastMoveType)) {
      state.lastMoveType.forEach((moveType) => {
        playAudio(moveType);
      });
    } else {
      playAudio(state.lastMoveType);
    }
  }, [state.board]);




  return (
    <div className="flex flex-col md:flex-row h-screen w-screen p-4">
      {/* Sidebar Options*/}
      <SidebarOptions
        className="w-full md:w-[180px] fixed left-0 top-0 bottom-0"
        selectMode={selectMode}
      />

      <div className="w-full md:w-1/7"></div>

      {/* Tablero */}
      <div className="w-full p-4 flex justify-center items-center">
        <GameProvider
          game={state.game}
          onMove={handleMove}
          startGame={startGame}
        >
          <BoardComponent
            className="h-auto w-full max-w-[800px]"
            board={state.board}
            bestMove={state.bestMove}
            toogleBoard={toogleBoard}
          />
        </GameProvider>
      </div>

      {/* SideBar Info*/}
      <SidebarInfo
        className="w-full md:w-1/2"
        startGame={startGame}
        showBestMove={showBestMove}
        undoMove={undoMove}
        gameState={state.gameState}
        game={state.game}
        tooggleModal={tooggleModal}
        setToogleBoard={setToogleBoard}
      ></SidebarInfo>
      <div className="md:w-1/5"></div>

      {/* Modals Info*/}
      {isOpenModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          onClick={() => tooggleModal()}
        >
          <div
            className="rounded-[8px] bg-black max-w-[500px] max-h-[350px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border border-secondary/20 rounded-[8px] flex flex-col justify-center">
              <div className="mb-3">Do you want surrender?</div>
              <div className="flex gap-2 justify-center items-center">
                <button
                  onClick={() => tooggleModal()}
                  className="flex-1 p-2 rounded-[8px] hover:bg-light-black transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    tooggleModal();
                  }}
                  className="flex-1 p-2 rounded-[8px] bg-gradient-to-b from-white/20 to-primary hover:from-white/40 transition-all duration-300"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
