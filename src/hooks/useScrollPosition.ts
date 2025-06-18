import { useState, useEffect } from "react";
import type { ScrollPosition } from "../types";

interface UseScrollPositionOptions {
  throttleMs?: number;
}

export const useScrollPosition = ({
  throttleMs = 100,
}: UseScrollPositionOptions = {}) => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    let timeoutId: number | null = null;

    const updatePosition = () => {
      setScrollPosition({
        x: window.pageXOffset,
        y: window.pageYOffset,
      });
    };

    const handleScroll = () => {
      if (timeoutId === null) {
        timeoutId = window.setTimeout(() => {
          updatePosition();
          timeoutId = null;
        }, throttleMs);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updatePosition(); // Initial position

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [throttleMs]);

  return {
    scrollPosition,
    isScrolled: scrollPosition.y > 0,
    isScrolledPast: (threshold: number) => scrollPosition.y > threshold,
  };
};
