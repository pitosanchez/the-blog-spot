// Route type definitions
export interface RouteConfig {
  path: string;
  title: string;
  element?: React.ComponentType;
  isComingSoon?: boolean;
  category?: string;
}

export interface RouteCategory {
  name: string;
  routes: RouteConfig[];
}

// Main navigation routes
export const MAIN_ROUTES: RouteConfig[] = [
  { path: "/", title: "Home" },
  { path: "/about", title: "About" },
  { path: "/membership", title: "Membership" },
  { path: "/community", title: "Community" },
  { path: "/submit", title: "Submit Your Story", isComingSoon: true },
  { path: "/categories", title: "All Categories", isComingSoon: true },
  { path: "/support", title: "Support", isComingSoon: true },
  { path: "/shop", title: "Shop", isComingSoon: true },
  { path: "/contact", title: "Contact", isComingSoon: true },
];

// Story category routes organized by theme
export const STORY_CATEGORIES: RouteCategory[] = [
  {
    name: "Personal Stories",
    routes: [
      {
        path: "/cornerstore-confessions",
        title: "Cornerstore Confessions",
        isComingSoon: true,
      },
      {
        path: "/letters-to-my-younger-self",
        title: "Letters to My Younger Self",
        isComingSoon: true,
      },
      { path: "/first-times", title: "First Times", isComingSoon: true },
    ],
  },
  {
    name: "Creative Expression",
    routes: [
      { path: "/poetry", title: "Poetry", isComingSoon: false }, // Already implemented
    ],
  },
  {
    name: "Relationships & Connection",
    routes: [
      { path: "/love", title: "Love", isComingSoon: true },
      { path: "/relationships", title: "Relationships", isComingSoon: true },
      {
        path: "/family-community",
        title: "Family & Community",
        isComingSoon: true,
      },
    ],
  },
  {
    name: "Resilience & Growth",
    routes: [
      {
        path: "/triumph-survival",
        title: "Triumph & Survival",
        isComingSoon: true,
      },
      { path: "/overcoming", title: "Overcoming", isComingSoon: true },
      { path: "/illness", title: "Illness", isComingSoon: true },
      { path: "/loneliness", title: "Loneliness", isComingSoon: true },
    ],
  },
  {
    name: "Values & Purpose",
    routes: [
      { path: "/environment", title: "Environment", isComingSoon: true },
      { path: "/spirituality", title: "Spirituality", isComingSoon: true },
      { path: "/kindness", title: "Kindness", isComingSoon: true },
    ],
  },
  {
    name: "Culture & Identity",
    routes: [
      {
        path: "/roots-heritage",
        title: "Roots & Heritage",
        isComingSoon: true,
      },
      { path: "/humor-joy", title: "Humor & Joy", isComingSoon: true },
    ],
  },
];

// Flatten all story routes for easy access
export const ALL_STORY_ROUTES = STORY_CATEGORIES.flatMap(
  (category) => category.routes
);

// Get all routes (main + stories)
export const ALL_ROUTES = [...MAIN_ROUTES, ...ALL_STORY_ROUTES];

// Helper function to get route by path
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  return ALL_ROUTES.find((route) => route.path === path);
};

// Helper function to get routes by category
export const getRoutesByCategory = (categoryName: string): RouteConfig[] => {
  const category = STORY_CATEGORIES.find((cat) => cat.name === categoryName);
  return category ? category.routes : [];
};
