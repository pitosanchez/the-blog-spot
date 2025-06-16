const categories = [
  {
    title: "First-Generation Stories",
    description: "Tales of new beginnings and cultural bridges",
    icon: "🌉",
  },
  {
    title: "Neighborhood Memories",
    description: "Stories that shaped our communities",
    icon: "🏘️",
  },
  {
    title: "Family Traditions",
    description: "Legacies passed down through generations",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    title: "Cultural Fusion",
    description: "Where different worlds meet and create magic",
    icon: "✨",
  },
  {
    title: "Street Wisdom",
    description: "Life lessons learned on the corner",
    icon: "🧠",
  },
  {
    title: "Community Heroes",
    description: "Everyday people doing extraordinary things",
    icon: "🦸‍♂️",
  },
];

export const Categories = () => {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-cream">
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-deep-purple mb-3 md:mb-4">
            Explore Our Stories
          </h2>
          <p className="text-base md:text-lg text-charcoal max-w-2xl mx-auto px-4">
            Discover stories that resonate with your experiences and share your
            own journey with our community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="card hover:border-warm-terracotta border-2 border-transparent transition-all duration-200 p-4 md:p-6"
            >
              <div className="text-3xl md:text-4xl mb-3 md:mb-4">
                {category.icon}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-deep-purple mb-2">
                {category.title}
              </h3>
              <p className="text-sm md:text-base text-charcoal text-opacity-80">
                {category.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <button className="btn-primary text-sm md:text-base px-4 md:px-6 py-2 md:py-3">
            View All Categories
          </button>
        </div>
      </div>
    </section>
  );
};
