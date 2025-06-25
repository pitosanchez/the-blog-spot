import { memo, useState } from "react";
import { Link } from "react-router-dom";

export const CreatorCTA = memo(() => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Email submitted:", email);
  };

  return (
    <section className="py-20 bg-charcoal/50">
      <div className="container-custom px-4 md:px-6 lg:px-8">
        <div className="glassmorphism rounded-2xl p-12 backdrop-blur-xl border border-warm-gray/20 text-center">
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-crisp-white mb-6">
            Ready to Earn{" "}
            <span className="text-electric-sage">What You're Worth?</span>
          </h2>
          <p className="text-xl mb-8 text-warm-gray max-w-2xl mx-auto">
            Join 500+ creators who've taken control of their income. Start free,
            upgrade when you're ready.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full text-crisp-white bg-charcoal/50 border border-warm-gray/20 focus:outline-none focus:ring-2 focus:ring-electric-sage placeholder-warm-gray backdrop-blur-xl"
                required
              />
              <button
                type="submit"
                className="btn-coral group relative overflow-hidden px-8 py-4 font-bold rounded-full"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-hot-coral to-electric-sage opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </form>

          <div className="grid md:grid-cols-3 gap-8 text-center mb-8">
            <div className="glassmorphism rounded-xl p-6 backdrop-blur-xl border border-warm-gray/20">
              <div className="text-3xl font-display font-black text-electric-sage mb-2">
                5 min
              </div>
              <div className="text-warm-gray text-sm">
                to set up your creator page
              </div>
            </div>
            <div className="glassmorphism rounded-xl p-6 backdrop-blur-xl border border-warm-gray/20">
              <div className="text-3xl font-display font-black text-electric-sage mb-2">
                $0
              </div>
              <div className="text-warm-gray text-sm">
                platform fees forever
              </div>
            </div>
            <div className="glassmorphism rounded-xl p-6 backdrop-blur-xl border border-warm-gray/20">
              <div className="text-3xl font-display font-black text-electric-sage mb-2">
                100%
              </div>
              <div className="text-warm-gray text-sm">
                ownership of your content
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/how-it-works" className="btn-secondary">
              See How It Works
            </Link>
            <Link to="/pricing" className="btn-secondary">
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});

CreatorCTA.displayName = "CreatorCTA";
