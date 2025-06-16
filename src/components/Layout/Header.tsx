import { useState } from "react";
import { Link } from "react-router-dom";

const storiesMenu = [
  { label: "Cornerstore Confessions", href: "/cornerstore-confessions" },
  { label: "Letters to My Younger Self", href: "/letters-to-my-younger-self" },
  { label: "First Times", href: "/first-times" },
  { label: "Love", href: "/love" },
  { label: "Relationships", href: "/relationships" },
  { label: "Family & Community", href: "/family-community" },
  { label: "Triumph & Survival", href: "/triumph-survival" },
  { label: "Overcoming", href: "/overcoming" },
  { label: "Illness", href: "/illness" },
  { label: "Loneliness", href: "/loneliness" },
  { label: "Environment", href: "/environment" },
  { label: "Spirituality", href: "/spirituality" },
  { label: "Kindness", href: "/kindness" },
  { label: "Roots & Heritage", href: "/roots-heritage" },
  { label: "Humor & Joy", href: "/humor-joy" },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);

  return (
    <header className="bg-storyteller-cream border-b border-community-teal sticky top-0 z-50">
      <nav className="container-custom flex items-center justify-between py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-display font-bold text-vintage-ink tracking-tight"
        >
          The Blog Spot
        </Link>
        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8 font-accent text-lg items-center">
          <li>
            <Link
              to="/"
              className="hover:text-bodega-brick text-community-teal transition"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="hover:text-bodega-brick text-community-teal transition"
            >
              About Us
            </Link>
          </li>
          <li className="relative group">
            <Link
              to="/our-stories"
              className="hover:text-bodega-brick text-community-teal transition flex items-center gap-1"
              onMouseEnter={() => setIsStoriesOpen(true)}
              onMouseLeave={() => setIsStoriesOpen(false)}
              onFocus={() => setIsStoriesOpen(true)}
              onBlur={() => setIsStoriesOpen(false)}
            >
              Our Stories
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Link>
            {/* Dropdown */}
            <div
              className={`absolute left-0 mt-2 w-64 bg-storyteller-cream shadow-lg rounded-lg border border-community-teal transition-opacity duration-200 z-20 ${
                isStoriesOpen ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
              onMouseEnter={() => setIsStoriesOpen(true)}
              onMouseLeave={() => setIsStoriesOpen(false)}
            >
              <ul className="py-2">
                {storiesMenu.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="block px-4 py-2 hover:bg-community-teal hover:text-storyteller-cream rounded transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li>
            <Link
              to="/community"
              className="hover:text-bodega-brick text-community-teal transition"
            >
              Community
            </Link>
          </li>
          <li>
            <Link
              to="/support"
              className="hover:text-bodega-brick text-community-teal transition"
            >
              Support
            </Link>
          </li>
          <li>
            <Link
              to="/shop"
              className="hover:text-bodega-brick text-community-teal transition"
            >
              Shop
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="hover:text-bodega-brick text-community-teal transition"
            >
              Contact
            </Link>
          </li>
        </ul>
        {/* Submit a Story Button */}
        <Link to="/submit" className="btn-primary ml-4 hidden md:inline-block">
          Submit a Story
        </Link>
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-community-teal hover:text-bodega-brick"
          >
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
        </div>
      </nav>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-storyteller-cream border-t border-community-teal pb-6">
          <ul className="flex flex-col space-y-2 font-accent text-lg px-6 pt-4">
            <li>
              <Link
                to="/"
                className="hover:text-bodega-brick text-community-teal transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-bodega-brick text-community-teal transition"
              >
                About Us
              </Link>
            </li>
            <li>
              <details>
                <summary>
                  <Link
                    to="/our-stories"
                    className="hover:text-bodega-brick text-community-teal transition cursor-pointer"
                  >
                    Our Stories
                  </Link>
                </summary>
                <ul className="pl-4 mt-2">
                  {storiesMenu.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className="block py-1 hover:text-bodega-brick text-community-teal transition"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
            <li>
              <Link
                to="/community"
                className="hover:text-bodega-brick text-community-teal transition"
              >
                Community
              </Link>
            </li>
            <li>
              <Link
                to="/support"
                className="hover:text-bodega-brick text-community-teal transition"
              >
                Support
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                className="hover:text-bodega-brick text-community-teal transition"
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-bodega-brick text-community-teal transition"
              >
                Contact
              </Link>
            </li>
            <li className="pt-2">
              <Link to="/submit" className="btn-primary w-full">
                Submit a Story
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};
