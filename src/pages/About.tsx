import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
    <section
      className="relative min-h-screen flex items-center justify-center py-16"
      style={{
        backgroundImage: `url(${aboutBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for readability */}
      <div
        className="absolute inset-0 bg-storyteller-cream bg-opacity-80"
        aria-hidden="true"
      ></div>
      <div className="container-custom max-w-3xl mx-auto relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-vintage-ink mb-8 drop-shadow-lg">
          About The Blog Spot
        </h1>
        <div className="space-y-8">
          <p
            ref={(el) => {
              paragraphsRef.current[0] = el;
            }}
            className="text-3xl font-source text-vintage-ink drop-shadow-lg text-justify"
          >
            <span className="font-bold text-bodega-brick">
              Every voice deserves to be heard.
            </span>{" "}
            That simple belief is at the heart of The Blog Spot, a warm and
            inclusive haven for authentic storytelling. We created this platform
            to uplift voices often left out of the conversation — including
            Black, Indigenous, and People of Color (BIPOC), LGBTQ+ folks,
            formerly incarcerated individuals, and anyone who has felt silenced
            or overlooked. Here, you can share your stories, life experiences,
            and reflections without fear of judgment.
          </p>
          <p
            ref={(el) => {
              paragraphsRef.current[1] = el;
            }}
            className="text-3xl font-source text-vintage-ink drop-shadow-lg text-justify"
          >
            The Blog Spot is more than just a website — it's a community space
            for emotional connection and solidarity, where honest stories bring
            people together. Storytelling has a unique power to break down
            barriers and connect people from all walks of life. When someone
            opens up about their life, it sparks empathy, understanding, and
            often a sense of solidarity among readers. Listening to diverse
            experiences challenges stereotypes and reminds us of the common
            threads of humanity we all share. We truly believe that by sharing
            our truths, we can learn from one another and realize that we are
            not alone.
          </p>
          <p
            ref={(el) => {
              paragraphsRef.current[2] = el;
            }}
            className="text-3xl font-source text-vintage-ink drop-shadow-lg text-justify"
          >
            To keep this space safe and respectful, we moderate all posts on The
            Blog Spot. We have zero tolerance for hate speech or politically
            motivated misinformation. Content rooted in divisive ideology —
            especially right-wing dogma that could harm our community's
            integrity — has no place here. By ensuring every contribution aligns
            with our values of honesty, empathy, and inclusivity, we preserve
            the trust and integrity of our community.
          </p>
          <p
            ref={(el) => {
              paragraphsRef.current[3] = el;
            }}
            className="text-3xl font-source text-vintage-ink drop-shadow-lg text-justify"
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
            className="text-3xl font-source text-vintage-ink drop-shadow-lg text-justify"
          >
            We warmly invite you to join our community. Together, through
            sharing and listening, we can foster understanding, spark healing,
            and remind each other that every voice matters.
          </p>
        </div>
      </div>
    </section>
  );
}
