import { memo } from "react";
import { SEOHead } from "./SEO/SEOHead";
import { CATEGORY_SEO_DATA } from "../constants";

interface CategoryPageProps {
  categorySlug: keyof typeof CATEGORY_SEO_DATA;
  children?: React.ReactNode;
}

export const CategoryPage = memo<CategoryPageProps>(
  ({ categorySlug, children }) => {
    const seoData = CATEGORY_SEO_DATA[categorySlug];

    if (!seoData) {
      console.warn(`No SEO data found for category: ${categorySlug}`);
    }

    return (
      <>
        {seoData && (
          <SEOHead
            title={seoData.title}
            description={seoData.description}
            keywords={[...seoData.keywords]}
            url={`/${categorySlug}`}
            type="website"
            canonical={`https://theblogspot.com/${categorySlug}`}
          />
        )}

        <div className="container-custom py-16 text-center min-h-[60vh] flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-vintage-ink mb-6">
            {seoData?.title || "Story Category"}
          </h1>

          {seoData && (
            <p className="text-lg text-community-teal mb-8 max-w-2xl mx-auto">
              {seoData.description}
            </p>
          )}

          {children || (
            <div className="space-y-4">
              <p className="text-community-teal">Coming soon...</p>
              <p className="text-sm text-gray-600">
                This category will feature amazing stories from our community.
              </p>
            </div>
          )}

          {/* Call to action */}
          <div className="mt-12 p-6 bg-cream rounded-lg border-2 border-bodega-brick max-w-md mx-auto">
            <h2 className="text-xl font-bold text-vintage-ink mb-3">
              Have a story to share?
            </h2>
            <p className="text-community-teal mb-4">
              We'd love to feature your story in this category.
            </p>
            <a
              href="/submit"
              className="inline-block bg-bodega-brick text-white px-6 py-2 rounded-full hover:bg-community-teal transition-colors"
            >
              Submit Your Story
            </a>
          </div>
        </div>
      </>
    );
  }
);

CategoryPage.displayName = "CategoryPage";
