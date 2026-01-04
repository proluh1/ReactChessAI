import { useRef } from "react";
import { MoveType } from "../domain/entitites/Piece";

export default function useAudio() {
  const audios = useRef<HTMLAudioElement[]>([
    new Audio("/pieces-sounds/move-self.mp3"),
    new Audio("/pieces-sounds/capture.mp3"),
    new Audio("/pieces-sounds/castle.mp3"),
  ]);

  const playAudio = (index: number) => {
    const audio = audios.current[index];
    if (!audio) return;

    audio.currentTime = 0;
    audio.preload = "auto";
    audio.play().catch((err) => {
      console.error(err);
    });
  };

  return (lastMoveType: MoveType) => {
    console.log(lastMoveType);
    switch (lastMoveType) {
      case MoveType.CAPTURE:
      case MoveType.EN_PASSANT:
        playAudio(1);
        break;
      case MoveType.CASTLING:
        playAudio(2);
        break;
      default:
        playAudio(0);
    }
  };
}
