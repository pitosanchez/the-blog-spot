import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SEOHead } from "../components/SEO/SEOHead";
import aboutBg from "../assets/what-is-story.jpg";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const elements = paragraphsRef.current.filter(Boolean);
    if (elements.length) {
      gsap.fromTo(
        elements,
        { autoAlpha: 0, y: 60 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          stagger: 0.25,
          scrollTrigger: {
            trigger: elements[0],
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none none",
          },
        }
      );
    }
    return () => {
      ScrollTrigger.getAll().forEach((st: any) => st.kill());
    };
  }, []);

  return (
    <>
      <SEOHead
        title="About The Blog Spot - Inclusive Storytelling Community"
        description="Learn about The Blog Spot, a safe and inclusive platform for authentic storytelling. We uplift voices from BIPOC, LGBTQ+, and marginalized communities through the power of shared stories."
        keywords={[
          "about",
          "community",
          "storytelling",
          "BIPOC",
          "LGBTQ+",
          "inclusive",
          "diversity",
          "authentic stories",
          "marginalized voices",
        ]}
        url="/about"
        type="website"
      />
      <section
        className="relative min-h-screen flex items-center justify-center py-16 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${aboutBg})`,
        }}
        role="main"
        aria-labelledby="about-heading"
      >
        {/* Background image description for screen readers */}
        <div className="sr-only">
          Background image shows a person writing, symbolizing storytelling and
          sharing experiences
        </div>

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-white/80" aria-hidden="true"></div>

        <div className="container-custom max-w-4xl mx-auto relative z-10 px-4 md:px-6 lg:px-8">
          <h1
            id="about-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-vintage-ink mb-8 md:mb-12 drop-shadow-2xl text-center"
          >
            About The Blog Spot
          </h1>

          <div className="space-y-6 md:space-y-8">
            <p
              ref={(el) => {
                paragraphsRef.current[0] = el;
              }}
              className="text-lg md:text-xl lg:text-2xl font-source text-vintage-ink drop-shadow-2xl text-left leading-relaxed bg-white/30 p-4 rounded-lg backdrop-blur-sm"
            >
              <span className="font-bold text-bodega-brick">
                Every voice deserves to be heard.
              </span>{" "}
              That simple belief is at the heart of The Blog Spot, a warm and
              inclusive haven for authentic storytelling. We created this
              platform to uplift voices often left out of the conversation —
              including Black, Indigenous, and People of Color (BIPOC), LGBTQ+
              folks, formerly incarcerated individuals, and anyone who has felt
              silenced or overlooked. Here, you can share your stories, life
              experiences, and reflections without fear of judgment.
            </p>

            <p
              ref={(el) => {
                paragraphsRef.current[1] = el;
              }}
              className="text-lg md:text-xl lg:text-2xl font-source text-vintage-ink drop-shadow-2xl text-left leading-relaxed bg-white/30 p-4 rounded-lg backdrop-blur-sm"
            >
              The Blog Spot is more than just a website — it's a community space
              for emotional connection and solidarity, where honest stories
              bring people together. Storytelling has a unique power to break
              down barriers and connect people from all walks of life. When
              someone opens up about their life, it sparks empathy,
              understanding, and often a sense of solidarity among readers.
              Listening to diverse experiences challenges stereotypes and
              reminds us of the common threads of humanity we all share. We
              truly believe that by sharing our truths, we can learn from one
              another and realize that we are not alone.
            </p>

            <p
              ref={(el) => {
                paragraphsRef.current[2] = el;
              }}
              className="text-lg md:text-xl lg:text-2xl font-source text-vintage-ink drop-shadow-2xl text-left leading-relaxed bg-white/30 p-4 rounded-lg backdrop-blur-sm"
            >
              To keep this space safe and respectful, we moderate all posts on
              The Blog Spot. We have zero tolerance for hate speech or
              politically motivated misinformation. Content rooted in divisive
              ideology — especially right-wing dogma that could harm our
              community's integrity — has no place here. By ensuring every
              contribution aligns with our values of honesty, empathy, and
              inclusivity, we preserve the trust and integrity of our community.
            </p>

            <p
              ref={(el) => {
                paragraphsRef.current[3] = el;
              }}
              className="text-lg md:text-xl lg:text-2xl font-source text-vintage-ink drop-shadow-2xl text-left leading-relaxed bg-white/30 p-4 rounded-lg backdrop-blur-sm"
            >
              For everyone visiting The Blog Spot, we want you to feel heard,
              valued, and at home. If you're here to read, we hope these stories
              broaden your perspective and touch your heart. If you're moved to
              share, we encourage you to add your own story when you're ready –
              knowing you'll be met with support and respect.
            </p>

            <p
              ref={(el) => {
                paragraphsRef.current[4] = el;
              }}
              className="text-lg md:text-xl lg:text-2xl font-source text-vintage-ink drop-shadow-2xl text-left leading-relaxed bg-white/30 p-4 rounded-lg backdrop-blur-sm"
            >
              We warmly invite you to join our community. Together, through
              sharing and listening, we can foster understanding, spark healing,
              and remind each other that every voice matters.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
