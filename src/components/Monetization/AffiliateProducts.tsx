import { memo } from "react";
import { Button } from "../ui/Button";

interface AffiliateProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
  affiliateUrl: string;
  category: "books" | "tools" | "courses" | "software";
  rating: number;
  features: string[];
  badge?: string;
}

interface AffiliateProductsProps {
  category?: "books" | "tools" | "courses" | "software" | "all";
  limit?: number;
  onProductClick?: (productId: string, affiliateUrl: string) => void;
}

const AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  {
    id: "writers-journal",
    name: "The Storyteller's Journal",
    description:
      "A beautifully crafted journal with writing prompts, story starters, and space for your creative thoughts.",
    price: "$24.99",
    originalPrice: "$34.99",
    image: "/images/writers-journal.jpg",
    affiliateUrl: "https://amazon.com/writers-journal?ref=blogspot",
    category: "tools",
    rating: 4.8,
    features: [
      "300+ writing prompts",
      "Hardcover binding",
      "Ribbon bookmark",
      "Acid-free paper",
    ],
    badge: "Bestseller",
  },
  {
    id: "grammarly-premium",
    name: "Grammarly Premium",
    description:
      "Advanced writing assistant that helps you write with confidence and clarity.",
    price: "$12/month",
    image: "/images/grammarly.jpg",
    affiliateUrl: "https://grammarly.com/premium?ref=blogspot",
    category: "software",
    rating: 4.6,
    features: [
      "Grammar & spell check",
      "Style suggestions",
      "Plagiarism detection",
      "Tone detector",
    ],
  },
  {
    id: "bird-by-bird",
    name: "Bird by Bird by Anne Lamott",
    description:
      "The classic guide to writing and life - essential reading for every storyteller.",
    price: "$16.99",
    originalPrice: "$18.99",
    image: "/images/bird-by-bird.jpg",
    affiliateUrl: "https://amazon.com/bird-by-bird?ref=blogspot",
    category: "books",
    rating: 4.9,
    features: [
      "320 pages",
      "Paperback edition",
      "Writing exercises",
      "Life lessons",
    ],
    badge: "Staff Pick",
  },
  {
    id: "masterclass-writing",
    name: "MasterClass: Writing",
    description:
      "Learn from bestselling authors like Margaret Atwood, Neil Gaiman, and more.",
    price: "$180/year",
    image: "/images/masterclass.jpg",
    affiliateUrl: "https://masterclass.com/writing?ref=blogspot",
    category: "courses",
    rating: 4.7,
    features: [
      "20+ instructors",
      "Video lessons",
      "Workbooks",
      "Community access",
    ],
  },
  {
    id: "scrivener",
    name: "Scrivener 3",
    description:
      "The industry-standard writing software for serious writers and storytellers.",
    price: "$59.99",
    image: "/images/scrivener.jpg",
    affiliateUrl: "https://scrivener.com?ref=blogspot",
    category: "software",
    rating: 4.5,
    features: [
      "Project organization",
      "Research tools",
      "Export options",
      "Cross-platform",
    ],
  },
  {
    id: "writing-retreat",
    name: "Online Writing Retreat",
    description:
      "A transformative 3-day virtual retreat focused on personal storytelling.",
    price: "$297",
    originalPrice: "$397",
    image: "/images/retreat.jpg",
    affiliateUrl: "https://writingretreat.com?ref=blogspot",
    category: "courses",
    rating: 4.9,
    features: [
      "3 days of sessions",
      "Small group coaching",
      "Workbook included",
      "Lifetime access",
    ],
    badge: "Limited Time",
  },
];

export const AffiliateProducts = memo<AffiliateProductsProps>(
  ({ category = "all", limit = 6, onProductClick }) => {
    const filteredProducts =
      category === "all"
        ? AFFILIATE_PRODUCTS
        : AFFILIATE_PRODUCTS.filter((product) => product.category === category);

    const displayProducts = filteredProducts.slice(0, limit);

    const handleProductClick = (product: AffiliateProduct) => {
      if (onProductClick) {
        onProductClick(product.id, product.affiliateUrl);
      } else {
        // Default behavior - open affiliate link
        window.open(product.affiliateUrl, "_blank", "noopener,noreferrer");
      }
    };

    const getCategoryIcon = (cat: string) => {
      switch (cat) {
        case "books":
          return "📚";
        case "tools":
          return "✏️";
        case "courses":
          return "🎓";
        case "software":
          return "💻";
        default:
          return "📦";
      }
    };

    return (
      <section className="py-16 md:py-20 bg-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-vintage-ink mb-4">
              Recommended Writing Resources
            </h2>
            <p className="text-lg text-community-teal max-w-2xl mx-auto">
              Hand-picked tools, books, and courses to help you on your
              storytelling journey.
              <span className="text-sm block mt-2 text-gray-600">
                We may earn a commission from purchases made through these
                links.
              </span>
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-cream to-storyteller-cream flex items-center justify-center">
                  {product.badge && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-bodega-brick text-white px-2 py-1 rounded-full text-xs font-bold">
                        {product.badge}
                      </span>
                    </div>
                  )}
                  <div className="text-6xl opacity-20">
                    {getCategoryIcon(product.category)}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white rounded-full px-2 py-1">
                    <span className="text-xs font-medium text-vintage-ink">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Product Header */}
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-vintage-ink mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400 mr-2">
                        {"★".repeat(Math.floor(product.rating))}
                        {product.rating % 1 !== 0 && "☆"}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product.rating})
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-1 mb-4">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-xs text-gray-600"
                      >
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-bodega-brick">
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={() => handleProductClick(product)}
                      variant="primary"
                      size="sm"
                      className="text-sm"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-12 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-xs text-gray-600">
              <strong>Affiliate Disclosure:</strong> Some of the links above are
              affiliate links, which means we may earn a small commission if you
              make a purchase through them. This helps support The Blog Spot
              community at no additional cost to you. We only recommend products
              we genuinely believe will help your storytelling journey.
            </p>
          </div>
        </div>
      </section>
    );
  }
);

AffiliateProducts.displayName = "AffiliateProducts";
