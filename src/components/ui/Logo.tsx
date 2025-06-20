import { memo } from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  linkClassName?: string;
  showText?: boolean;
  textColor?: "default" | "light";
}

export const Logo = memo<LogoProps>(
  ({
    className = "",
    linkClassName = "",
    showText = true,
    textColor = "default",
  }) => {
    return (
      <Link
        to="/"
        className={`flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-bodega-brick focus:ring-opacity-50 rounded-lg ${linkClassName}`}
        aria-label="The Blog Spot - Home"
      >
        {/* Logo Icon Container */}
        <div className={`relative ${className}`}>
          {/* Speech Bubble Background */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-storyteller-cream rounded-2xl flex items-center justify-center shadow-sm">
            {/* Speech Bubble Tail */}
            <div className="absolute -bottom-2 left-3 w-4 h-4 bg-storyteller-cream transform rotate-45 rounded-sm"></div>

            {/* Pen Icon */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8"
              aria-hidden="true"
            >
              {/* Pen Nib */}
              <path
                d="M12 2L7 7L12 22L17 7L12 2Z"
                fill="#4A2C2A"
                stroke="#4A2C2A"
                strokeWidth="1"
                strokeLinejoin="round"
              />
              {/* Pen Tip Detail */}
              <circle cx="12" cy="8" r="1.5" fill="#FAFAF0" />
              {/* Pen Top */}
              <rect x="11" y="1" width="2" height="2" fill="#4A2C2A" rx="0.5" />
            </svg>
          </div>
        </div>

        {/* Text Logo */}
        {showText && (
          <div className="flex flex-col items-start">
            <span
              className={`text-lg sm:text-xl lg:text-2xl font-playfair font-bold leading-tight ${
                textColor === "light" ? "text-bodega-brick" : "text-vintage-ink"
              }`}
            >
              THE
            </span>
            <span
              className={`text-lg sm:text-xl lg:text-2xl font-playfair font-bold leading-tight -mt-1 ${
                textColor === "light" ? "text-bodega-brick" : "text-vintage-ink"
              }`}
            >
              BLOG
            </span>
            <span
              className={`text-lg sm:text-xl lg:text-2xl font-playfair font-bold leading-tight -mt-1 ${
                textColor === "light" ? "text-bodega-brick" : "text-vintage-ink"
              }`}
            >
              SPOT
            </span>
          </div>
        )}
      </Link>
    );
  }
);

Logo.displayName = "Logo";
