import { useEffect, useState } from "react";

export default function useCellSize(grid:React.RefObject<HTMLDivElement | null>) { 
     const [cellSize, setCellSize] = useState(0);
   
     useEffect(() => {
       const handleResize = () => {
         if (grid.current) {
           const size =
             Math.min(
               grid.current.clientWidth,
               grid.current.clientHeight
             ) / 8;
           setCellSize(size);
         }
       };
   
       window.addEventListener("resize", handleResize);
       handleResize();
   
       return () => window.removeEventListener("resize", handleResize);
     }, []);

     return {cellSize};
}