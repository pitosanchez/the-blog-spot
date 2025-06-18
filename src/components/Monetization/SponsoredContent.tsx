import { memo } from "react";
import { Button } from "../ui/Button";

interface SponsoredPost {
  id: string;
  title: string;
  excerpt: string;
  sponsor: {
    name: string;
    logo: string;
    website: string;
  };
  image: string;
  ctaText: string;
  ctaUrl: string;
  category: string;
  featured?: boolean;
}

interface SponsoredContentProps {
  posts?: SponsoredPost[];
  layout?: "grid" | "list" | "featured";
  showDisclaimer?: boolean;
  onPostClick?: (postId: string, ctaUrl: string) => void;
}

const DEFAULT_SPONSORED_POSTS: SponsoredPost[] = [
  {
    id: "local-business-stories",
    title: "Supporting Local: How Small Businesses Shape Our Communities",
    excerpt:
      "Discover the heartwarming stories behind your favorite local businesses and how they create lasting connections in our neighborhoods.",
    sponsor: {
      name: "Local Business Alliance",
      logo: "/images/sponsors/lba-logo.png",
      website: "https://localbusinessalliance.com",
    },
    image: "/images/sponsored/local-business.jpg",
    ctaText: "Find Local Businesses",
    ctaUrl: "https://localbusinessalliance.com/directory",
    category: "Community",
    featured: true,
  },
  {
    id: "mindful-writing",
    title: "The Healing Power of Journaling: Stories of Recovery and Growth",
    excerpt:
      "Learn how therapeutic writing has helped people process trauma, find clarity, and build resilience through personal storytelling.",
    sponsor: {
      name: "Mindful Journaling Co.",
      logo: "/images/sponsors/mindful-logo.png",
      website: "https://mindfuljournaling.com",
    },
    image: "/images/sponsored/journaling.jpg",
    ctaText: "Start Your Journey",
    ctaUrl: "https://mindfuljournaling.com/starter-kit",
    category: "Wellness",
  },
  {
    id: "cultural-exchange",
    title:
      "Bridging Cultures Through Food: Immigration Stories at the Dinner Table",
    excerpt:
      "Explore how food traditions connect generations and preserve cultural identity in immigrant families across America.",
    sponsor: {
      name: "Cultural Kitchen",
      logo: "/images/sponsors/cultural-kitchen-logo.png",
      website: "https://culturalkitchen.org",
    },
    image: "/images/sponsored/cultural-food.jpg",
    ctaText: "Explore Recipes",
    ctaUrl: "https://culturalkitchen.org/recipes",
    category: "Culture",
  },
];

export const SponsoredContent = memo<SponsoredContentProps>(
  ({
    posts = DEFAULT_SPONSORED_POSTS,
    layout = "grid",
    showDisclaimer = true,
    onPostClick,
  }) => {
    const handlePostClick = (post: SponsoredPost) => {
      if (onPostClick) {
        onPostClick(post.id, post.ctaUrl);
      } else {
        window.open(post.ctaUrl, "_blank", "noopener,noreferrer");
      }
    };

    const featuredPost = posts.find((post) => post.featured);

    if (layout === "featured" && featuredPost) {
      return (
        <section className="py-12 md:py-16 bg-gradient-to-r from-storyteller-cream to-cream">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            {showDisclaimer && (
              <div className="text-center mb-8">
                <span className="inline-block bg-bodega-brick text-white px-4 py-2 rounded-full text-sm font-medium">
                  Sponsored Content
                </span>
              </div>
            )}

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="md:flex">
                {/* Image */}
                <div className="md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-community-teal to-bodega-brick flex items-center justify-center">
                  <div className="text-white text-6xl opacity-30">📖</div>
                </div>

                {/* Content */}
                <div className="md:w-1/2 p-8">
                  {/* Sponsor Info */}
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">
                        {featuredPost.sponsor.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Sponsored by{" "}
                        <strong>{featuredPost.sponsor.name}</strong>
                      </p>
                      <span className="text-xs text-bodega-brick bg-bodega-brick/10 px-2 py-1 rounded">
                        {featuredPost.category}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-vintage-ink mb-4">
                    {featuredPost.title}
                  </h2>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() => handlePostClick(featuredPost)}
                      variant="primary"
                      size="lg"
                      className="flex-1"
                    >
                      {featuredPost.ctaText}
                    </Button>
                    <Button
                      href={featuredPost.sponsor.website}
                      variant="outline"
                      size="lg"
                      external
                      className="flex-1"
                    >
                      About {featuredPost.sponsor.name}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            {showDisclaimer && (
              <div className="mb-4">
                <span className="inline-block bg-bodega-brick text-white px-4 py-2 rounded-full text-sm font-medium">
                  Sponsored Content
                </span>
              </div>
            )}
            <h2 className="text-3xl md:text-4xl font-bold text-vintage-ink mb-4">
              Community Partners & Stories
            </h2>
            <p className="text-lg text-community-teal max-w-2xl mx-auto">
              Discover meaningful content from our trusted partners who share
              our values of authentic storytelling and community building.
            </p>
          </header>

          <div
            className={`grid gap-8 ${
              layout === "list"
                ? "grid-cols-1 max-w-3xl mx-auto"
                : "md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Post Image */}
                <div className="h-48 bg-gradient-to-br from-community-teal to-bodega-brick flex items-center justify-center relative">
                  <div className="text-white text-4xl opacity-30">📖</div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className="text-xs font-medium text-vintage-ink">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Sponsor Info */}
                  <div className="flex items-center mb-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full mr-2 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">
                        {post.sponsor.name.charAt(0)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Sponsored by <strong>{post.sponsor.name}</strong>
                    </p>
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-lg text-vintage-ink mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* CTA */}
                  <Button
                    onClick={() => handlePostClick(post)}
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    {post.ctaText}
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {showDisclaimer && (
            <div className="mt-12 p-4 bg-white rounded-lg border border-gray-200 text-center">
              <p className="text-xs text-gray-600">
                <strong>Sponsored Content Disclosure:</strong> This content is
                sponsored by our partners. We maintain editorial independence
                and only work with organizations that align with our community
                values. All sponsored content is clearly labeled and provides
                genuine value to our readers.
              </p>
            </div>
          )}
        </div>
      </section>
    );
  }
);

SponsoredContent.displayName = "SponsoredContent";
