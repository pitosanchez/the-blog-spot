// Route type definitions
export interface RouteConfig {
  path: string;
  title: string;
  element?: React.ComponentType;
  isComingSoon?: boolean;
  category?: string;
}

// Main navigation routes
export const MAIN_ROUTES: RouteConfig[] = [
  { path: "/", title: "Home" },
  { path: "/about", title: "About" },
  { path: "/how-it-works", title: "How It Works" },
  { path: "/pricing", title: "Pricing" },
  { path: "/creators", title: "Medical Creators" },
  { path: "/compliance", title: "Compliance" },
  { path: "/get-started", title: "Get Started" },
  { path: "/membership", title: "Membership" },
  { path: "/community", title: "Community" },
  { path: "/help", title: "Help Center", isComingSoon: true },
  { path: "/contact", title: "Contact", isComingSoon: true },
  { path: "/terms", title: "Terms", isComingSoon: true },
  { path: "/privacy", title: "Privacy", isComingSoon: true },
];

// Helper function to get route by path
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  return MAIN_ROUTES.find((route) => route.path === path);
};
