import { memo } from "react";
import { Button } from "../ui/Button";
import { QuoteCarousel } from "../ui/QuoteCarousel";
import { HERO_QUOTES } from "../../constants";
import heroBg from "../../assets/blogspot-hero.png";

export const Hero = memo(() => {
  return (
    <section
      className="relative flex items-center justify-center border-b-4 border-bodega-brick overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${heroBg})`,
        height: "calc(100vh - 80px)", // Account for header height
        minHeight: "600px", // Minimum height to ensure content fits
        maxHeight: "calc(100vh - 80px)",
      }}
      aria-label="Hero section with featured content and notebook background"
      role="banner"
    >
      {/* Background image description for screen readers */}
      <div className="sr-only">
        Background image shows an open notebook with a pen, symbolizing
        storytelling and writing
      </div>

      {/* Baby blue overlay for cool tint */}
      <div className="absolute inset-0 bg-blue-200/40" aria-hidden="true" />

      <div className="container-custom relative z-10 flex items-center justify-center h-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Main content - centered */}
        <div className="flex flex-col justify-center items-center text-center space-y-4 md:space-y-5 max-w-4xl">
          <header className="w-full">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-playfair font-bold text-vintage-ink leading-tight mb-3 md:mb-4 drop-shadow-lg"
              role="banner"
            >
              Every Story Matters.
              <br />
              <span className="text-bodega-brick">Every Voice Belongs.</span>
            </h1>

            <p
              className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white font-source font-bold mb-3 md:mb-4 leading-snug drop-shadow-2xl shadow-black max-w-4xl mx-auto"
              role="complementary"
              aria-describedby="hero-description"
            >
              The Blog Spot is a home for real stories, memories, and truths
              from people of every background. Whether you're sharing a poem, a
              photo essay, a confession, or a family recipe—your voice is
              welcome here.
            </p>

            <p
              id="hero-description"
              className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white font-source font-bold mb-4 md:mb-5 leading-snug drop-shadow-2xl shadow-black max-w-3xl mx-auto"
            >
              All backgrounds. All experiences. All forms. Share your truth,
              your humor, your heart—your way.
            </p>
          </header>

          {/* Rotating Quotes Section */}
          <div className="w-full max-w-lg lg:max-w-xl">
            <QuoteCarousel
              quotes={HERO_QUOTES}
              interval={5000}
              autoPlay={true}
              className="mb-4 md:mb-5 w-full h-[70px] sm:h-[80px] md:h-[90px] lg:h-[100px]"
              showControls={false}
              aria-label="Inspirational quotes carousel"
            />
          </div>

          <div className="w-full flex justify-center pt-2">
            <Button
              href="/submit"
              size="lg"
              className="px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 font-source rounded-full w-[200px] sm:w-[220px] md:w-[260px] focus:outline-none focus:ring-4 focus:ring-bodega-brick focus:ring-opacity-50"
              aria-label="Submit your story to The Blog Spot"
            >
              Share Your Story
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";
