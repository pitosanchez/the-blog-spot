import { memo, useState } from "react";
import { Link } from "react-router-dom";

const pricingTiers = [
  {
    name: "Medical Student",
    price: "$0",
    period: "forever",
    description: "For medical students and residents building their professional presence",
    features: [
      "Basic profile",
      "Share case studies",
      "Join discussions",
      "Follow specialists",
      "Access free content",
      "Mobile app access",
    ],
    cta: "Start Free",
    popular: false,
    color: "charcoal",
  },
  {
    name: "Medical Professional",
    price: "10%",
    period: "commission only",
    description: "For practicing physicians ready to monetize their expertise",
    features: [
      "Everything in Student",
      "Paid subscriptions",
      "CME credit integration",
      "HIPAA compliant tools",
      "Case anonymization",
      "Weekly payouts ($100 min)",
      "Professional analytics",
      "License verification",
    ],
    cta: "Start Earning",
    popular: true,
    color: "medical-blue",
  },
  {
    name: "Medical Educator",
    price: "$49/mo",
    period: "+ 10% commission",
    description: "For medical educators, program directors, and institutions",
    features: [
      "Everything in Professional",
      "CME accreditation support",
      "Bulk institutional access",
      "Advanced compliance tools",
      "White-label options",
      "API access",
      "Dedicated support",
      "Custom integrations",
    ],
    cta: "Scale Your Impact",
    popular: false,
    color: "electric-sage",
  },
];

const faqs = [
  {
    question: "Is MedCreator Hub HIPAA compliant?",
    answer:
      "Yes, fully HIPAA compliant. All patient data is encrypted, we provide BAA agreements, and our infrastructure meets all healthcare privacy requirements.",
  },
  {
    question: "Can I offer CME credits through the platform?",
    answer:
      "Yes! We partner with ACCME-accredited providers to help you offer AMA PRA Category 1 Credits™. We handle all the administrative work.",
  },
  {
    question: "How do you verify medical licenses?",
    answer:
      "We verify all medical licenses through primary source verification with state medical boards before activating professional accounts.",
  },
  {
    question: "What specialties are supported?",
    answer:
      "All medical specialties are welcome. We have dedicated features for case-based learning, procedural videos, and specialty-specific content.",
  },
  {
    question: "Can hospitals buy institutional subscriptions?",
    answer:
      "Yes! We offer enterprise plans with volume discounts, admin dashboards, and usage analytics for hospitals and medical schools.",
  },
  {
    question: "What about malpractice liability?",
    answer:
      "Educational content with proper disclaimers is covered under our platform insurance. We provide templates and guidelines for risk mitigation.",
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
              Medical Creator <span className="text-medical-blue">Pricing</span>
            </h1>
            <p className="text-xl md:text-2xl text-warm-gray leading-relaxed mb-8">
              Transparent pricing for medical professionals. Keep 90% of your earnings
              while we handle compliance, CME credits, and payments.
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
              How We <span className="text-medical-blue">Compare</span>
            </h2>
            <p className="text-xl text-warm-gray max-w-2xl mx-auto">
              See why medical professionals choose MedCreator Hub.
            </p>
          </div>

          <div className="glassmorphism rounded-2xl backdrop-blur-xl border border-warm-gray/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-warm-gray/20">
                    <th className="text-left p-6 font-bold">Feature</th>
                    <th className="text-center p-6 font-bold text-medical-blue">
                      MedCreator Hub
                    </th>
                    <th className="text-center p-6 font-bold text-warm-gray">
                      Doximity
                    </th>
                    <th className="text-center p-6 font-bold text-warm-gray">
                      Figure 1
                    </th>
                    <th className="text-center p-6 font-bold text-warm-gray">
                      General Platforms
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-warm-gray/10">
                    <td className="p-6 text-warm-gray">Revenue Share</td>
                    <td className="p-6 text-center text-medical-blue font-bold">
                      90%
                    </td>
                    <td className="p-6 text-center text-warm-gray">N/A</td>
                    <td className="p-6 text-center text-warm-gray">Sponsored</td>
                    <td className="p-6 text-center text-warm-gray">87-92%</td>
                  </tr>
                  <tr className="border-b border-warm-gray/10">
                    <td className="p-6 text-warm-gray">CME Credits</td>
                    <td className="p-6 text-center text-medical-blue font-bold">
                      ✓ Integrated
                    </td>
                    <td className="p-6 text-center text-warm-gray">✗</td>
                    <td className="p-6 text-center text-warm-gray">✗</td>
                    <td className="p-6 text-center text-warm-gray">✗</td>
                  </tr>
                  <tr className="border-b border-warm-gray/10">
                    <td className="p-6 text-warm-gray">HIPAA Compliant</td>
                    <td className="p-6 text-center text-medical-blue font-bold">
                      ✓ Full
                    </td>
                    <td className="p-6 text-center text-warm-gray">
                      ✓ Limited
                    </td>
                    <td className="p-6 text-center text-warm-gray">
                      ✓ Yes
                    </td>
                    <td className="p-6 text-center text-warm-gray">
                      ✗
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
