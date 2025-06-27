import { memo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../ui/Logo";
import { useApp } from "../../contexts/AppContext";

export const Header = memo(() => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { state, logout } = useApp();

  const navLinks = [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/creators", label: "Creators" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="relative z-50 bg-ink-black/20 backdrop-blur-md border-b border-warm-gray/5 shadow-sm">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 relative max-w-7xl mx-auto">
          {/* Desktop Navigation with Logo */}
          <div className="hidden md:flex items-center w-full justify-between">
            {/* Left section - Logo with more space */}
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center group flex-shrink-0 mr-8"
              >
                <Logo
                  size="nav"
                  className="text-lime-bright transition-transform duration-300 group-hover:scale-110"
                  style={{ height: "clamp(2rem, 3vw, 2.5rem)" }}
                />
              </Link>
            </div>

            {/* Center section - Navigation Links */}
            <div className="flex items-center space-x-6 flex-1 justify-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap touch-target ${
                    isActive(link.href)
                      ? "bg-electric-sage/10 text-electric-sage"
                      : "text-warm-gray hover:text-crisp-white hover:bg-charcoal"
                  }`}
                  style={{ fontSize: "clamp(0.875rem, 1vw, 1rem)" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right section - Auth buttons with more space */}
            <div className="flex items-center space-x-3 ml-8">
              {state.isAuthenticated ? (
                <>
                  <span
                    className="text-warm-gray whitespace-nowrap"
                    style={{ fontSize: "clamp(0.75rem, 0.9vw, 0.875rem)" }}
                  >
                    Welcome, {state.user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-warm-gray hover:text-electric-sage transition-colors duration-200 font-medium whitespace-nowrap touch-target px-3 py-1.5 rounded-lg"
                    style={{ fontSize: "clamp(0.875rem, 1vw, 1rem)" }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-warm-gray hover:text-electric-sage transition-colors duration-200 font-medium whitespace-nowrap touch-target px-3 py-1.5 rounded-lg"
                    style={{ fontSize: "clamp(0.875rem, 1vw, 1rem)" }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-electric-sage text-ink-black rounded-lg font-semibold hover:bg-electric-sage/90 hover:scale-105 transition-all duration-200 shadow-lg shadow-electric-sage/20 whitespace-nowrap touch-target"
                    style={{
                      fontSize: "clamp(0.875rem, 1vw, 1rem)",
                      padding:
                        "clamp(0.5rem, 0.8vw, 0.75rem) clamp(1rem, 1.5vw, 1.25rem)",
                    }}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Logo (hidden on desktop) */}
          <Link to="/" className="md:hidden flex items-center group">
            <Logo
              size="nav"
              className="text-lime-bright transition-transform duration-300 group-hover:scale-110"
              style={{ height: "clamp(1.75rem, 3vw, 2.25rem)" }}
            />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden absolute right-4 p-2 rounded-lg text-warm-gray hover:text-crisp-white hover:bg-charcoal transition-colors touch-target"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-warm-gray/10 safe-bottom">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 touch-target ${
                    isActive(link.href)
                      ? "bg-electric-sage/10 text-electric-sage"
                      : "text-warm-gray hover:text-crisp-white hover:bg-charcoal"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 space-y-3">
                {state.isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-warm-gray text-sm">
                      Welcome, {state.user?.name}
                    </div>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-center px-4 py-3 rounded-lg text-warm-gray hover:text-electric-sage transition-colors touch-target"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-center px-4 py-3 rounded-lg text-warm-gray hover:text-electric-sage transition-colors touch-target"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-center bg-electric-sage text-ink-black px-4 py-3 rounded-lg font-semibold hover:bg-electric-sage/90 transition-all duration-200 touch-target"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
});

Header.displayName = "Header";
