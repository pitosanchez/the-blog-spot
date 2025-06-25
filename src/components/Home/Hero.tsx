import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PLATFORM_STATS } from "../../constants";

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
      <div className="absolute inset-0 gradient-mesh opacity-40"></div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-electric-sage/20 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-hot-coral/20 rounded-full filter blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lime-bright/10 rounded-full filter blur-3xl animate-float animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container-wide px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left side - Typography */}
          <div
            className={`lg:col-span-7 space-y-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Main headline */}
            <div className="space-y-4">
              <h1 className="font-display font-black text-responsive-hero leading-[0.85] tracking-tighter">
                <span className="block text-crisp-white">THE BLOG</span>
                <span className="block text-electric-sage glow-sage">SPOT</span>
              </h1>

              {/* Animated tagline */}
              <div className="h-12 relative overflow-hidden">
                <p
                  className="font-serif text-2xl md:text-3xl text-warm-gray absolute w-full transition-all duration-500"
                  style={{
                    transform: `translateY(${currentWordIndex * -100}%)`,
                  }}
                >
                  {words.map((word) => (
                    <span key={word} className="block h-12">
                      Your {word}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            {/* Subheadline */}
            <p className="text-lg md:text-xl lg:text-2xl text-warm-gray leading-relaxed max-w-2xl">
              Join the creator monetization platform where you keep{" "}
              <span className="text-electric-sage font-bold">
                90% of your earnings
              </span>
              . Build your audience, share your stories, and turn your passion
              into profit.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/get-started"
                className="btn-coral group relative overflow-hidden"
              >
                <span className="relative z-10">Start Creating Today</span>
                <div className="absolute inset-0 bg-gradient-to-r from-hot-coral to-electric-sage opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link to="/how-it-works" className="btn-secondary">
                See How It Works
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-warm-gray pt-4">
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-electric-sage"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-electric-sage"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                $25 minimum payout
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-electric-sage"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Weekly payouts
              </span>
            </div>
          </div>

          {/* Right side - Featured content card */}
          <div
            className={`lg:col-span-5 transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative">
              {/* Floating card with glassmorphism */}
              <div className="glassmorphism rounded-2xl p-8 backdrop-blur-xl border border-warm-gray/20 shadow-2xl hover:shadow-electric-sage/20 transition-all duration-300 hover:scale-[1.02]">
                {/* Live indicator */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-electric-sage rounded-full animate-pulse"></div>
                  <span className="text-xs text-electric-sage font-medium uppercase tracking-wider">
                    Live Stats
                  </span>
                </div>

                {/* Stats grid */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-warm-gray">Revenue Share</span>
                      <span className="text-4xl font-bold text-electric-sage">
                        90%
                      </span>
                    </div>
                    <div className="h-2 bg-charcoal rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-electric-sage to-lime-bright rounded-full w-[90%] animate-pulse"></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-warm-gray">Active Creators</span>
                      <span className="text-2xl font-bold text-crisp-white">
                        {PLATFORM_STATS.creators}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-warm-gray">Monthly Readers</span>
                      <span className="text-2xl font-bold text-crisp-white">
                        {PLATFORM_STATS.monthlyReaders}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-warm-gray">Creator Earnings</span>
                      <span className="text-2xl font-bold text-crisp-white">
                        {PLATFORM_STATS.totalEarned}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="mt-8 pt-6 border-t border-warm-gray/20">
                  <p className="text-sm text-warm-gray">
                    Join creators earning{" "}
                    <span className="text-electric-sage font-semibold">
                      {PLATFORM_STATS.avgCreatorIncome}
                    </span>{" "}
                    on average
                  </p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-electric-sage/20 rounded-full filter blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-hot-coral/20 rounded-full filter blur-2xl"></div>
            </div>
          </div>
        </div>

        {/* Bottom features strip */}
        <div
          className={`mt-20 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="glassmorphism rounded-xl p-6 backdrop-blur-xl border border-warm-gray/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-electric-sage text-4xl font-bold">
                  60fps
                </div>
                <div className="text-warm-gray text-sm">Smooth animations</div>
              </div>
              <div className="space-y-2">
                <div className="text-electric-sage text-4xl font-bold">
                  1.5s
                </div>
                <div className="text-warm-gray text-sm">Page load time</div>
              </div>
              <div className="space-y-2">
                <div className="text-electric-sage text-4xl font-bold">100</div>
                <div className="text-warm-gray text-sm">Lighthouse score</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-electric-sage rounded-full flex justify-center">
          <div className="w-1 h-3 bg-electric-sage rounded-full mt-2"></div>
        </div>
      </div>

      {/* Keyboard shortcut hint */}
      <div className="absolute bottom-8 right-8 hidden lg:block">
        <div className="glassmorphism px-4 py-2 rounded-lg backdrop-blur-xl border border-warm-gray/20 text-xs text-warm-gray">
          Press{" "}
          <kbd className="px-2 py-1 bg-charcoal rounded text-electric-sage font-mono">
            ⌘K
          </kbd>{" "}
          for quick actions
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";
