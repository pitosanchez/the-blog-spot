import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { SEOHead } from "./components/SEO/SEOHead";
import { CategoryPage } from "./components/CategoryPage";
import { Header } from "./components/Layout/Header";
import { Footer } from "./components/Layout/Footer";
import { Hero } from "./components/Home/Hero";
import { Categories } from "./components/Home/Categories";
import { Newsletter } from "./components/Home/Newsletter";
import { analytics } from "./utils/analytics";
import "./utils/pwa"; // Initialize PWA functionality

// Lazy load pages for better performance
const About = lazy(() => import("./pages/About"));
const Membership = lazy(() => import("./pages/Membership"));
const Community = lazy(() => import("./pages/Community"));

// Enhanced loading component
const PageLoader = () => (
  <div
    className="flex flex-col items-center justify-center min-h-[50vh] space-y-4"
    role="status"
    aria-label="Loading page content"
  >
    <LoadingSpinner size="lg" color="primary" />
    <p className="text-community-teal font-source">Loading content...</p>
    <span className="sr-only">Loading page content, please wait</span>
  </div>
);

// Error handler for development
const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
  console.error("Application Error:", error, errorInfo);
  // In production, send to error tracking service
};

// Analytics tracker component
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views
    analytics.trackPageView(location.pathname, document.title);
  }, [location]);

  return null;
};

// Home page component
const HomePage = () => (
  <>
    <SEOHead />
    <Hero />
    <Categories />
    <Newsletter />
  </>
);

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary onError={handleError}>
        <div className="min-h-screen bg-cream">
          <BrowserRouter basename="/the-blog-spot">
            <div className="flex flex-col min-h-screen">
              <ErrorBoundary>
                <Header />
              </ErrorBoundary>

              <main className="flex-1" role="main">
                <ErrorBoundary>
                  <AnalyticsTracker />
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/membership" element={<Membership />} />
                      {/* Placeholder routes for future pages */}
                      <Route
                        path="/submit"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-3xl font-bold text-vintage-ink">
                              Submit Your Story
                            </h1>
                            <p className="mt-4 text-community-teal">
                              Coming soon...
                            </p>
                          </div>
                        }
                      />
                      <Route
                        path="/categories"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-3xl font-bold text-vintage-ink">
                              All Categories
                            </h1>
                            <p className="mt-4 text-community-teal">
                              Coming soon...
                            </p>
                          </div>
                        }
                      />
                      <Route path="/community" element={<Community />} />
                      <Route
                        path="/support"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-3xl font-bold text-vintage-ink">
                              Support
                            </h1>
                            <p className="mt-4 text-community-teal">
                              Coming soon...
                            </p>
                          </div>
                        }
                      />
                      <Route
                        path="/shop"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-3xl font-bold text-vintage-ink">
                              Shop
                            </h1>
                            <p className="mt-4 text-community-teal">
                              Coming soon...
                            </p>
                          </div>
                        }
                      />
                      <Route
                        path="/contact"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-3xl font-bold text-vintage-ink">
                              Contact
                            </h1>
                            <p className="mt-4 text-community-teal">
                              Coming soon...
                            </p>
                          </div>
                        }
                      />

                      {/* Story category routes */}
                      <Route
                        path="/cornerstore-confessions"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-3xl font-bold text-vintage-ink">
                              Cornerstore Confessions
                            </h1>
                            <p className="mt-4 text-community-teal">
                              Coming soon...
                            </p>
                          </div>
                        }
                      />
                      <Route
                        path="/letters-to-my-younger-self"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-3xl font-bold text-vintage-ink">
                              Letters to My Younger Self
                            </h1>
                            <p className="mt-4 text-community-teal">
                              Coming soon...
                            </p>
                          </div>
                        }
                      />
                      <Route
                        path="/first-times"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-3xl font-bold text-vintage-ink">
                              First Times
                            </h1>
                            <p className="mt-4 text-community-teal">
                              Coming soon...
                            </p>
                          </div>
                        }
                      />
                      <Route
                        path="/poetry"
                        element={<CategoryPage categorySlug="poetry" />}
                      />
                      <Route
                        path="/love"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-3xl font-bold text-vintage-ink">
                              Love
                            </h1>
                            <p className="mt-4 text-community-teal">
                              Coming soon...
                            </p>
                          </div>
                        }
                      />
                      <Route
                        path="/relationships"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-3xl font-bold text-vintage-ink">
                              Relationships
                            </h1>
                            <p className="mt-4 text-community-teal">
                              Coming soon...
                            </p>
                          </div>
                        }
                      />
                      <Route
                        path="/family-community"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-3xl font-bold text-vintage-ink">
                              Family & Community
                            </h1>
                            <p className="mt-4 text-community-teal">
                              Coming soon...
                            </p>
                          </div>
                        }
                      />
                      <Route
                        path="/triumph-survival"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-3xl font-bold text-vintage-ink">
                              Triumph & Survival
                            </h1>
                            <p className="mt-4 text-community-teal">
                              Coming soon...
                            </p>
                          </div>
                        }
                      />
                      <Route
                        path="/overcoming"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-3xl font-bold text-vintage-ink">
                              Overcoming
                            </h1>
                            <p className="mt-4 text-community-teal">
                              Coming soon...
                            </p>
                          </div>
                        }
                      />
                      <Route
                        path="/illness"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-3xl font-bold text-vintage-ink">
                              Illness
                            </h1>
                            <p className="mt-4 text-community-teal">
                              Coming soon...
                            </p>
                          </div>
                        }
                      />
                      <Route
                        path="/loneliness"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-3xl font-bold text-vintage-ink">
                              Loneliness
                            </h1>
                            <p className="mt-4 text-community-teal">
                              Coming soon...
                            </p>
                          </div>
                        }
                      />
                      <Route
                        path="/environment"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-3xl font-bold text-vintage-ink">
                              Environment
                            </h1>
                            <p className="mt-4 text-community-teal">
                              Coming soon...
                            </p>
                          </div>
                        }
                      />
                      <Route
                        path="/spirituality"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-3xl font-bold text-vintage-ink">
                              Spirituality
                            </h1>
                            <p className="mt-4 text-community-teal">
                              Coming soon...
                            </p>
                          </div>
                        }
                      />
                      <Route
                        path="/kindness"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-3xl font-bold text-vintage-ink">
                              Kindness
                            </h1>
                            <p className="mt-4 text-community-teal">
                              Coming soon...
                            </p>
                          </div>
                        }
                      />
                      <Route
                        path="/roots-heritage"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-3xl font-bold text-vintage-ink">
                              Roots & Heritage
                            </h1>
                            <p className="mt-4 text-community-teal">
                              Coming soon...
                            </p>
                          </div>
                        }
                      />
                      <Route
                        path="/humor-joy"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-3xl font-bold text-vintage-ink">
                              Humor & Joy
                            </h1>
                            <p className="mt-4 text-community-teal">
                              Coming soon...
                            </p>
                          </div>
                        }
                      />

                      {/* 404 page */}
                      <Route
                        path="*"
                        element={
                          <div className="container-custom py-16 text-center">
                            <h1 className="text-4xl font-bold text-vintage-ink mb-4">
                              404 - Page Not Found
                            </h1>
                            <p className="text-community-teal mb-8">
                              The page you're looking for doesn't exist.
                            </p>
                            <a href="/" className="btn-primary">
                              Go Home
                            </a>
                          </div>
                        }
                      />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
              </main>

              <ErrorBoundary>
                <Footer />
              </ErrorBoundary>
            </div>
          </BrowserRouter>
        </div>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
