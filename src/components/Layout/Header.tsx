import { useState } from "react";

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
        <a
          href="/"
          className="text-3xl font-display font-bold text-vintage-ink tracking-tight"
        >
          The Blog Spot
        </a>
        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8 font-accent text-lg items-center">
          <li>
            <a
              href="/"
              className="hover:text-bodega-brick text-community-teal transition"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/about"
              className="hover:text-bodega-brick text-community-teal transition"
            >
              About Us
            </a>
          </li>
          <li className="relative group">
            <a
              href="/our-stories"
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
            </a>
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
                    <a
                      href={item.href}
                      className="block px-4 py-2 hover:bg-community-teal hover:text-storyteller-cream rounded transition"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li>
            <a
              href="/community"
              className="hover:text-bodega-brick text-community-teal transition"
            >
              Community
            </a>
          </li>
          <li>
            <a
              href="/support"
              className="hover:text-bodega-brick text-community-teal transition"
            >
              Support
            </a>
          </li>
          <li>
            <a
              href="/shop"
              className="hover:text-bodega-brick text-community-teal transition"
            >
              Shop
            </a>
          </li>
          <li>
            <a
              href="/contact"
              className="hover:text-bodega-brick text-community-teal transition"
            >
              Contact
            </a>
          </li>
        </ul>
        {/* Submit a Story Button */}
        <a href="/submit" className="btn-primary ml-4 hidden md:inline-block">
          Submit a Story
        </a>
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
              <a
                href="/"
                className="hover:text-bodega-brick text-community-teal transition"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="hover:text-bodega-brick text-community-teal transition"
              >
                About Us
              </a>
            </li>
            <li>
              <details>
                <summary>
                  <a
                    href="/our-stories"
                    className="hover:text-bodega-brick text-community-teal transition cursor-pointer"
                  >
                    Our Stories
                  </a>
                </summary>
                <ul className="pl-4 mt-2">
                  {storiesMenu.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="block py-1 hover:text-bodega-brick text-community-teal transition"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
            <li>
              <a
                href="/community"
                className="hover:text-bodega-brick text-community-teal transition"
              >
                Community
              </a>
            </li>
            <li>
              <a
                href="/support"
                className="hover:text-bodega-brick text-community-teal transition"
              >
                Support
              </a>
            </li>
            <li>
              <a
                href="/shop"
                className="hover:text-bodega-brick text-community-teal transition"
              >
                Shop
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="hover:text-bodega-brick text-community-teal transition"
              >
                Contact
              </a>
            </li>
            <li className="pt-2">
              <a href="/submit" className="btn-primary w-full">
                Submit a Story
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};
