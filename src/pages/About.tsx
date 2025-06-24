import { useEffect, useRef, memo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SEOHead } from "../components/SEO/SEOHead";
import { Button } from "../components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

const About = memo(() => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from(heroRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      });

      // Content animations
      gsap.utils.toArray(".animate-in").forEach((element: any) => {
        gsap.from(element, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <SEOHead
        title="About The Blog Spot - Empowering Creators"
        description="Learn how The Blog Spot is revolutionizing creator monetization with 90% revenue share and simple tools."
      />

      <div className="min-h-screen bg-gradient-to-b from-cream to-white">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative py-20 md:py-32 overflow-hidden"
        >
          <div className="container-custom px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-vintage-ink mb-6">
                Built by Creators,
                <span className="block text-bodega-brick">For Creators</span>
              </h1>
              <p className="text-xl text-warm-gray-700 mb-8">
                We believe creators deserve to keep what they earn. That's why
                we built the simplest, most creator-friendly platform on the
                internet.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section ref={contentRef} className="py-16 md:py-24">
          <div className="container-custom px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center mb-16 animate-in">
                <div>
                  <h2 className="text-3xl md:text-4xl font-playfair font-bold text-vintage-ink mb-6">
                    Our Mission
                  </h2>
                  <p className="text-lg text-warm-gray-700 mb-4">
                    The creator economy is broken. Platforms take too much,
                    algorithms hide your content, and getting paid feels like
                    pulling teeth.
                  </p>
                  <p className="text-lg text-warm-gray-700 mb-4">
                    We're fixing that. The Blog Spot gives you simple tools to
                    monetize your content, keeps only 10% of your earnings, and
                    pays you weekly.
                  </p>
                  <p className="text-lg text-warm-gray-700">
                    No games. No gimmicks. Just a fair deal for creators.
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-warm-gray-100">
                  <h3 className="text-2xl font-source font-bold text-vintage-ink mb-6">
                    Our Promise to You
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-community-teal text-xl">✓</span>
                      <span>Keep 90% of everything you earn</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-community-teal text-xl">✓</span>
                      <span>Get paid every Friday</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-community-teal text-xl">✓</span>
                      <span>Own your audience data</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-community-teal text-xl">✓</span>
                      <span>No platform fees or hidden costs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-community-teal text-xl">✓</span>
                      <span>Export everything, anytime</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Values Section */}
              <div className="animate-in">
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-vintage-ink text-center mb-12">
                  Our Core Values
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-community-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🤝</span>
                    </div>
                    <h3 className="text-xl font-source font-bold text-vintage-ink mb-2">
                      Creator First
                    </h3>
                    <p className="text-warm-gray-700">
                      Every decision we make starts with one question: Is this
                      good for creators?
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-bodega-brick/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🎯</span>
                    </div>
                    <h3 className="text-xl font-source font-bold text-vintage-ink mb-2">
                      Radical Simplicity
                    </h3>
                    <p className="text-warm-gray-700">
                      Complex features don't help you earn. Simple tools that
                      work do.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-community-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">💎</span>
                    </div>
                    <h3 className="text-xl font-source font-bold text-vintage-ink mb-2">
                      Transparent Always
                    </h3>
                    <p className="text-warm-gray-700">
                      No fine print. No surprises. What we promise is what you
                      get.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="mt-16 text-center animate-in">
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-vintage-ink mb-6">
                  Ready to Take Control?
                </h2>
                <p className="text-xl text-warm-gray-700 mb-8 max-w-2xl mx-auto">
                  Join hundreds of creators who've already made the switch to
                  fair monetization.
                </p>
                <Button href="/get-started" size="lg" className="px-8 py-4">
                  Start Earning Today
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
});

export default About;
