import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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

// Auth pages
const Login = lazy(() => import("./components/Auth/Login"));
const Signup = lazy(() => import("./components/Auth/Signup"));

// Dashboard pages
const DashboardLayout = lazy(() => import("./components/Dashboard/DashboardLayout"));
const DashboardOverview = lazy(() => import("./pages/Dashboard/Overview"));
const DashboardPosts = lazy(() => import("./pages/Dashboard/Posts"));
const PostEditor = lazy(() => import("./pages/Dashboard/PostEditor"));
const BecomeCreator = lazy(() => import("./pages/BecomeCreator"));

// Enhanced loading component
const PageLoader = () => (
  <div
    className="flex flex-col items-center justify-center min-h-[50vh] space-y-4"
    role="status"
    aria-label="Loading page content"
  >
    <LoadingSpinner size="lg" color="primary" />
    <p className="text-creative-teal font-source">Loading content...</p>
    <span className="sr-only">Loading page content, please wait</span>
  </div>
);

// Error handler for development
const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
  // In production, send to error tracking service
  if (import.meta.env.DEV) {
    console.error("Application Error:", error, errorInfo);
  }
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
    <h1 className="text-4xl font-bold text-slate-ink mb-4">
      404 - Page Not Found
    </h1>
    <p className="text-creative-teal mb-8">
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

                    {/* Auth routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/become-creator" element={<BecomeCreator />} />

                    {/* Dashboard routes */}
                    <Route path="/dashboard" element={<DashboardLayout />}>
                      <Route index element={<DashboardOverview />} />
                      <Route path="posts" element={<DashboardPosts />} />
                      <Route path="posts/new" element={<PostEditor />} />
                      <Route path="posts/:id/edit" element={<PostEditor />} />
                    </Route>

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
        </div>
      </ErrorBoundary>
    </AppProvider>
  );
}

export default App;
