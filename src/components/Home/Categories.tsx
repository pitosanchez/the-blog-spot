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
    <section className="py-20 bg-cream">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-deep-purple mb-4">
            Explore Our Stories
          </h2>
          <p className="text-lg text-charcoal max-w-2xl mx-auto">
            Discover stories that resonate with your experiences and share your
            own journey with our community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="card hover:border-warm-terracotta border-2 border-transparent transition-all duration-200"
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-bold text-deep-purple mb-2">
                {category.title}
              </h3>
              <p className="text-charcoal text-opacity-80">
                {category.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="btn-primary">View All Categories</button>
        </div>
      </div>
    </section>
  );
};
