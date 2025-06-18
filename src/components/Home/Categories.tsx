import { memo } from "react";
import type { CategoriesProps } from "../../types";
import { Button } from "../ui/Button";
import { STORY_CATEGORIES, FEATURED_STORY } from "../../constants";

export const Categories = memo<CategoriesProps>(
  ({ categories = STORY_CATEGORIES, onCategoryClick }) => {
    const handleCategoryClick = (category: (typeof categories)[0]) => {
      onCategoryClick?.(category);
    };

    return (
      <section
        className="py-12 md:py-16 lg:py-20 bg-cream w-full overflow-hidden"
        aria-labelledby="categories-heading"
      >
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-8 md:mb-12">
            <h2
              id="categories-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-deep-purple mb-3 md:mb-4"
            >
              Explore Our Stories
            </h2>
            <p className="text-base md:text-lg text-charcoal max-w-2xl mx-auto px-4">
              Discover stories that resonate with your experiences and share
              your own journey with our community.
            </p>
          </header>

          {/* Featured Story Card */}
          <div className="flex justify-center mb-8 md:mb-12">
            <article className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-xl border-4 border-community-teal w-full max-w-[320px] sm:max-w-[400px] md:max-w-lg p-4 md:p-6 lg:p-8 flex flex-col items-center">
              <div
                className="w-full h-32 md:h-48 bg-storyteller-cream bg-opacity-60 rounded-xl mb-4 md:mb-6 flex items-center justify-center overflow-hidden"
                aria-hidden="true"
              >
                <span className="text-5xl md:text-7xl text-bodega-brick font-playfair">
                  ✍️
                </span>
              </div>

              <header className="text-center mb-4">
                <h3 className="text-xl md:text-2xl font-playfair font-bold text-vintage-ink mb-2">
                  "{FEATURED_STORY.title}"
                </h3>

                <p className="text-sm md:text-base text-community-teal font-source">
                  {FEATURED_STORY.excerpt}
                </p>
              </header>

              <footer className="mt-auto">
                <Button
                  href={`/${FEATURED_STORY.slug}`}
                  variant="secondary"
                  size="md"
                  className="px-4 md:px-6 py-2 text-sm md:text-base font-bold font-source rounded-full w-full md:w-auto"
                >
                  Read Featured Story
                </Button>
              </footer>
            </article>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full"
            role="list"
            aria-label="Story categories"
          >
            {categories.map((category) => (
              <article
                key={category.id}
                className="card hover:border-warm-terracotta border-2 border-transparent transition-all duration-200 p-4 md:p-6 w-full focus-within:ring-2 focus-within:ring-bodega-brick focus-within:ring-opacity-50"
                role="listitem"
              >
                <div
                  className="text-3xl md:text-4xl mb-3 md:mb-4"
                  aria-hidden="true"
                >
                  {category.icon}
                </div>

                <header className="mb-4">
                  <h3 className="text-lg md:text-xl font-bold text-deep-purple mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm md:text-base text-charcoal text-opacity-80">
                    {category.description}
                  </p>
                </header>

                {category.postCount && (
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs md:text-sm text-community-teal font-medium">
                      {category.postCount} stories
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCategoryClick(category)}
                      className="text-xs md:text-sm hover:text-bodega-brick"
                    >
                      Explore →
                    </Button>
                  </div>
                )}
              </article>
            ))}
          </div>

          <footer className="text-center mt-8 md:mt-12">
            <Button
              href="/categories"
              variant="primary"
              size="md"
              className="text-sm md:text-base px-4 md:px-6 py-2 md:py-3 w-full sm:w-auto"
            >
              View All Categories
            </Button>
          </footer>
        </div>
      </section>
    );
  }
);

Categories.displayName = "Categories";
