import { useCallback, useEffect, useRef } from "react";

export default function useOverlay() {
  const overlayHover = useRef<HTMLDivElement | null>(null);
  const overlayWrapper = useRef<HTMLDivElement | null>(null);
  const selectedOption = useRef<HTMLButtonElement | null>(null);
  const moveOverlay = useCallback(
    ({
      wrapper,
      overlay,
      selected,
    }: {
      wrapper: HTMLDivElement;
      overlay: HTMLDivElement;
      selected: HTMLButtonElement;
    }) => {
      const targetRect = selected.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();

      overlay.style.width = `${targetRect.width}px`;
      overlay.style.height = `${targetRect.height}px`;

      overlay.style.top = `${targetRect.top - wrapperRect.top}px`;
    },
    []
  );

  const handleHover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const overlay = overlayHover.current;
      const wrapper = overlayWrapper.current;
      if (overlay === null || wrapper === null) return;
      moveOverlay({ overlay, wrapper, selected: event.currentTarget });
    },
    [moveOverlay]
  );

  const handleUnHover = useCallback(() => {
    const overlay = overlayHover.current;
    const wrapper = overlayWrapper.current;
    const selected = selectedOption.current;
    if (overlay === null || wrapper === null || selected === null) return;
    moveOverlay({ overlay, wrapper, selected });
  }, [moveOverlay]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      selectedOption.current = event.currentTarget;
    },
    []
  );

  useEffect(() => {
    const overlay = overlayHover.current;
    const wrapper = overlayWrapper.current;
    const selected = selectedOption.current;
    if (overlay === null || wrapper === null || selected === null) return;
    moveOverlay({ overlay, wrapper, selected });

    function resize() {
      if (overlay === null || wrapper === null || selected === null) return;
      moveOverlay({ overlay, wrapper, selected });
    }

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, []);

  return {
    handleClick,
    handleHover,
    handleUnHover,
    overlayHover,
    overlayWrapper,
    selectedOption,
  };
}
