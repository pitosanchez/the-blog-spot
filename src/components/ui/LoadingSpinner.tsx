import { memo } from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "pure-white";
  className?: string;
  "aria-label"?: string;
}

export const LoadingSpinner = memo<LoadingSpinnerProps>(
  ({
    size = "md",
    color = "primary",
    className = "",
    "aria-label": ariaLabel = "Loading content",
  }) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-8 h-8",
      lg: "w-12 h-12",
    };

    const colorClasses = {
      primary: "border-creative-teal border-t-transparent",
      secondary: "border-muted-blue-grey border-t-transparent",
      "pure-white": "border-pure-white border-t-transparent",
    };

    return (
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-2 rounded-full animate-spin ${className}`}
        role="status"
        aria-label={ariaLabel}
      >
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";
