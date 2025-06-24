import { memo, useState } from "react";
import { SEOHead } from "../components/SEO/SEOHead";
import { Button } from "../components/ui/Button";
import { CREATOR_CATEGORIES, CREATOR_SUCCESS_STORIES } from "../constants";

const Creators = memo(() => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data for additional creators
  const allCreators = [
    ...CREATOR_SUCCESS_STORIES,
    {
      id: "alex-kim",
      name: "Alex Kim",
      niche: "Tech Tutorials",
      monthlyEarnings: "$2,100",
      subscribers: 520,
      quote: "Finally, a platform that values creators.",
    },
    {
      id: "maria-santos",
      name: "Maria Santos",
      niche: "Food & Culture",
      monthlyEarnings: "$1,500",
      subscribers: 380,
      quote: "The weekly payouts changed my life.",
    },
    {
      id: "james-wright",
      name: "James Wright",
      niche: "Personal Finance",
      monthlyEarnings: "$4,200",
      subscribers: 890,
      quote: "90% revenue share means I can quit my day job.",
    },
  ];

  return (
    <>
      <SEOHead
        title="Browse Creators - The Blog Spot"
        description="Discover talented creators across writing, coaching, art, and more. Support independent creators who keep 90% of their earnings."
      />

      <div className="min-h-screen bg-gradient-to-b from-white to-cream">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-vintage-ink mb-6">
                Discover Amazing Creators
              </h1>
              <p className="text-xl text-warm-gray-700 mb-8">
                Support independent voices. Every subscription helps a creator
                earn their worth.
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-cream sticky top-20 z-40 shadow-md">
          <div className="container-custom px-4 md:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === "all"
                    ? "bg-vintage-ink text-white"
                    : "bg-white text-vintage-ink hover:bg-warm-gray-100"
                }`}
              >
                All Creators
              </button>
              {CREATOR_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category.id
                      ? "bg-vintage-ink text-white"
                      : "bg-white text-vintage-ink hover:bg-warm-gray-100"
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Creators Grid */}
        <section className="py-16 md:py-24">
          <div className="container-custom px-4 md:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allCreators.map((creator) => (
                <div
                  key={creator.id}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-warm-gray-100"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-community-teal to-bodega-brick flex items-center justify-center text-white font-bold text-2xl">
                      {creator.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-source font-bold text-vintage-ink text-xl">
                        {creator.name}
                      </h3>
                      <p className="text-warm-gray-600">{creator.niche}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-cream rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-community-teal">
                        {creator.monthlyEarnings}
                      </div>
                      <div className="text-xs text-warm-gray-600">
                        per month
                      </div>
                    </div>
                    <div className="bg-cream rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-bodega-brick">
                        {creator.subscribers}
                      </div>
                      <div className="text-xs text-warm-gray-600">
                        subscribers
                      </div>
                    </div>
                  </div>

                  {creator.quote && (
                    <blockquote className="text-warm-gray-700 italic mb-4">
                      "{creator.quote}"
                    </blockquote>
                  )}

                  <Button
                    href={`/creator/${creator.id}`}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    View Profile
                  </Button>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <Button variant="secondary" size="lg">
                Load More Creators
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-vintage-ink to-warm-gray-900 text-white">
          <div className="container-custom px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-6">
                Ready to Join These Successful Creators?
              </h2>
              <p className="text-xl mb-8 text-warm-gray-200">
                Start earning 90% of your content revenue today.
              </p>
              <Button
                href="/get-started"
                size="lg"
                className="bg-community-teal hover:bg-community-teal-dark text-white"
              >
                Become a Creator
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
});

export default Creators;
