import { memo } from "react";
import { SEOHead } from "../components/SEO/SEOHead";
import { Button } from "../components/ui/Button";

const HowItWorks = memo(() => {
  const steps = [
    {
      number: "01",
      title: "Sign Up in Minutes",
      description:
        "Create your creator account with just an email. No lengthy applications or waiting periods.",
      icon: "✍️",
    },
    {
      number: "02",
      title: "Set Your Prices",
      description:
        "Choose your subscription price or offer one-time purchases. You're in complete control.",
      icon: "💰",
    },
    {
      number: "03",
      title: "Create & Publish",
      description:
        "Use our simple editor to write posts, create workshops, or upload digital products.",
      icon: "📝",
    },
    {
      number: "04",
      title: "Get Paid Weekly",
      description:
        "Every Friday, we deposit your earnings directly to your bank account. No waiting.",
      icon: "💸",
    },
  ];

  return (
    <>
      <SEOHead
        title="How It Works - The Blog Spot Creator Platform"
        description="Learn how easy it is to start earning on The Blog Spot. Sign up, create content, and get paid weekly with 90% revenue share."
      />

      <div className="min-h-screen bg-gradient-to-b from-white to-cream">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-vintage-ink mb-6">
                Start Earning in 4 Simple Steps
              </h1>
              <p className="text-xl text-warm-gray-700 mb-8">
                No complex setup. No confusing analytics. Just a straightforward
                path to monetizing your content.
              </p>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 md:py-24">
          <div className="container-custom px-4 md:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`flex flex-col md:flex-row items-center gap-8 mb-16 ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-6xl font-bold text-community-teal/20">
                        {step.number}
                      </span>
                      <span className="text-4xl">{step.icon}</span>
                    </div>
                    <h2 className="text-3xl font-playfair font-bold text-vintage-ink mb-4">
                      {step.title}
                    </h2>
                    <p className="text-lg text-warm-gray-700">
                      {step.description}
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-warm-gray-100">
                      {/* Placeholder for step illustration */}
                      <div className="h-64 bg-gradient-to-br from-cream to-warm-gray-50 rounded-lg flex items-center justify-center">
                        <span className="text-6xl opacity-50">{step.icon}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom px-4 md:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-vintage-ink text-center mb-12">
              Everything Included, No Hidden Fees
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-community-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-source font-bold text-vintage-ink mb-2">
                  Simple Analytics
                </h3>
                <p className="text-warm-gray-700">
                  See your earnings, subscribers, and top content at a glance.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-bodega-brick/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="font-source font-bold text-vintage-ink mb-2">
                  Secure Payments
                </h3>
                <p className="text-warm-gray-700">
                  Powered by Stripe. Your financial data is always protected.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-community-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="font-source font-bold text-vintage-ink mb-2">
                  Growth Tools
                </h3>
                <p className="text-warm-gray-700">
                  Built-in SEO, social sharing, and email tools to grow your
                  audience.
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
                Common Questions
              </h2>
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="font-source font-bold text-vintage-ink mb-2">
                    Do I need technical skills?
                  </h3>
                  <p className="text-warm-gray-700">
                    Not at all. If you can write an email, you can use The Blog
                    Spot.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="font-source font-bold text-vintage-ink mb-2">
                    Can I import my existing content?
                  </h3>
                  <p className="text-warm-gray-700">
                    Yes! We have tools to import from Substack, Medium, and
                    other platforms.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="font-source font-bold text-vintage-ink mb-2">
                    What payment methods are supported?
                  </h3>
                  <p className="text-warm-gray-700">
                    We support all major credit cards, debit cards, and ACH
                    transfers through Stripe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-vintage-ink to-warm-gray-900 text-white">
          <div className="container-custom px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-6">
                Ready to Start Your Creator Journey?
              </h2>
              <p className="text-xl mb-8 text-warm-gray-200">
                Join 500+ creators already earning on their own terms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  href="/get-started"
                  size="lg"
                  className="bg-community-teal hover:bg-community-teal-dark text-white"
                >
                  Get Started Now
                </Button>
                <Button
                  href="/creators"
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-vintage-ink"
                >
                  Browse Creators
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
});

export default HowItWorks;
