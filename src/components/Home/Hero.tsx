import { memo } from "react";
import { Button } from "../ui/Button";
import { PLATFORM_STATS } from "../../constants";

export const Hero = memo(() => {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        minHeight: "calc(100vh - 80px)",
      }}
      aria-label="Creator platform hero section"
      role="banner"
    >
      {/* Dynamic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Animated mesh pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Floating shapes for visual interest */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="container-custom relative z-10 flex items-center justify-center h-full px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center max-w-6xl mx-auto">
          {/* Live indicator */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 mb-8">
            <span className="animate-pulse">🟢</span>
            <span>500+ creators earning monthly</span>
          </div>

          {/* Main Title - The Blog Spot */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-playfair font-bold text-white mb-6 tracking-tight">
            The Blog Spot
          </h1>

          {/* Tagline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white leading-tight mb-8">
            Keep 90% of
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 block">
              Your Earnings
            </span>
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-200 font-source max-w-3xl mx-auto mb-12">
            The creator platform that puts you first. No complex analytics. No
            algorithm games. Just simple tools to monetize your content.
          </p>

          {/* Platform stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            {Object.entries({
              creators: {
                value: PLATFORM_STATS.creators,
                label: "Active Creators",
              },
              readers: {
                value: PLATFORM_STATS.monthlyReaders,
                label: "Monthly Readers",
              },
              earned: {
                value: PLATFORM_STATS.totalEarned,
                label: "Paid to Creators",
              },
              income: {
                value: PLATFORM_STATS.avgCreatorIncome,
                label: "Avg. Income",
              },
            }).map(([key, stat]) => (
              <div
                key={key}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
              >
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              href="/get-started"
              size="lg"
              className="px-8 py-4 text-lg font-bold shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-r from-yellow-400 to-pink-400 text-black hover:from-yellow-300 hover:to-pink-300"
            >
              Start Earning Today
            </Button>
            <Button
              href="/how-it-works"
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold border-white text-white hover:bg-white hover:text-purple-900"
            >
              See How It Works
            </Button>
          </div>

          <p className="text-sm text-gray-300">
            No credit card required • Start free, upgrade anytime
          </p>

          {/* Decorative elements */}
          <div className="absolute top-1/4 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
          <div className="absolute top-3/4 right-10 w-2 h-2 bg-pink-400 rounded-full animate-ping animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-4000" />
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";
