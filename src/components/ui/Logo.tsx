import { memo } from "react";
import { Link } from "react-router-dom";
import logoImage from "../../assets/svglogo.svg";

interface LogoProps {
  className?: string;
  linkClassName?: string;
  showText?: boolean;
  textColor?: "default" | "light";
  size?: "nav" | "large";
  style?: React.CSSProperties;
}

export const Logo = memo<LogoProps>(
  ({
    className = "",
    linkClassName = "",
    showText = false,
    textColor = "default",
    size = "large",
    style,
  }) => {
    const logoSizeClass =
      size === "nav"
        ? "h-full w-auto object-contain"
        : "h-[25rem] w-auto object-contain";

    return (
      <Link
        to="/"
        className={`flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-creative-teal/50 rounded-lg ${linkClassName}`}
        aria-label="The Blog Spot - Home"
      >
        {/* Logo Image */}
        <div className={`relative ${className}`} style={style}>
          <img
            src={logoImage}
            alt="The Blog Spot Logo"
            className={logoSizeClass}
          />
        </div>

        {/* Text Logo */}
        {showText && (
          <span
            className={`text-lg sm:text-7xl xl:text-8xl font-playfair font-bold whitespace-nowrap ${
              textColor === "light" ? "text-creative-teal" : "text-slate-ink"
            }`}
          >
            THE BLOG SPOT
          </span>
        )}
      </Link>
    );
  }
);

Logo.displayName = "Logo";
