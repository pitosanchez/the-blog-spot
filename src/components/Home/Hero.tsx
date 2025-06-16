import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroBg from "../../assets/blogspot-hero.png";

const quotes = [
  {
    text: "Every corner store has a story. Every story has a home.",
    author: "The Blog Spot",
  },
  {
    text: "Where community meets creativity, magic happens.",
    author: "Our Readers",
  },
  {
    text: "Your truth deserves to be heard.",
    author: "The Blog Spot",
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
      className="relative h-[clamp(600px,90vh,1000px)] flex items-center justify-center py-8 md:py-16 lg:py-24 border-b-4 border-bodega-brick overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay for readability */}
      <div
        className="absolute inset-0 bg-storyteller-cream bg-opacity-70"
        aria-hidden="true"
      ></div>
      <div className="container-custom relative z-10 flex flex-col lg:flex-row items-center gap-6 md:gap-8 lg:gap-12 h-full">
        {/* Left: Headline and CTA */}
        <div className="flex-1 text-center lg:text-left flex flex-col justify-center px-4 md:px-6 lg:px-0">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-vintage-ink leading-tight mb-3 md:mb-4 drop-shadow-lg">
            Every Story Matters.
            <br />
            <span className="text-bodega-brick">Every Voice Belongs.</span>
          </h1>
          <p className="text-lg md:text-xl text-community-teal font-source mb-3 md:mb-4 max-w-xl mx-auto lg:mx-0 drop-shadow">
            The Blog Spot is a home for real stories, memories, and truths from
            people of every background. Whether you're sharing a poem, a photo
            essay, a confession, or a family recipe—your voice is welcome here.
          </p>
          <p className="text-sm md:text-base text-vintage-ink font-source mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0 drop-shadow">
            All backgrounds. All experiences. All forms. Share your truth, your
            humor, your heart—your way.
          </p>
          {/* Rotating Quotes Section */}
          <div className="mb-6 md:mb-8 w-full max-w-[300px] md:max-w-[400px] mx-auto lg:mx-0 h-[clamp(120px,15vh,180px)]">
            <div className="bg-white bg-opacity-80 rounded-xl p-4 md:p-5 shadow-lg border-l-4 border-bodega-brick h-full flex flex-col justify-center">
              <p className="text-base md:text-lg text-vintage-ink font-lora italic mb-2 md:mb-3">
                "{quotes[currentQuote].text}"
              </p>
              <p className="text-sm md:text-base text-community-teal font-source text-right">
                — {quotes[currentQuote].author}
              </p>
            </div>
          </div>
          <Link
            to="/submit"
            className="btn-primary px-4 py-2 text-sm md:text-base font-bold inline-block shadow-lg hover:scale-105 transition-transform font-source rounded-full w-[180px] md:w-[200px] mx-auto lg:mx-0"
          >
            Share Your Story
          </Link>
        </div>
        {/* Right: Featured Story Card */}
        <div className="flex-1 flex justify-center lg:justify-end items-end lg:items-center px-4 md:px-6 lg:px-0">
          <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-xl border-4 border-community-teal w-full max-w-[280px] sm:max-w-[320px] md:max-w-md p-4 md:p-6 lg:p-8 flex flex-col items-center md:mb-8 md:mr-4">
            <div className="w-full h-32 md:h-48 bg-storyteller-cream bg-opacity-60 rounded-xl mb-4 md:mb-6 flex items-center justify-center overflow-hidden">
              <span className="text-5xl md:text-7xl text-bodega-brick font-playfair">
                ✍️
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-playfair font-bold text-vintage-ink mb-2 text-center drop-shadow">
              "Cornerstore Confessions: The Day I Found My Voice"
            </h2>
            <p className="text-sm md:text-base text-community-teal font-source text-center mb-4 drop-shadow">
              "I never thought a simple trip to the bodega would change my life.
              But that day, surrounded by the hum of refrigerators and the smell
              of fresh bread, I finally spoke my truth."
            </p>
            <Link
              to="/cornerstore-confessions"
              className="btn-secondary px-4 md:px-6 py-2 text-sm md:text-base font-bold mt-2 font-source rounded-full w-full md:w-auto"
            >
              Read Featured Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
