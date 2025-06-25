import { memo } from "react";
import { SEOHead } from "../components/SEO/SEOHead";
import { Button } from "../components/ui/Button";
import { CREATOR_FAQ } from "../constants";

export const Membership = memo(() => {
  return (
    <>
      <SEOHead
        title="Creator Membership - The Blog Spot"
        description="Join The Blog Spot as a creator. Keep 90% of your earnings, get weekly payouts, and own your audience. No platform fees, just simple tools to help you succeed."
        keywords={[
          "creator membership",
          "monetization",
          "newsletter platform",
          "content creator",
          "90% revenue share",
          "weekly payouts",
        ]}
        url="/membership"
        type="website"
      />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-deep-plum to-muted-blue-grey text-pure-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Creator Membership Benefits
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 opacity-90">
            Everything you need to build a sustainable creator business. No
            hidden fees, no complex terms, just 90% of your earnings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button href="/get-started" size="lg" variant="secondary">
              Start Creating
            </Button>
            <Button
              href="/pricing"
              size="lg"
              variant="outline"
              className="border-pure-white text-pure-white hover:bg-pure-white hover:text-creative-teal"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Core Benefits */}
      <section className="py-16 md:py-20 bg-pure-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-ink mb-4">
              Why Creators Choose The Blog Spot
            </h2>
            <p className="text-lg text-muted-blue-grey max-w-2xl mx-auto">
              We built this platform with creators in mind. Every feature is
              designed to help you succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-sepia-note rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-slate-ink mb-3">
                90% Revenue Share
              </h3>
              <p className="text-muted-blue-grey">
                Keep 90% of everything you earn. We only take 10%, which
                includes payment processing.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-sepia-note rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-slate-ink mb-3">
                Weekly Payouts
              </h3>
              <p className="text-muted-blue-grey">
                Get paid every Friday. As long as you've earned $25+, we
                automatically deposit your earnings.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-sepia-note rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-slate-ink mb-3">
                Own Your Audience
              </h3>
              <p className="text-muted-blue-grey">
                Export your subscriber list anytime. Your audience is yours, not
                ours.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-sepia-note rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="text-xl font-bold text-slate-ink mb-3">
                Simple Tools
              </h3>
              <p className="text-muted-blue-grey">
                Everything you need, nothing you don't. Focus on creating, not
                learning complex software.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-sepia-note rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-slate-ink mb-3">
                No Algorithm Games
              </h3>
              <p className="text-muted-blue-grey">
                Your subscribers see everything you publish. No mysterious
                algorithms deciding your reach.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-sepia-note rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-bold text-slate-ink mb-3">
                Workshops & Courses
              </h3>
              <p className="text-muted-blue-grey">
                Sell workshops, courses, and premium content easily. Set your
                own prices and terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-sepia-note">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-ink mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {CREATOR_FAQ.map((faq, index) => (
              <div key={index} className="bg-pure-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-lg text-slate-ink mb-3">
                  {faq.question}
                </h3>
                <p className="text-muted-blue-grey">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-deep-plum to-muted-blue-grey text-pure-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join 500+ creators who are building sustainable businesses on The
            Blog Spot.
          </p>
          <Button href="/get-started" size="lg" variant="secondary">
            Get Started Free
          </Button>
        </div>
      </section>
    </>
  );
});

Membership.displayName = "Membership";

export default Membership;
