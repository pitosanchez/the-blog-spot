import { memo, useState, useCallback } from "react";

interface RatingProps {
  storyId: string;
  currentRating?: number;
  averageRating?: number;
  totalRatings?: number;
  userRating?: number;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
  readonly?: boolean;
  onRate?: (rating: number) => Promise<void>;
}

interface RatingDistribution {
  [key: number]: number; // rating value -> count
}

const SAMPLE_RATING_DISTRIBUTION: RatingDistribution = {
  5: 45,
  4: 32,
  3: 12,
  2: 4,
  1: 2,
};

export const StoryRating = memo<RatingProps>(
  ({
    storyId: _storyId,
    averageRating = 4.2,
    totalRatings = 95,
    userRating,
    size = "md",
    showDetails = false,
    readonly = false,
    onRate,
  }) => {
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDistribution, setShowDistribution] = useState(false);

    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "text-sm";
        case "lg":
          return "text-2xl";
        default:
          return "text-lg";
      }
    };

    const getStarSize = () => {
      switch (size) {
        case "sm":
          return "w-4 h-4";
        case "lg":
          return "w-8 h-8";
        default:
          return "w-6 h-6";
      }
    };

    const handleRate = useCallback(
      async (rating: number) => {
        if (readonly || !onRate) return;

        setIsSubmitting(true);
        try {
          await onRate(rating);
        } catch (error) {
          console.error("Failed to submit rating:", error);
        } finally {
          setIsSubmitting(false);
        }
      },
      [readonly, onRate]
    );

    const renderStar = (index: number) => {
      const rating = hoveredRating || userRating || 0;
      const isFilled = index <= rating;
      const isHovered = hoveredRating !== null && index <= hoveredRating;

      return (
        <button
          key={index}
          onClick={() => handleRate(index)}
          onMouseEnter={() => !readonly && setHoveredRating(index)}
          onMouseLeave={() => !readonly && setHoveredRating(null)}
          disabled={readonly || isSubmitting}
          className={`${getStarSize()} transition-all duration-200 ${
            readonly
              ? "cursor-default"
              : "cursor-pointer hover:scale-110 active:scale-95"
          } ${isSubmitting ? "opacity-50" : ""}`}
          aria-label={`Rate ${index} star${index !== 1 ? "s" : ""}`}
        >
          <svg
            viewBox="0 0 24 24"
            className={`w-full h-full transition-colors duration-200 ${
              isFilled
                ? isHovered
                  ? "text-yellow-400"
                  : "text-yellow-500"
                : "text-gray-300 hover:text-yellow-400"
            }`}
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      );
    };

    const renderAverageStars = () => {
      const stars = [];
      const fullStars = Math.floor(averageRating);
      const hasHalfStar = averageRating % 1 >= 0.5;

      for (let i = 1; i <= 5; i++) {
        const isFull = i <= fullStars;
        const isHalf = i === fullStars + 1 && hasHalfStar;

        stars.push(
          <div key={i} className={`${getStarSize()} relative`}>
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full text-gray-300"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {(isFull || isHalf) && (
              <svg
                viewBox="0 0 24 24"
                className="absolute top-0 left-0 w-full h-full text-yellow-500"
                fill="currentColor"
                style={{
                  clipPath: isHalf ? "inset(0 50% 0 0)" : "none",
                }}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
          </div>
        );
      }

      return stars;
    };

    const renderRatingDistribution = () => {
      const total = Object.values(SAMPLE_RATING_DISTRIBUTION).reduce(
        (sum, count) => sum + count,
        0
      );

      return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-vintage-ink mb-3">
            Rating Distribution
          </h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = SAMPLE_RATING_DISTRIBUTION[rating] || 0;
              const percentage = total > 0 ? (count / total) * 100 : 0;

              return (
                <div
                  key={rating}
                  className="flex items-center space-x-2 text-sm"
                >
                  <span className="w-2 text-gray-600">{rating}</span>
                  <svg
                    className="w-4 h-4 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-gray-600 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-2">
        {/* Main Rating Display */}
        <div className="flex items-center space-x-3">
          {readonly ? (
            // Display average rating
            <div className="flex items-center space-x-1">
              {renderAverageStars()}
            </div>
          ) : (
            // Interactive rating
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map(renderStar)}
            </div>
          )}

          <div className={`flex items-center space-x-2 ${getSizeClasses()}`}>
            <span className="font-medium text-vintage-ink">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-500">
              ({totalRatings} rating{totalRatings !== 1 ? "s" : ""})
            </span>
          </div>

          {showDetails && (
            <button
              onClick={() => setShowDistribution(!showDistribution)}
              className="text-sm text-community-teal hover:text-bodega-brick transition-colors"
            >
              {showDistribution ? "Hide Details" : "Show Details"}
            </button>
          )}
        </div>

        {/* User Rating Status */}
        {userRating && !readonly && (
          <p className="text-sm text-gray-600">
            You rated this story {userRating} star{userRating !== 1 ? "s" : ""}
          </p>
        )}

        {/* Rating Instructions */}
        {!readonly && !userRating && (
          <p className="text-sm text-gray-500">Click to rate this story</p>
        )}

        {/* Rating Distribution */}
        {showDetails && showDistribution && renderRatingDistribution()}

        {/* Rating Categories (for detailed feedback) */}
        {showDetails && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-vintage-ink">
                Writing Quality
              </div>
              <div className="text-yellow-500 mt-1">★★★★☆</div>
              <div className="text-gray-600">4.3</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-vintage-ink">
                Emotional Impact
              </div>
              <div className="text-yellow-500 mt-1">★★★★★</div>
              <div className="text-gray-600">4.8</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-vintage-ink">Authenticity</div>
              <div className="text-yellow-500 mt-1">★★★★★</div>
              <div className="text-gray-600">4.6</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-vintage-ink">Relatability</div>
              <div className="text-yellow-500 mt-1">★★★★☆</div>
              <div className="text-gray-600">4.1</div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

StoryRating.displayName = "StoryRating";
