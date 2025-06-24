import { useState, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import type { NavigationProps } from "../../types";

const MobileNavigation = memo<NavigationProps>(({ isOpen, onToggle }) => {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
      <nav
        className="flex flex-col space-y-1 font-source text-base px-4 py-4 max-h-[80vh] overflow-y-auto"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <Link
          to="/"
          className="hover:bg-gray-50 hover:text-bodega-brick text-vintage-ink transition-all duration-200 py-3 px-3 rounded-lg font-medium"
          onClick={onToggle}
        >
          Home
        </Link>
        <Link
          to="/how-it-works"
          className="hover:bg-gray-50 hover:text-bodega-brick text-vintage-ink transition-all duration-200 py-3 px-3 rounded-lg font-medium"
          onClick={onToggle}
        >
          How It Works
        </Link>
        <Link
          to="/creators"
          className="hover:bg-gray-50 hover:text-bodega-brick text-vintage-ink transition-all duration-200 py-3 px-3 rounded-lg font-medium"
          onClick={onToggle}
        >
          Browse Creators
        </Link>
        <Link
          to="/pricing"
          className="hover:bg-gray-50 hover:text-bodega-brick text-vintage-ink transition-all duration-200 py-3 px-3 rounded-lg font-medium"
          onClick={onToggle}
        >
          Pricing
        </Link>
        <Link
          to="/resources"
          className="hover:bg-gray-50 hover:text-bodega-brick text-vintage-ink transition-all duration-200 py-3 px-3 rounded-lg font-medium"
          onClick={onToggle}
        >
          Resources
        </Link>

        <div className="pt-4 border-t border-gray-200 mt-4 space-y-2">
          <Button
            href="/login"
            variant="outline"
            size="md"
            className="w-full"
            onClick={onToggle}
          >
            Log In
          </Button>
          <Button
            href="/get-started"
            variant="primary"
            size="md"
            className="w-full"
            onClick={onToggle}
          >
            Start Earning
          </Button>
        </div>
      </nav>
    </div>
  );
});

MobileNavigation.displayName = "MobileNavigation";

export const Header = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isScrolled } = useScrollPosition({ throttleMs: 100 });

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <header
      className={`bg-white border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-lg bg-white/95 backdrop-blur-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center justify-between h-16 lg:h-20"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Logo showText={true} />

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center flex-1 justify-center">
            <ul className="flex items-center space-x-1 font-source text-base font-medium">
              <li>
                <Link
                  to="/how-it-works"
                  className="hover:bg-gray-50 hover:text-bodega-brick text-vintage-ink transition-all duration-200 px-4 py-2 rounded-lg"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/creators"
                  className="hover:bg-gray-50 hover:text-bodega-brick text-vintage-ink transition-all duration-200 px-4 py-2 rounded-lg"
                >
                  Creators
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="hover:bg-gray-50 hover:text-bodega-brick text-vintage-ink transition-all duration-200 px-4 py-2 rounded-lg"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="hover:bg-gray-50 hover:text-bodega-brick text-vintage-ink transition-all duration-200 px-4 py-2 rounded-lg"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button href="/login" variant="ghost" size="sm">
              Log In
            </Button>
            <Button href="/get-started" variant="primary" size="sm">
              Start Earning
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-vintage-ink hover:text-bodega-brick hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-bodega-brick focus:ring-opacity-50 rounded-lg p-2"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div id="mobile-menu">
        <MobileNavigation isOpen={isMenuOpen} onToggle={toggleMenu} />
      </div>
    </header>
  );
});

Header.displayName = "Header";
