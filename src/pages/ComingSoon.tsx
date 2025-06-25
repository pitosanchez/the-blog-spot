import { memo } from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "../components/SEO/SEOHead";

interface ComingSoonPageProps {
  title: string;
  description?: string;
}

export const ComingSoonPage = memo<ComingSoonPageProps>(
  ({
    title,
    description = "This section is coming soon. We're working hard to bring you amazing content!",
  }) => {
    return (
      <>
        <SEOHead
          title={`${title} - Coming Soon`}
          description={description}
          noIndex={true} // Don't index coming soon pages
        />

        <div className="container-custom py-16 md:py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-slate-ink mb-6">
              {title}
            </h1>

            <p className="text-xl md:text-2xl text-creative-teal mb-8 font-source">
              Coming Soon...
            </p>

            <p className="text-lg text-slate-ink/80 mb-12 font-source leading-relaxed">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-deep-plum text-pure-white font-source font-semibold rounded-lg hover:bg-deep-plum/90 transition-colors duration-200"
              >
                Return Home
              </Link>

              <Link
                to="/newsletter"
                className="inline-block px-6 py-3 border-2 border-creative-teal text-creative-teal font-source font-semibold rounded-lg hover:bg-deep-plum hover:text-pure-white transition-colors duration-200"
              >
                Get Notified
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }
);

ComingSoonPage.displayName = "ComingSoonPage";
