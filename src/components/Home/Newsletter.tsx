export const Newsletter = () => {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-forest-green bg-opacity-10">
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-deep-purple mb-3 md:mb-4">
            Join Our Storytelling Community
          </h2>
          <p className="text-base md:text-lg text-charcoal mb-6 md:mb-8">
            Get weekly stories, writing prompts, and community updates delivered
            to your inbox.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 md:px-6 py-2 md:py-3 rounded-lg border-2 border-charcoal border-opacity-20 focus:border-deep-purple focus:outline-none text-sm md:text-base"
              required
            />
            <button
              type="submit"
              className="btn-primary text-sm md:text-base px-4 md:px-6 py-2 md:py-3 whitespace-nowrap"
            >
              Subscribe Now
            </button>
          </form>

          <p className="text-xs md:text-sm text-charcoal text-opacity-60 mt-3 md:mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};
