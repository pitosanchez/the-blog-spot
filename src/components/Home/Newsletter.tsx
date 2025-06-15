export const Newsletter = () => {
  return (
    <section className="py-20 bg-forest-green bg-opacity-10">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-deep-purple mb-4">
            Join Our Storytelling Community
          </h2>
          <p className="text-lg text-charcoal mb-8">
            Get weekly stories, writing prompts, and community updates delivered
            to your inbox.
          </p>

          <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg border-2 border-charcoal border-opacity-20 focus:border-deep-purple focus:outline-none"
              required
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe Now
            </button>
          </form>

          <p className="text-sm text-charcoal text-opacity-60 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};
