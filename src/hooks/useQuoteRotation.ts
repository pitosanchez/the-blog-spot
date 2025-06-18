import { useState, useEffect, useCallback } from "react";
import type { Quote } from "../types";

interface UseQuoteRotationOptions {
  quotes: Quote[];
  interval?: number;
  autoPlay?: boolean;
}

export const useQuoteRotation = ({
  quotes,
  interval = 5000,
  autoPlay = true,
}: UseQuoteRotationOptions) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const nextQuote = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
  }, [quotes.length]);

  const previousQuote = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? quotes.length - 1 : prevIndex - 1
    );
  }, [quotes.length]);

  const goToQuote = useCallback(
    (index: number) => {
      if (index >= 0 && index < quotes.length) {
        setCurrentIndex(index);
      }
    },
    [quotes.length]
  );

  const togglePlayback = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isPlaying || quotes.length <= 1) return;

    const timer = setInterval(nextQuote, interval);
    return () => clearInterval(timer);
  }, [isPlaying, interval, nextQuote, quotes.length]);

  const currentQuote = quotes[currentIndex];

  return {
    currentQuote,
    currentIndex,
    isPlaying,
    nextQuote,
    previousQuote,
    goToQuote,
    togglePlayback,
    totalQuotes: quotes.length,
  };
};
