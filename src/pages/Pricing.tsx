import { memo, useState } from "react";
import { Link } from "react-router-dom";

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started and building your audience",
    features: [
      "Unlimited free posts",
      "Basic analytics",
      "Email subscribers",
      "Social sharing",
      "SEO optimization",
      "Mobile responsive",
    ],
    cta: "Start Free",
    popular: false,
    color: "charcoal",
  },
  {
    name: "Creator",
    price: "10%",
    period: "commission",
    description: "For serious creators ready to monetize their content",
    features: [
      "Everything in Free",
      "Paid subscriptions",
      "Weekly payouts",
      "90% revenue share",
      "Premium analytics",
      "Custom branding",
      "Priority support",
      "Export subscribers",
    ],
    cta: "Start Earning",
    popular: true,
    color: "electric-sage",
  },
  {
    name: "Pro",
    price: "10%",
    period: "commission + $29/mo",
    description: "Advanced features for established creators and businesses",
    features: [
      "Everything in Creator",
      "Advanced workshops",
      "Course creation tools",
      "Affiliate marketing",
      "White-label options",
      "API access",
      "Dedicated manager",
      "Custom integrations",
    ],
    cta: "Go Pro",
    popular: false,
    color: "hot-coral",
  },
];

const faqs = [
  {
    question: "How much does The Blog Spot take?",
    answer:
      "We take only 10% of your earnings. You keep 90%. This includes payment processing fees, so there are no hidden costs.",
  },
  {
    question: "When do I get paid?",
    answer:
      "Every Friday. If you've earned over $25, we automatically deposit to your bank account. No waiting 30+ days like other platforms.",
  },
  {
    question: "Can I switch plans anytime?",
    answer:
      "Absolutely. Upgrade or downgrade anytime. Changes take effect immediately, and we'll prorate any differences.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We support all major credit cards, debit cards, and ACH transfers through Stripe. Your readers can pay however they prefer.",
  },
  {
    question: "Can I export my data?",
    answer:
      "Yes! Your content, subscriber list, and analytics are always exportable. You own your data, not us.",
  },
  {
    question: "Is there a setup fee?",
    answer:
      "No setup fees, no hidden costs, no annual contracts. Just our simple 10% commission on what you earn.",
  },
];

export const Pricing = memo(() => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-ink-black text-crisp-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30"></div>

        <div className="relative z-10 container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
              Simple <span className="text-electric-sage">Pricing</span>
            </h1>
            <p className="text-xl md:text-2xl text-warm-gray leading-relaxed mb-8">
              No hidden fees. No complex tiers. Just a simple 10% commission on
              what you earn.
            </p>

            {/* Revenue Share Highlight */}
            <div className="glassmorphism rounded-2xl p-8 backdrop-blur-xl border border-warm-gray/20 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-6xl font-display font-black text-electric-sage mb-2">
                  90%
                </div>
                <div className="text-lg text-warm-gray">You Keep</div>
                <div className="text-sm text-warm-gray mt-2">
                  vs 50-70% on other platforms
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`glassmorphism rounded-2xl p-8 backdrop-blur-xl border transition-all duration-300 hover:scale-105 relative ${
                  tier.popular
                    ? "border-electric-sage/50 shadow-electric-sage/20 shadow-2xl"
                    : "border-warm-gray/20 hover:border-electric-sage/30"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-electric-sage text-ink-black px-6 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="font-display font-bold text-2xl mb-2">
                    {tier.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-black text-electric-sage">
                      {tier.price}
                    </span>
                    <span className="text-warm-gray ml-2">/{tier.period}</span>
                  </div>
                  <p className="text-warm-gray text-sm">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-electric-sage flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-warm-gray text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/get-started"
                  className={`block w-full text-center py-4 rounded-lg font-semibold transition-all duration-200 ${
                    tier.popular
                      ? "bg-electric-sage text-ink-black hover:bg-electric-sage/90 hover:scale-105 shadow-lg shadow-electric-sage/20"
                      : "bg-charcoal text-crisp-white border border-warm-gray/20 hover:border-electric-sage/50 hover:text-electric-sage"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-charcoal/50">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
              How We <span className="text-electric-sage">Compare</span>
            </h2>
            <p className="text-xl text-warm-gray max-w-2xl mx-auto">
              See why creators are switching to The Blog Spot.
            </p>
          </div>

          <div className="glassmorphism rounded-2xl backdrop-blur-xl border border-warm-gray/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-warm-gray/20">
                    <th className="text-left p-6 font-bold">Feature</th>
                    <th className="text-center p-6 font-bold text-electric-sage">
                      The Blog Spot
                    </th>
                    <th className="text-center p-6 font-bold text-warm-gray">
                      Substack
                    </th>
                    <th className="text-center p-6 font-bold text-warm-gray">
                      Medium
                    </th>
                    <th className="text-center p-6 font-bold text-warm-gray">
                      Patreon
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-warm-gray/10">
                    <td className="p-6 text-warm-gray">Revenue Share</td>
                    <td className="p-6 text-center text-electric-sage font-bold">
                      90%
                    </td>
                    <td className="p-6 text-center text-warm-gray">90%</td>
                    <td className="p-6 text-center text-warm-gray">~50%</td>
                    <td className="p-6 text-center text-warm-gray">90%</td>
                  </tr>
                  <tr className="border-b border-warm-gray/10">
                    <td className="p-6 text-warm-gray">Payout Frequency</td>
                    <td className="p-6 text-center text-electric-sage font-bold">
                      Weekly
                    </td>
                    <td className="p-6 text-center text-warm-gray">Monthly</td>
                    <td className="p-6 text-center text-warm-gray">Monthly</td>
                    <td className="p-6 text-center text-warm-gray">Monthly</td>
                  </tr>
                  <tr className="border-b border-warm-gray/10">
                    <td className="p-6 text-warm-gray">Setup Time</td>
                    <td className="p-6 text-center text-electric-sage font-bold">
                      5 minutes
                    </td>
                    <td className="p-6 text-center text-warm-gray">
                      15 minutes
                    </td>
                    <td className="p-6 text-center text-warm-gray">
                      2 minutes
                    </td>
                    <td className="p-6 text-center text-warm-gray">
                      30 minutes
                    </td>
                  </tr>
                  <tr className="border-b border-warm-gray/10">
                    <td className="p-6 text-warm-gray">Export Data</td>
                    <td className="p-6 text-center">
                      <svg
                        className="w-5 h-5 text-electric-sage mx-auto"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </td>
                    <td className="p-6 text-center">
                      <svg
                        className="w-5 h-5 text-electric-sage mx-auto"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </td>
                    <td className="p-6 text-center">
                      <svg
                        className="w-5 h-5 text-warm-gray mx-auto"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </td>
                    <td className="p-6 text-center">
                      <svg
                        className="w-5 h-5 text-warm-gray mx-auto"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
              Common <span className="text-electric-sage">Questions</span>
            </h2>
            <p className="text-xl text-warm-gray max-w-2xl mx-auto">
              Everything you need to know about pricing and features.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="glassmorphism rounded-xl backdrop-blur-xl border border-warm-gray/20 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-electric-sage/5 transition-colors"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-electric-sage transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-warm-gray">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="glassmorphism rounded-2xl p-12 backdrop-blur-xl border border-warm-gray/20 text-center">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
              Ready to Keep <span className="text-electric-sage">90%?</span>
            </h2>
            <p className="text-xl text-warm-gray mb-8 max-w-2xl mx-auto">
              Start your creator journey today. No setup fees, no hidden costs,
              no long-term contracts.
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

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-warm-gray">
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-electric-sage"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Free to start
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-electric-sage"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Cancel anytime
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-electric-sage"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Export your data
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

Pricing.displayName = "Pricing";

export default Pricing;
