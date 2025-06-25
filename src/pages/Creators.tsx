import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { CREATOR_CATEGORIES } from "../constants";

const featuredCreators = [
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    niche: "Tech & Career",
    monthlyEarnings: "$3,200",
    subscribers: 850,
    quote: "I switched from Substack and doubled my income in 3 months.",
    avatar: "🚀",
    featured: true,
    growth: "+127%",
  },
  {
    id: "marcus-johnson",
    name: "Marcus Johnson",
    niche: "Poetry & Prose",
    monthlyEarnings: "$1,800",
    subscribers: 450,
    quote: "The 90% revenue share changed everything for me.",
    avatar: "✍️",
    featured: true,
    growth: "+89%",
  },
  {
    id: "elena-rodriguez",
    name: "Elena Rodriguez",
    niche: "Wellness Coaching",
    monthlyEarnings: "$5,400",
    subscribers: 180,
    quote: "I run workshops and courses with zero platform interference.",
    avatar: "🧘",
    featured: true,
    growth: "+203%",
  },
];

const allCreators = [
  ...featuredCreators,
  {
    id: "david-kim",
    name: "David Kim",
    niche: "Business & Finance",
    monthlyEarnings: "$2,100",
    subscribers: 320,
    quote: "Simple tools, powerful results.",
    avatar: "📊",
    growth: "+156%",
  },
  {
    id: "maria-santos",
    name: "Maria Santos",
    niche: "Art & Design",
    monthlyEarnings: "$1,950",
    subscribers: 280,
    quote: "Finally, a platform that gets creators.",
    avatar: "🎨",
    growth: "+98%",
  },
  {
    id: "james-wilson",
    name: "James Wilson",
    niche: "Health & Fitness",
    monthlyEarnings: "$2,800",
    subscribers: 520,
    quote: "Weekly payouts keep my business flowing.",
    avatar: "💪",
    growth: "+134%",
  },
];

export const Creators = memo(() => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCreators = allCreators.filter((creator) => {
    const matchesCategory =
      selectedCategory === "all" ||
      creator.niche.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.niche.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-ink-black text-crisp-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30"></div>

        <div className="relative z-10 container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
              Meet Our <span className="text-electric-sage">Creators</span>
            </h1>
            <p className="text-xl md:text-2xl text-warm-gray leading-relaxed mb-8">
              Real creators, real earnings, real success stories. See what's
              possible when you keep 90%.
            </p>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="glassmorphism rounded-xl p-4 backdrop-blur-xl border border-warm-gray/20">
                <div className="text-2xl font-bold text-electric-sage">
                  500+
                </div>
                <div className="text-sm text-warm-gray">Active Creators</div>
              </div>
              <div className="glassmorphism rounded-xl p-4 backdrop-blur-xl border border-warm-gray/20">
                <div className="text-2xl font-bold text-electric-sage">
                  $250K+
                </div>
                <div className="text-sm text-warm-gray">Total Earned</div>
              </div>
              <div className="glassmorphism rounded-xl p-4 backdrop-blur-xl border border-warm-gray/20">
                <div className="text-2xl font-bold text-electric-sage">90%</div>
                <div className="text-sm text-warm-gray">Revenue Share</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="py-20">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
              Featured{" "}
              <span className="text-electric-sage">Success Stories</span>
            </h2>
            <p className="text-xl text-warm-gray max-w-2xl mx-auto">
              These creators made the switch and never looked back.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {featuredCreators.map((creator) => (
              <div
                key={creator.id}
                className="glassmorphism rounded-2xl p-8 backdrop-blur-xl border border-warm-gray/20 hover:border-electric-sage/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-electric-sage/20 to-hot-coral/20 rounded-full flex items-center justify-center text-2xl">
                    {creator.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{creator.name}</h3>
                    <p className="text-warm-gray text-sm">{creator.niche}</p>
                  </div>
                  <div className="ml-auto">
                    <div className="bg-electric-sage/10 text-electric-sage px-2 py-1 rounded-full text-xs font-medium">
                      {creator.growth}
                    </div>
                  </div>
                </div>

                <blockquote className="text-warm-gray italic mb-6">
                  "{creator.quote}"
                </blockquote>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-electric-sage">
                      {creator.monthlyEarnings}
                    </div>
                    <div className="text-xs text-warm-gray">
                      Monthly Earnings
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-crisp-white">
                      {creator.subscribers}
                    </div>
                    <div className="text-xs text-warm-gray">Subscribers</div>
                  </div>
                </div>

                <Link
                  to={`/creator/${creator.id}`}
                  className="mt-6 block w-full text-center bg-charcoal hover:bg-electric-sage/10 border border-warm-gray/20 hover:border-electric-sage/50 text-warm-gray hover:text-electric-sage py-3 rounded-lg transition-all duration-200"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-16 bg-charcoal/50">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl mb-6">
                Discover More{" "}
                <span className="text-electric-sage">Creators</span>
              </h2>
              <p className="text-xl text-warm-gray">
                Find creators in your niche and see what's possible.
              </p>
            </div>

            {/* Search Bar */}
            <div className="glassmorphism rounded-xl p-6 backdrop-blur-xl border border-warm-gray/20 mb-8">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search creators by name or niche..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-transparent border-none outline-none text-crisp-white placeholder-warm-gray"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 mb-12 justify-center">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === "all"
                    ? "bg-electric-sage text-ink-black"
                    : "bg-charcoal/50 text-warm-gray hover:text-crisp-white hover:bg-charcoal"
                }`}
              >
                All Categories
              </button>
              {CREATOR_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.label)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.label
                      ? "bg-electric-sage text-ink-black"
                      : "bg-charcoal/50 text-warm-gray hover:text-crisp-white hover:bg-charcoal"
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>

            {/* Creator Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCreators.map((creator) => (
                <div
                  key={creator.id}
                  className="glassmorphism rounded-xl p-6 backdrop-blur-xl border border-warm-gray/20 hover:border-electric-sage/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-electric-sage/20 to-hot-coral/20 rounded-full flex items-center justify-center">
                      {creator.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold">{creator.name}</h3>
                      <p className="text-warm-gray text-sm">{creator.niche}</p>
                    </div>
                  </div>

                  <p className="text-warm-gray text-sm mb-4 italic">
                    "{creator.quote}"
                  </p>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-bold text-electric-sage">
                        {creator.monthlyEarnings}
                      </div>
                      <div className="text-xs text-warm-gray">/month</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-crisp-white">
                        {creator.subscribers}
                      </div>
                      <div className="text-xs text-warm-gray">subscribers</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="glassmorphism rounded-2xl p-12 backdrop-blur-xl border border-warm-gray/20 text-center">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
              Your Success Story{" "}
              <span className="text-electric-sage">Starts Here</span>
            </h2>
            <p className="text-xl text-warm-gray mb-8 max-w-2xl mx-auto">
              Join these successful creators and start building your empire with
              90% revenue share.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
          </div>
        </div>
      </section>
    </div>
  );
});

Creators.displayName = "Creators";

export default Creators;
