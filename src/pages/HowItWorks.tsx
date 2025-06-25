import { memo } from "react";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Sign up in 30 seconds. No credit card required, no complex setup.",
    features: [
      "Instant account activation",
      "Import existing content",
      "Connect social profiles",
    ],
    icon: "🚀",
  },
  {
    number: "02",
    title: "Publish Your Content",
    description:
      "Write, upload, or import your stories. Our editor makes it effortless.",
    features: ["Rich text editor", "Media uploads", "SEO optimization"],
    icon: "✍️",
  },
  {
    number: "03",
    title: "Build Your Audience",
    description:
      "Share your unique link. Readers discover and subscribe to your content.",
    features: [
      "Custom creator page",
      "Social sharing tools",
      "Analytics dashboard",
    ],
    icon: "📈",
  },
  {
    number: "04",
    title: "Start Earning",
    description:
      "Set your prices. Get paid weekly. Keep 90% of everything you earn.",
    features: ["Weekly payouts", "Multiple pricing tiers", "90% revenue share"],
    icon: "💰",
  },
];

const features = [
  {
    title: "No Algorithm Games",
    description:
      "Your subscribers see everything you publish. No shadow banning, no suppression.",
    icon: "📊",
  },
  {
    title: "Own Your Audience",
    description:
      "Export your subscriber list anytime. Your audience belongs to you, not us.",
    icon: "👥",
  },
  {
    title: "Simple Pricing",
    description:
      "One transparent rate: we take 10%, you keep 90%. No hidden fees, ever.",
    icon: "💎",
  },
  {
    title: "Weekly Payouts",
    description:
      "Get paid every Friday. No waiting 30+ days like other platforms.",
    icon: "⚡",
  },
];

export const HowItWorks = memo(() => {
  return (
    <div className="bg-ink-black text-crisp-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30"></div>

        <div className="relative z-10 container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
              How It <span className="text-electric-sage">Works</span>
            </h1>
            <p className="text-xl md:text-2xl text-warm-gray leading-relaxed mb-8">
              From zero to earning in 4 simple steps. No complex setup, no
              hidden fees.
            </p>
            <div className="inline-flex items-center gap-2 bg-charcoal/50 backdrop-blur-xl border border-warm-gray/20 rounded-full px-6 py-3">
              <div className="w-2 h-2 bg-electric-sage rounded-full animate-pulse"></div>
              <span className="text-sm text-warm-gray">
                Average setup time: 5 minutes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                  }`}
                >
                  {/* Content */}
                  <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-6xl">{step.icon}</div>
                      <div className="text-8xl font-display font-black text-electric-sage/20">
                        {step.number}
                      </div>
                    </div>

                    <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
                      {step.title}
                    </h2>

                    <p className="text-xl text-warm-gray leading-relaxed mb-8">
                      {step.description}
                    </p>

                    <ul className="space-y-3">
                      {step.features.map((feature, idx) => (
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
                          <span className="text-warm-gray">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <div className={index % 2 === 1 ? "lg:col-start-1" : ""}>
                    <div className="glassmorphism rounded-2xl p-8 backdrop-blur-xl border border-warm-gray/20 hover:border-electric-sage/50 transition-all duration-300">
                      <div className="aspect-square bg-gradient-to-br from-electric-sage/20 to-hot-coral/20 rounded-xl flex items-center justify-center">
                        <div className="text-8xl">{step.icon}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute left-1/2 -bottom-10 w-px h-20 bg-gradient-to-b from-electric-sage/50 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-charcoal/50">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
              Why Creators <span className="text-electric-sage">Choose Us</span>
            </h2>
            <p className="text-xl text-warm-gray max-w-2xl mx-auto">
              We built the platform we wished existed when we were starting out.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glassmorphism rounded-xl p-6 backdrop-blur-xl border border-warm-gray/20 hover:border-electric-sage/50 transition-all duration-300 hover:scale-105"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-warm-gray text-sm leading-relaxed">
                  {feature.description}
                </p>
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
              Ready to Start{" "}
              <span className="text-electric-sage">Earning?</span>
            </h2>
            <p className="text-xl text-warm-gray mb-8 max-w-2xl mx-auto">
              Join 500+ creators who've already made the switch to a platform
              that actually pays.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/get-started"
                className="btn-coral group relative overflow-hidden"
              >
                <span className="relative z-10">Start Creating Today</span>
                <div className="absolute inset-0 bg-gradient-to-r from-hot-coral to-electric-sage opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link to="/pricing" className="btn-secondary">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

HowItWorks.displayName = "HowItWorks";

export default HowItWorks;
