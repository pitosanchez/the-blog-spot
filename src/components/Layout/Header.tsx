import React, { useState, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { STORIES_MENU } from "../../constants";
import type { NavigationProps } from "../../types";

const MobileNavigation = memo<NavigationProps>(({ isOpen, onToggle }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
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
          to="/about"
          className="hover:bg-gray-50 hover:text-bodega-brick text-vintage-ink transition-all duration-200 py-3 px-3 rounded-lg font-medium"
          onClick={onToggle}
        >
          About Us
        </Link>
        <Link
          to="/membership"
          className="hover:bg-gray-50 hover:text-bodega-brick text-vintage-ink transition-all duration-200 py-3 px-3 rounded-lg font-medium"
          onClick={onToggle}
        >
          Membership
        </Link>

        <details className="group">
          <summary className="hover:bg-gray-50 hover:text-bodega-brick text-vintage-ink transition-all duration-200 cursor-pointer py-3 px-3 rounded-lg font-medium list-none">
            <span className="flex items-center justify-between">
              Our Stories
              <svg
                className="w-4 h-4 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </summary>
          <div className="pl-6 mt-2 space-y-1 border-l-2 border-gray-100">
            {STORIES_MENU.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block py-2 px-3 hover:bg-gray-50 hover:text-bodega-brick text-gray-600 transition-all duration-200 rounded-lg text-sm"
                onClick={onToggle}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </details>

        {["Community", "Support", "Shop", "Contact"].map((item) => (
          <Link
            key={item}
            to={`/${item.toLowerCase()}`}
            className="hover:bg-gray-50 hover:text-bodega-brick text-vintage-ink transition-all duration-200 py-3 px-3 rounded-lg font-medium"
            onClick={onToggle}
          >
            {item}
          </Link>
        ))}

        <div className="pt-4 border-t border-gray-200 mt-4">
          <Button
            href="/submit"
            variant="primary"
            size="md"
            className="w-full"
            onClick={onToggle}
          >
            Submit a Story
          </Button>
        </div>
      </nav>
    </div>
  );
});

MobileNavigation.displayName = "MobileNavigation";

export const Header = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);
  const { isScrolled } = useScrollPosition({ throttleMs: 100 });

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeStoriesMenu = useCallback(() => {
    setIsStoriesOpen(false);
  }, []);

  const openStoriesMenu = useCallback(() => {
    setIsStoriesOpen(true);
  }, []);

  const handleStoriesBlur = useCallback((e: React.FocusEvent) => {
    // Close dropdown if focus moves outside the stories menu
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsStoriesOpen(false);
    }
  }, []);

  return (
    <header
      className={`bg-white border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-lg bg-white/95 backdrop-blur-md" : "shadow-sm"
      }`}
    >
      <nav
        className="container-custom flex items-center justify-between py-4 lg:py-5"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Logo showText={true} />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          <ul className="flex items-center space-x-1 font-source text-base font-medium">
            <li>
              <Link
                to="/"
                className="hover:bg-gray-50 hover:text-bodega-brick text-vintage-ink transition-all duration-200 px-4 py-2 rounded-lg"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:bg-gray-50 hover:text-bodega-brick text-vintage-ink transition-all duration-200 px-4 py-2 rounded-lg"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/membership"
                className="hover:bg-gray-50 hover:text-bodega-brick text-vintage-ink transition-all duration-200 px-4 py-2 rounded-lg"
              >
                Membership
              </Link>
            </li>

            <li className="relative">
              <button
                className="hover:bg-gray-50 hover:text-bodega-brick text-vintage-ink transition-all duration-200 flex items-center gap-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-bodega-brick focus:ring-opacity-50"
                onMouseEnter={openStoriesMenu}
                onMouseLeave={closeStoriesMenu}
                onFocus={openStoriesMenu}
                onBlur={handleStoriesBlur}
                aria-expanded={isStoriesOpen}
                aria-haspopup="true"
                aria-label="Our Stories menu"
              >
                Our Stories
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isStoriesOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown */}
              <div
                className={`absolute left-0 mt-1 w-72 bg-white shadow-xl rounded-xl border border-gray-200 transition-all duration-200 z-20 ${
                  isStoriesOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }`}
                onMouseEnter={openStoriesMenu}
                onMouseLeave={closeStoriesMenu}
                role="menu"
                aria-label="Stories submenu"
              >
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    Story Categories
                  </div>
                  <ul className="py-1" role="none">
                    {STORIES_MENU.map((item) => (
                      <li key={item.href} role="none">
                        <Link
                          to={item.href}
                          className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-bodega-brick text-vintage-ink transition-all duration-200 focus:outline-none focus:bg-gray-50 focus:text-bodega-brick"
                          role="menuitem"
                          onClick={closeStoriesMenu}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>

            {["Community", "Support", "Shop", "Contact"].map((item) => (
              <li key={item}>
                <Link
                  to={`/${item.toLowerCase()}`}
                  className="hover:bg-gray-50 hover:text-bodega-brick text-vintage-ink transition-all duration-200 px-4 py-2 rounded-lg"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          {/* Submit a Story Button */}
          <div className="ml-6 pl-6 border-l border-gray-200">
            <Button href="/submit" variant="primary" size="md">
              Submit a Story
            </Button>
          </div>
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

      {/* Mobile Menu */}
      <div id="mobile-menu">
        <MobileNavigation isOpen={isMenuOpen} onToggle={toggleMenu} />
      </div>
    </header>
  );
});

Header.displayName = "Header";
