import { memo } from "react";
import { SEOHead } from "../components/SEO/SEOHead";

export const Community = memo(() => {
  return (
    <>
      <SEOHead
        title="Community Features - The Blog Spot"
        description="Experience our vibrant community features including social sharing, interactive comments, story ratings, and user profiles."
        keywords={[
          "community",
          "social sharing",
          "comments",
          "ratings",
          "user profiles",
        ]}
        url="/community"
        type="website"
      />

      <section className="py-16 md:py-24 bg-gradient-to-br from-community-teal to-bodega-brick text-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Community Engagement Features
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 opacity-90">
            Discover how our community features bring storytellers together
            through meaningful interactions, feedback, and connections.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-vintage-ink mb-4">
              Community Features Coming Soon
            </h2>
            <p className="text-lg text-community-teal">
              We're building amazing community features for storytellers.
            </p>
          </div>
        </div>
      </section>
    </>
  );
});

Community.displayName = "Community";

export default Community;
