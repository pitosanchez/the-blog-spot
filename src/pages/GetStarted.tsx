import { memo, useState } from "react";
import { SEOHead } from "../components/SEO/SEOHead";
import { Button } from "../components/ui/Button";

const GetStarted = memo(() => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [creatorType, setCreatorType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    if (import.meta.env.DEV) {
      console.log("Form submitted:", { email, name, creatorType });
    }
  };

  return (
    <>
      <SEOHead
        title="Get Started - Join The Blog Spot Creator Platform"
        description="Start earning 90% of your content revenue. Sign up in minutes and begin monetizing your audience today."
      />

      <div className="min-h-screen bg-gradient-to-b from-cream to-pure-white">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container-custom px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-slate-ink mb-6">
                  Welcome, Creator!
                </h1>
                <p className="text-xl text-warm-muted-blue-grey">
                  Let's get you set up in less than 5 minutes.
                </p>
              </div>

              {/* Sign Up Form */}
              <div className="bg-pure-white rounded-2xl shadow-xl p-8 md:p-12 border border-sepia-note">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-warm-muted-blue-grey mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-muted-blue-grey focus:border-creative-teal focus:ring-2 focus:ring-creative-teal/50 transition-colors"
                      placeholder="Jane Smith"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-warm-muted-blue-grey mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-muted-blue-grey focus:border-creative-teal focus:ring-2 focus:ring-creative-teal/50 transition-colors"
                      placeholder="jane@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-warm-muted-blue-grey mb-2">
                      What type of content will you create?
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        {
                          value: "writer",
                          label: "Writing & Articles",
                          icon: "✍️",
                        },
                        {
                          value: "coach",
                          label: "Coaching & Courses",
                          icon: "🎯",
                        },
                        { value: "artist", label: "Art & Poetry", icon: "🎨" },
                        {
                          value: "educator",
                          label: "Education & Teaching",
                          icon: "📚",
                        },
                      ].map((type) => (
                        <label
                          key={type.value}
                          className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            creatorType === type.value
                              ? "border-creative-teal bg-deep-plum/5"
                              : "border-warm-sepia-note hover:border-muted-blue-grey"
                          }`}
                        >
                          <input
                            type="radio"
                            name="creatorType"
                            value={type.value}
                            checked={creatorType === type.value}
                            onChange={(e) => setCreatorType(e.target.value)}
                            className="sr-only"
                          />
                          <span className="text-2xl">{type.icon}</span>
                          <span className="font-medium">{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={!email || !name || !creatorType}
                    >
                      Create My Account
                    </Button>
                  </div>

                  <p className="text-sm text-center text-warm-muted-blue-grey">
                    By creating an account, you agree to our{" "}
                    <a
                      href="/terms"
                      className="text-creative-teal hover:underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="text-creative-teal hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </form>
              </div>

              {/* Benefits Reminder */}
              <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-creative-teal mb-2">
                    90%
                  </div>
                  <div className="text-sm text-warm-muted-blue-grey">
                    Revenue Share
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-creative-teal mb-2">
                    Weekly
                  </div>
                  <div className="text-sm text-warm-muted-blue-grey">Payouts</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-creative-teal mb-2">
                    $0
                  </div>
                  <div className="text-sm text-warm-muted-blue-grey">
                    Platform Fees
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
});

export default GetStarted;
