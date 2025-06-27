import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/blgspt.webp";

export const Hero = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ["Stories", "Success", "Future"];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink-black">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 gradient-mesh opacity-30"></div>

      {/* Animated gradient orbs - subtle */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-5 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-electric-sage/10 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-5 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-hot-coral/10 rounded-full filter blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-lime-bright/5 rounded-full filter blur-3xl animate-float animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        <div className="flex flex-col items-center justify-center text-center w-full">
          {/* Main content - centered */}
          <div
            className={`w-full flex flex-col items-center justify-center space-y-4 sm:space-y-6 lg:space-y-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Hero Image - Massive focal point */}
            <div className="w-full max-w-7xl flex justify-center px-0">
              <img
                src={heroImage}
                alt="The Blog Spot"
                className="w-full h-auto max-h-[55vh] sm:max-h-[65vh] md:max-h-[70vh] lg:max-h-[75vh] xl:max-h-[80vh] object-contain rounded-lg shadow-2xl"
                style={{
                  filter: "drop-shadow(0 0 60px rgba(0, 255, 136, 0.2))",
                }}
              />
            </div>

            {/* Tagline with animated words - centered and condensed */}
            <div className="flex flex-col items-center justify-center space-y-2 mt-2">
              <h2 className="font-display font-black text-responsive-xl sm:text-5xl lg:text-6xl xl:text-7xl leading-none tracking-tight">
                <span className="text-crisp-white">
                  Monetize Your{" "}
                  <span className="text-electric-sage glow-sage inline-block">
                    {words[currentWordIndex]}
                  </span>
                </span>
              </h2>
            </div>

            {/* Value proposition - centered and concise */}
            <div className="flex flex-col items-center text-center space-y-2 max-w-3xl">
              <p className="text-responsive-lg sm:text-2xl lg:text-3xl text-crisp-white font-bold">
                Keep{" "}
                <span className="text-electric-sage font-black glow-sage">
                  90% of your earnings
                </span>
              </p>
              <p className="text-responsive-base sm:text-lg lg:text-xl text-warm-gray/90 max-w-2xl">
                The creator platform that puts you first. Build your audience,
                share your stories, turn passion into income.
              </p>
            </div>

            {/* CTA Buttons - centered */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <Link
                to="/get-started"
                className="btn-coral group relative overflow-hidden px-8 py-4 text-responsive-base sm:text-lg font-bold w-full sm:w-auto min-w-[200px] transition-transform hover:scale-105"
              >
                <span className="relative z-10">Start Earning Today</span>
                <div className="absolute inset-0 bg-gradient-to-r from-hot-coral to-electric-sage opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/how-it-works"
                className="btn-secondary px-8 py-4 text-responsive-base sm:text-lg font-medium w-full sm:w-auto min-w-[200px] transition-transform hover:scale-105"
              >
                How It Works
              </Link>
            </div>

            {/* Trust indicators - centered and compact */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-2xl pt-4">
              <div className="flex flex-col items-center text-center space-y-1 p-3">
                <div className="w-10 h-10 bg-electric-sage/10 rounded-full flex items-center justify-center mb-1">
                  <svg
                    className="w-5 h-5 text-electric-sage"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-crisp-white font-bold text-sm sm:text-base">
                  Free to Start
                </span>
                <span className="text-warm-gray text-xs sm:text-sm">
                  No credit card
                </span>
              </div>
              <div className="flex flex-col items-center text-center space-y-1 p-3">
                <div className="w-10 h-10 bg-electric-sage/10 rounded-full flex items-center justify-center mb-1">
                  <svg
                    className="w-5 h-5 text-electric-sage"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-crisp-white font-bold text-sm sm:text-base">
                  $25 Minimum
                </span>
                <span className="text-warm-gray text-xs sm:text-sm">
                  Low payout threshold
                </span>
              </div>
              <div className="flex flex-col items-center text-center space-y-1 p-3">
                <div className="w-10 h-10 bg-electric-sage/10 rounded-full flex items-center justify-center mb-1">
                  <svg
                    className="w-5 h-5 text-electric-sage"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-crisp-white font-bold text-sm sm:text-base">
                  Weekly Payouts
                </span>
                <span className="text-warm-gray text-xs sm:text-sm">
                  Get paid fast
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-5 h-8 border-2 border-electric-sage/50 rounded-full flex justify-center">
          <div className="w-0.5 h-2 bg-electric-sage rounded-full mt-1.5"></div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";
