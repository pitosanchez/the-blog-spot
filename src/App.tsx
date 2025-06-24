import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { SEOHead } from "./components/SEO/SEOHead";
import { Header } from "./components/Layout/Header";
import { Footer } from "./components/Layout/Footer";
import { Hero } from "./components/Home/Hero";
import { CreatorShowcase } from "./components/Home/CreatorShowcase";
import { Features } from "./components/Home/Features";
import { CreatorCTA } from "./components/Home/CreatorCTA";
import { ComingSoonPage } from "./pages/ComingSoon";
import { AppProvider } from "./contexts/AppContext";
import { MAIN_ROUTES } from "./config/routes";
import { analytics } from "./utils/analytics";
import "./utils/pwa"; // Initialize PWA functionality

// Lazy load pages for better performance
const About = lazy(() => import("./pages/About"));
const Membership = lazy(() => import("./pages/Membership"));
const Community = lazy(() => import("./pages/Community"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Pricing = lazy(() => import("./pages/Pricing"));
const GetStarted = lazy(() => import("./pages/GetStarted"));
const Creators = lazy(() => import("./pages/Creators"));

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
    <CreatorShowcase />
    <Features />
    <CreatorCTA />
  </>
);

// 404 page component
const NotFoundPage = () => (
  <div className="container-custom py-16 text-center min-h-[60vh] flex flex-col items-center justify-center">
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
);

function App() {
  return (
    <AppProvider>
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
                      {/* Home page */}
                      <Route path="/" element={<HomePage />} />

                      {/* Static pages with custom components */}
                      <Route path="/about" element={<About />} />
                      <Route path="/membership" element={<Membership />} />
                      <Route path="/community" element={<Community />} />
                      <Route path="/how-it-works" element={<HowItWorks />} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/get-started" element={<GetStarted />} />
                      <Route path="/creators" element={<Creators />} />

                      {/* Dynamic routes from configuration */}
                      {MAIN_ROUTES.filter(
                        (route) => route.isComingSoon && route.path !== "/"
                      ).map((route) => (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={
                            <ComingSoonPage
                              title={route.title}
                              description={`We're working on bringing you amazing ${route.title.toLowerCase()} content. Check back soon!`}
                            />
                          }
                        />
                      ))}

                      {/* 404 page */}
                      <Route path="*" element={<NotFoundPage />} />
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
    </AppProvider>
  );
}

export default App;
