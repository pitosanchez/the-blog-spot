import { memo } from "react";
import { Button } from "../ui/Button";

interface PremiumTier {
  id: string;
  name: string;
  price: number;
  period: "month" | "year";
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
  badge?: string;
}

interface PremiumTiersProps {
  onSelectTier?: (tierId: string) => void;
}

const PREMIUM_TIERS: PremiumTier[] = [
  {
    id: "free",
    name: "Community Member",
    price: 0,
    period: "month",
    description: "Perfect for casual readers and occasional contributors",
    features: [
      "Read all public stories",
      "Submit 2 stories per month",
      "Join community discussions",
      "Monthly newsletter",
      "Basic writing prompts",
    ],
    ctaText: "Get Started Free",
  },
  {
    id: "storyteller",
    name: "Storyteller",
    price: 9,
    period: "month",
    description: "For active community members and regular contributors",
    features: [
      "Everything in Community Member",
      "Submit unlimited stories",
      "Priority story review",
      "Exclusive monthly workshops",
      "Advanced writing prompts",
      "Author profile page",
      "Story analytics dashboard",
    ],
    highlighted: true,
    ctaText: "Start Storytelling",
    badge: "Most Popular",
  },
  {
    id: "creator",
    name: "Creator",
    price: 19,
    period: "month",
    description: "For serious writers and content creators",
    features: [
      "Everything in Storyteller",
      "Featured story placement",
      "Direct reader messaging",
      "Monetization opportunities",
      "Custom author branding",
      "Advanced analytics",
      "Monthly 1-on-1 coaching call",
      "Early access to new features",
    ],
    ctaText: "Become a Creator",
  },
];

export const PremiumTiers = memo<PremiumTiersProps>(({ onSelectTier }) => {
  const handleTierSelect = (tierId: string) => {
    if (onSelectTier) {
      onSelectTier(tierId);
    } else {
      // Default behavior - could integrate with payment processor
      console.log(`Selected tier: ${tierId}`);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-cream to-storyteller-cream">
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-vintage-ink mb-4">
            Choose Your Storytelling Journey
          </h2>
          <p className="text-lg text-community-teal max-w-2xl mx-auto">
            Join thousands of storytellers sharing their experiences. Select the
            membership that fits your creative goals.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PREMIUM_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                tier.highlighted
                  ? "border-bodega-brick scale-105 md:scale-110"
                  : "border-gray-200 hover:border-community-teal"
              }`}
            >
              {/* Badge */}
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-bodega-brick text-white px-4 py-1 rounded-full text-sm font-bold">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-vintage-ink mb-2">
                    {tier.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-bodega-brick">
                      ${tier.price}
                    </span>
                    <span className="text-gray-600">/{tier.period}</span>
                  </div>
                  <p className="text-sm text-gray-600">{tier.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-3 mt-0.5">✓</span>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => handleTierSelect(tier.id)}
                  variant={tier.highlighted ? "primary" : "outline"}
                  size="lg"
                  className="w-full"
                >
                  {tier.ctaText}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 mb-4">
            All plans include our community guidelines protection and content
            moderation.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-community-teal">
            <span>✓ Cancel anytime</span>
            <span>✓ 30-day money-back guarantee</span>
            <span>✓ Secure payment processing</span>
          </div>
        </div>
      </div>
    </section>
  );
});

PremiumTiers.displayName = "PremiumTiers";
