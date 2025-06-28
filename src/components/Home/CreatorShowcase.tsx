import { memo } from "react";
import { Link } from "react-router-dom";
import { CREATOR_SUCCESS_STORIES, CREATOR_HERO_QUOTES } from "../../constants";
import { QuoteCarousel } from "../ui/QuoteCarousel";

export const CreatorShowcase = memo(() => {
  return (
    <section
      className="py-20 bg-ink-black"
      aria-label="Creator success stories"
    >
      <div className="container-custom px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-crisp-white mb-6">
            Medical Professionals{" "}
            <span className="text-medical-blue">Earning More</span>
          </h2>
          <p className="text-xl text-warm-gray max-w-2xl mx-auto">
            Real physicians creating sustainable income through medical education,
            CME courses, and case-based learning.
          </p>
        </div>

        {/* Quote Carousel */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="glassmorphism rounded-2xl p-8 backdrop-blur-xl border border-warm-gray/20">
            <QuoteCarousel
              quotes={CREATOR_HERO_QUOTES}
              interval={4000}
              autoPlay={true}
              className="h-[120px]"
              showControls={true}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {CREATOR_SUCCESS_STORIES.map((creator) => (
            <div
              key={creator.id}
              className="glassmorphism rounded-xl p-6 backdrop-blur-xl border border-warm-gray/20 hover:border-electric-sage/50 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-medical-blue/30 to-electric-sage/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-medical-blue" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm1-4a1 1 0 112 0v2a1 1 0 11-2 0V5zm0 8a1 1 0 112 0v2a1 1 0 11-2 0v-2z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-crisp-white text-lg">
                    {creator.name}
                  </h3>
                  <p className="text-sm text-warm-gray">{creator.niche}</p>
                  {creator.credentials && (
                    <p className="text-xs text-medical-blue mt-1">{creator.credentials}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-charcoal/50 rounded-lg p-3 text-center border border-warm-gray/20">
                  <div className="text-2xl font-bold text-medical-blue">
                    {creator.monthlyEarnings}
                  </div>
                  <div className="text-xs text-warm-gray">per month</div>
                </div>
                <div className="bg-charcoal/50 rounded-lg p-3 text-center border border-warm-gray/20">
                  <div className="text-2xl font-bold text-medical-blue">
                    {creator.subscribers}
                  </div>
                  <div className="text-xs text-warm-gray">learners</div>
                </div>
              </div>

              <blockquote className="text-warm-gray italic">
                "{creator.quote}"
              </blockquote>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/creators" className="btn-secondary">
            Browse Medical Creators
          </Link>
        </div>
      </div>
    </section>
  );
});

CreatorShowcase.displayName = "CreatorShowcase";
