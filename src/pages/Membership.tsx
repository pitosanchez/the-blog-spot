import { memo } from "react";
import { SEOHead } from "../components/SEO/SEOHead";
import { PremiumTiers } from "../components/Monetization/PremiumTiers";
import { AffiliateProducts } from "../components/Monetization/AffiliateProducts";
import { SponsoredContent } from "../components/Monetization/SponsoredContent";
import { Newsletter } from "../components/Home/Newsletter";

export const Membership = memo(() => {
  const handleTierSelect = (tierId: string) => {
    // In a real app, this would integrate with a payment processor
    console.log(`Selected membership tier: ${tierId}`);

    // Example: Redirect to payment page or show payment modal
    if (tierId !== "free") {
      alert(`Redirecting to payment for ${tierId} membership...`);
    } else {
      alert("Welcome to our free community membership!");
    }
  };

  const handleProductClick = (productId: string, affiliateUrl: string) => {
    // Track affiliate click for analytics
    console.log(`Affiliate click: ${productId}`);

    // Open affiliate link
    window.open(affiliateUrl, "_blank", "noopener,noreferrer");
  };

  const handleSponsoredClick = (postId: string, ctaUrl: string) => {
    // Track sponsored content engagement
    console.log(`Sponsored content click: ${postId}`);

    // Open sponsored link
    window.open(ctaUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <SEOHead
        title="Membership & Community - Join The Blog Spot"
        description="Join The Blog Spot community with premium memberships, exclusive content, and writing resources. Support storytellers and access premium features."
        keywords={[
          "membership",
          "premium",
          "community",
          "storytelling",
          "writing resources",
          "exclusive content",
        ]}
        url="/membership"
        type="website"
      />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-bodega-brick to-community-teal text-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our Storytelling Community
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 opacity-90">
            Connect with fellow storytellers, access exclusive content, and get
            the tools you need to share your voice with the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex-1">
              <div className="text-2xl mb-2">👥</div>
              <div className="text-sm font-medium">10,000+</div>
              <div className="text-xs opacity-75">Community Members</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex-1">
              <div className="text-2xl mb-2">📖</div>
              <div className="text-sm font-medium">5,000+</div>
              <div className="text-xs opacity-75">Stories Shared</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex-1">
              <div className="text-2xl mb-2">✨</div>
              <div className="text-sm font-medium">500+</div>
              <div className="text-xs opacity-75">Featured Stories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Membership Tiers */}
      <PremiumTiers onSelectTier={handleTierSelect} />

      {/* Community Benefits */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-vintage-ink mb-4">
              Why Join Our Community?
            </h2>
            <p className="text-lg text-community-teal max-w-2xl mx-auto">
              More than just a platform - we're a supportive community dedicated
              to amplifying diverse voices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-bodega-brick/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-vintage-ink mb-3">
                Inclusive Community
              </h3>
              <p className="text-gray-600">
                A safe space for BIPOC, LGBTQ+, and marginalized voices to share
                their authentic stories.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-community-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-vintage-ink mb-3">
                Writing Resources
              </h3>
              <p className="text-gray-600">
                Access prompts, templates, and tools to help you craft and share
                your stories effectively.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-bodega-brick/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-vintage-ink mb-3">
                Featured Opportunities
              </h3>
              <p className="text-gray-600">
                Get your stories featured and reach a wider audience of engaged
                readers.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-community-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-vintage-ink mb-3">
                Peer Support
              </h3>
              <p className="text-gray-600">
                Connect with fellow writers for feedback, encouragement, and
                creative collaboration.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-bodega-brick/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-vintage-ink mb-3">
                Recognition
              </h3>
              <p className="text-gray-600">
                Earn badges, get featured in newsletters, and build your
                reputation as a storyteller.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-community-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-vintage-ink mb-3">
                Growth Opportunities
              </h3>
              <p className="text-gray-600">
                Workshops, coaching, and monetization opportunities for serious
                creators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Products */}
      <AffiliateProducts limit={6} onProductClick={handleProductClick} />

      {/* Sponsored Content */}
      <SponsoredContent layout="featured" onPostClick={handleSponsoredClick} />

      {/* Newsletter Signup */}
      <Newsletter />

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-vintage-ink mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-lg text-vintage-ink mb-3">
                Can I cancel my membership anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can cancel your membership at any time. You'll continue
                to have access to premium features until the end of your billing
                period.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-lg text-vintage-ink mb-3">
                What makes The Blog Spot different?
              </h3>
              <p className="text-gray-600">
                We're specifically focused on amplifying diverse voices and
                creating a safe, inclusive space for authentic storytelling. Our
                community guidelines ensure respectful, meaningful engagement.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-lg text-vintage-ink mb-3">
                How do I submit my stories?
              </h3>
              <p className="text-gray-600">
                All members can submit stories through our submission form.
                Premium members get priority review and unlimited submissions.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-lg text-vintage-ink mb-3">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for all premium
                memberships. If you're not satisfied, contact us for a full
                refund.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
});

Membership.displayName = "Membership";

export default Membership;
