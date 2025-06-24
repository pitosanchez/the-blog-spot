import { memo } from "react";
import { CREATOR_SUCCESS_STORIES, CREATOR_HERO_QUOTES } from "../../constants";
import { Button } from "../ui/Button";
import { QuoteCarousel } from "../ui/QuoteCarousel";

export const CreatorShowcase = memo(() => {
  return (
    <section
      className="py-16 md:py-24 bg-white"
      aria-label="Creator success stories"
    >
      <div className="container-custom px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-vintage-ink mb-4">
            Creators Earning Their Worth
          </h2>
          <p className="text-lg text-warm-gray-700 max-w-2xl mx-auto">
            Real creators, real earnings. No inflated numbers, just honest
            success stories.
          </p>
        </div>

        {/* Quote Carousel */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-cream rounded-2xl shadow-lg p-8 border border-warm-gray-100">
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
              className="bg-cream rounded-xl p-6 border border-warm-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-community-teal to-bodega-brick flex items-center justify-center text-white font-bold text-xl">
                  {creator.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-source font-bold text-vintage-ink text-lg">
                    {creator.name}
                  </h3>
                  <p className="text-sm text-warm-gray-600">{creator.niche}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-community-teal">
                    {creator.monthlyEarnings}
                  </div>
                  <div className="text-xs text-warm-gray-600">per month</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-bodega-brick">
                    {creator.subscribers}
                  </div>
                  <div className="text-xs text-warm-gray-600">subscribers</div>
                </div>
              </div>

              <blockquote className="text-warm-gray-700 italic">
                "{creator.quote}"
              </blockquote>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button href="/creators" variant="outline" size="lg">
            Browse All Creators
          </Button>
        </div>
      </div>
    </section>
  );
});

CreatorShowcase.displayName = "CreatorShowcase";
