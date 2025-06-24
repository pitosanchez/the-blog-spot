import { memo } from "react";
import { SEOHead } from "../components/SEO/SEOHead";
import { Button } from "../components/ui/Button";
import { CREATOR_FAQ } from "../constants";

const Pricing = memo(() => {
  return (
    <>
      <SEOHead
        title="Pricing - Simple, Transparent Creator Fees"
        description="The Blog Spot takes only 10% of your earnings. No platform fees, no hidden costs. Compare with other platforms."
      />

      <div className="min-h-screen bg-gradient-to-b from-white to-cream">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-vintage-ink mb-6">
                Simple, Honest Pricing
              </h1>
              <p className="text-xl text-warm-gray-700 mb-8">
                We take 10%. You keep 90%. That's it.
              </p>
              <div className="inline-flex items-center gap-2 bg-community-teal/10 text-community-teal px-6 py-3 rounded-full text-lg font-medium">
                <span>✓</span>
                <span>
                  No platform fees • No setup costs • No hidden charges
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Calculator */}
        <section className="py-16 md:py-24">
          <div className="container-custom px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-warm-gray-100">
                <h2 className="text-3xl font-playfair font-bold text-vintage-ink text-center mb-8">
                  Your Earnings Calculator
                </h2>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-source font-bold text-vintage-ink mb-4">
                      If you charge $10/month per subscriber:
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-cream rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-community-teal">
                          $90
                        </div>
                        <div className="text-sm text-warm-gray-600">
                          You keep from 10 subscribers
                        </div>
                      </div>
                      <div className="bg-cream rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-community-teal">
                          $900
                        </div>
                        <div className="text-sm text-warm-gray-600">
                          You keep from 100 subscribers
                        </div>
                      </div>
                      <div className="bg-cream rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-bodega-brick">
                          $9,000
                        </div>
                        <div className="text-sm text-warm-gray-600">
                          You keep from 1,000 subscribers
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-8">
                    <h3 className="text-xl font-source font-bold text-vintage-ink mb-4">
                      Compare Your Earnings:
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">
                              Monthly Revenue
                            </th>
                            <th className="text-center py-3 px-4 text-community-teal font-bold">
                              You Keep (Blog Spot)
                            </th>
                            <th className="text-center py-3 px-4 text-warm-gray-600">
                              Others (87%)
                            </th>
                            <th className="text-center py-3 px-4 text-warm-gray-600">
                              Difference
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-3 px-4">$1,000</td>
                            <td className="text-center py-3 px-4 font-bold text-community-teal">
                              $900
                            </td>
                            <td className="text-center py-3 px-4">$870</td>
                            <td className="text-center py-3 px-4 text-bodega-brick">
                              +$30
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4">$5,000</td>
                            <td className="text-center py-3 px-4 font-bold text-community-teal">
                              $4,500
                            </td>
                            <td className="text-center py-3 px-4">$4,350</td>
                            <td className="text-center py-3 px-4 text-bodega-brick">
                              +$150
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4">$10,000</td>
                            <td className="text-center py-3 px-4 font-bold text-community-teal">
                              $9,000
                            </td>
                            <td className="text-center py-3 px-4">$8,700</td>
                            <td className="text-center py-3 px-4 text-bodega-brick">
                              +$300
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom px-4 md:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-vintage-ink text-center mb-12">
              Everything You Need to Succeed
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="font-source font-bold text-vintage-ink mb-2">
                  Payment Processing
                </h3>
                <p className="text-sm text-warm-gray-700">
                  Secure payments via Stripe included in your 10%
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📧</div>
                <h3 className="font-source font-bold text-vintage-ink mb-2">
                  Email Tools
                </h3>
                <p className="text-sm text-warm-gray-700">
                  Send updates to your subscribers at no extra cost
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="font-source font-bold text-vintage-ink mb-2">
                  Analytics Dashboard
                </h3>
                <p className="text-sm text-warm-gray-700">
                  Track your growth and earnings in real-time
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="font-source font-bold text-vintage-ink mb-2">
                  Content Protection
                </h3>
                <p className="text-sm text-warm-gray-700">
                  Your content is protected and backed up daily
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24">
          <div className="container-custom px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-vintage-ink text-center mb-12">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {CREATOR_FAQ.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-md"
                  >
                    <h3 className="font-source font-bold text-vintage-ink mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-warm-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-community-teal to-bodega-brick text-white">
          <div className="container-custom px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-6">
                Start Keeping More of What You Earn
              </h2>
              <p className="text-xl mb-8 text-white/90">
                No contracts. No commitments. Cancel anytime.
              </p>
              <Button
                href="/get-started"
                size="lg"
                className="bg-white text-vintage-ink hover:bg-cream"
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
});

export default Pricing;
