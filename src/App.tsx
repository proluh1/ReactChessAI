import { useEffect, useState } from "react";
import BoardComponent from "./componets/board/BoardComponent";
import { useGame } from "./hooks/useGame";
import SidebarOptions from "./componets/SideBarOptions";
import useAudio from "./hooks/useAudio";
import { MoveOriginProvider } from "./context/MoveOriginContex";
import SidebarInfo from "./componets/SideBarInfo";

function App() {
  const { state, selectMode ,startGame, handleMove } = useGame();
  const [toogleBoard, setToogleBoard] = useState(false);

  const playAudio = useAudio();
  useEffect(() => {
    if (!state.lastMoveType) return;
    playAudio(state.lastMoveType);
  }, [state.board]);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen p-4">
      {/* Sidebar Options*/}
      <SidebarOptions
        className="w-full md:w-[180px] fixed left-0 top-0 bottom-0"
        selectMode={selectMode}
      ></SidebarOptions>

      <div className="w-full md:w-1/7"></div>
      
      {/* Tablero */}
      <div className="w-full p-4 flex justify-center items-center">
        <MoveOriginProvider game={state.game}>
          <BoardComponent
            className="h-auto w-full max-w-[800px]"
            board={state.board}
            toogleBoard={toogleBoard}
            onMove={handleMove}
          />
        </MoveOriginProvider>
      </div>

      {/* SideBar Info*/}
      <SidebarInfo startGame={startGame} className="w-full md:w-1/3"></SidebarInfo>
      <div className="md:w-1/6"></div>
    </div>
  );
}

export default App;
