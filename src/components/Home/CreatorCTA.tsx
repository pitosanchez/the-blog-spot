import { memo, useState } from "react";
import { Button } from "../ui/Button";

export const CreatorCTA = memo(() => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Email submitted:", email);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-vintage-ink to-warm-gray-900 text-white">
      <div className="container-custom px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4">
            Ready to Earn What You're Worth?
          </h2>
          <p className="text-xl mb-8 text-warm-gray-200">
            Join 500+ creators who've taken control of their income. Start free,
            upgrade when you're ready.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full text-vintage-ink bg-white focus:outline-none focus:ring-4 focus:ring-community-teal"
                required
              />
              <Button
                type="submit"
                size="lg"
                className="px-8 py-4 font-bold rounded-full"
              >
                Get Started
              </Button>
            </div>
          </form>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">5 minutes</div>
              <div className="text-warm-gray-300">
                to set up your creator page
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">$0</div>
              <div className="text-warm-gray-300">platform fees forever</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-warm-gray-300">
                ownership of your content
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

CreatorCTA.displayName = "CreatorCTA";
