import { useState, useEffect } from "react";
import heroBg from "../../assets/blogspot-hero.png";

const quotes = [
  {
    text: "Every corner store has a story. Every story has a home.",
    author: "La Blogdega",
  },
  {
    text: "Where community meets creativity, magic happens.",
    author: "Our Readers",
  },
  {
    text: "Your truth deserves to be heard.",
    author: "La Blogdega",
  },
];

export const Hero = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center py-16 md:py-24 border-b-4 border-bodega-brick overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for readability */}
      <div
        className="absolute inset-0 bg-storyteller-cream bg-opacity-70"
        aria-hidden="true"
      ></div>
      <div className="container-custom relative z-10 flex flex-col md:flex-row items-center gap-12">
        {/* Left: Headline and CTA */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-vintage-ink leading-tight mb-4 drop-shadow-lg">
            Every Story Matters.
            <br />
            <span className="text-bodega-brick">Every Voice Belongs.</span>
          </h1>
          <p className="text-xl text-community-teal font-source mb-4 max-w-xl mx-auto md:mx-0 drop-shadow">
            The Blog Spot is a home for real stories, memories, and truths from
            people of every background. Whether you're sharing a poem, a photo
            essay, a confession, or a family recipe—your voice is welcome here.
          </p>
          <p className="text-base text-vintage-ink font-source mb-8 max-w-xl mx-auto md:mx-0 drop-shadow">
            All backgrounds. All experiences. All forms. Share your truth, your
            humor, your heart—your way.
          </p>
          <a
            href="/submit"
            className="btn-primary px-8 py-3 text-lg font-bold inline-block shadow-lg hover:scale-105 transition-transform font-source"
          >
            Share Your Story
          </a>
        </div>
        {/* Right: Featured Story Card - transparent and positioned for whitespace */}
        <div className="flex-1 flex justify-center md:justify-end items-end md:items-center">
          <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-3xl shadow-xl border-4 border-community-teal max-w-md w-full p-8 flex flex-col items-center md:mb-8 md:mr-4">
            <div className="w-full h-48 bg-storyteller-cream bg-opacity-60 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
              {/* Placeholder for featured image */}
              <span className="text-7xl text-bodega-brick font-playfair">
                ✍️
              </span>
            </div>
            <h2 className="text-2xl font-playfair font-bold text-vintage-ink mb-2 text-center drop-shadow">
              "Cornerstore Confessions: The Day I Found My Voice"
            </h2>
            <p className="text-community-teal font-source text-center mb-4 drop-shadow">
              "I never thought a simple trip to the bodega would change my life.
              But that day, surrounded by the hum of refrigerators and the smell
              of fresh bread, I finally spoke my truth."
            </p>
            <a
              href="/cornerstore-confessions"
              className="btn-secondary px-6 py-2 text-base font-bold mt-2 font-source"
            >
              Read Featured Story
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
