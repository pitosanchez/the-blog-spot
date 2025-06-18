import { memo } from "react";
import type { Quote } from "../../types";
import { useQuoteRotation } from "../../hooks/useQuoteRotation";

interface QuoteCarouselProps {
  quotes: Quote[];
  interval?: number;
  autoPlay?: boolean;
  className?: string;
  showControls?: boolean;
}

export const QuoteCarousel = memo<QuoteCarouselProps>(
  ({
    quotes,
    interval = 5000,
    autoPlay = true,
    className = "",
    showControls = false,
  }) => {
    const {
      currentQuote,
      currentIndex,
      isPlaying,
      nextQuote,
      previousQuote,
      goToQuote,
      togglePlayback,
      totalQuotes,
    } = useQuoteRotation({ quotes, interval, autoPlay });

    if (!quotes.length) return null;

    return (
      <div
        className={`relative ${className}`}
        role="region"
        aria-label="Rotating quotes"
        aria-live="polite"
      >
        {/* Quote Content */}
        <div className="bg-white bg-opacity-80 rounded-xl p-4 md:p-5 shadow-lg border-l-4 border-bodega-brick h-full flex flex-col justify-center transition-all duration-500 ease-in-out">
          <blockquote className="text-base md:text-lg text-vintage-ink font-lora italic mb-2 md:mb-3">
            "{currentQuote.text}"
          </blockquote>
          <cite className="text-sm md:text-base text-community-teal font-source text-right not-italic">
            — {currentQuote.author}
          </cite>
        </div>

        {/* Indicators */}
        {totalQuotes > 1 && (
          <div className="flex justify-center mt-3 space-x-2">
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => goToQuote(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-bodega-brick focus:ring-opacity-50 ${
                  index === currentIndex
                    ? "bg-bodega-brick"
                    : "bg-bodega-brick bg-opacity-30 hover:bg-opacity-60"
                }`}
                aria-label={`Go to quote ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Controls (optional) */}
        {showControls && totalQuotes > 1 && (
          <div className="flex justify-center items-center mt-2 space-x-2">
            <button
              onClick={previousQuote}
              className="p-1 text-community-teal hover:text-bodega-brick transition-colors focus:outline-none focus:ring-2 focus:ring-bodega-brick focus:ring-opacity-50 rounded"
              aria-label="Previous quote"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={togglePlayback}
              className="p-1 text-community-teal hover:text-bodega-brick transition-colors focus:outline-none focus:ring-2 focus:ring-bodega-brick focus:ring-opacity-50 rounded"
              aria-label={isPlaying ? "Pause rotation" : "Play rotation"}
            >
              {isPlaying ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9v6m4-6v6"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 0V8a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2z"
                  />
                </svg>
              )}
            </button>

            <button
              onClick={nextQuote}
              className="p-1 text-community-teal hover:text-bodega-brick transition-colors focus:outline-none focus:ring-2 focus:ring-bodega-brick focus:ring-opacity-50 rounded"
              aria-label="Next quote"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  }
);

QuoteCarousel.displayName = "QuoteCarousel";
