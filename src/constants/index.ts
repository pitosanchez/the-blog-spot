import type { Quote } from "../types";

// Platform statistics for social proof
export const PLATFORM_STATS = {
  creators: "500+",
  monthlyReaders: "50K+",
  totalEarned: "$250K+",
  avgCreatorIncome: "$2,000/mo",
};

// Hero quotes for creator platform
export const CREATOR_HERO_QUOTES: Quote[] = [
  {
    text: "Keep 90% of your earnings. No complex analytics. Just write and get paid.",
    author: "The Blog Spot Promise",
  },
  {
    text: "I made my first $1,000 in month two. The simplicity is refreshing.",
    author: "Sarah Chen, Newsletter Writer",
  },
  {
    text: "Finally, a platform that doesn't take half my revenue.",
    author: "Marcus Johnson, Poet",
  },
  {
    text: "Built my entire coaching business here. Zero tech headaches.",
    author: "Elena Rodriguez, Life Coach",
  },
];

// Creator success stories for homepage
export const CREATOR_SUCCESS_STORIES = [
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    avatar: "/images/creators/sarah-chen.webp",
    niche: "Tech & Career",
    monthlyEarnings: "$3,200",
    subscribers: 850,
    quote: "I switched from Substack and doubled my income in 3 months.",
    featured: true,
  },
  {
    id: "marcus-johnson",
    name: "Marcus Johnson",
    avatar: "/images/creators/marcus-johnson.webp",
    niche: "Poetry & Prose",
    monthlyEarnings: "$1,800",
    subscribers: 450,
    quote: "The 90% revenue share changed everything for me.",
    featured: true,
  },
  {
    id: "elena-rodriguez",
    name: "Elena Rodriguez",
    avatar: "/images/creators/elena-rodriguez.webp",
    niche: "Wellness Coaching",
    monthlyEarnings: "$5,400",
    subscribers: 180,
    quote: "I run workshops and courses with zero platform interference.",
    featured: true,
  },
];

// Platform features for creators
export const CREATOR_FEATURES = [
  {
    id: "revenue-share",
    title: "Keep 90% of Earnings",
    description: "Industry-leading revenue share. We only take 10%.",
    icon: "💰",
  },
  {
    id: "simple-tools",
    title: "Simple Creator Tools",
    description: "Everything you need, nothing you don't. Focus on creating.",
    icon: "🛠️",
  },
  {
    id: "instant-payouts",
    title: "Weekly Payouts",
    description: "Get paid every week. No waiting 30+ days.",
    icon: "⚡",
  },
  {
    id: "own-audience",
    title: "Own Your Audience",
    description: "Export your subscriber list anytime. It's yours.",
    icon: "👥",
  },
  {
    id: "workshops",
    title: "Workshops & Courses",
    description: "Sell workshops, courses, and premium content easily.",
    icon: "🎓",
  },
  {
    id: "no-algorithms",
    title: "No Algorithm Games",
    description: "Your subscribers see everything you publish. Period.",
    icon: "📊",
  },
];

// Pricing tiers for creators
export const CREATOR_PRICING_OPTIONS = [
  {
    id: "free-posts",
    name: "Free Content",
    description: "Build your audience with free posts",
    features: ["Unlimited free posts", "Basic analytics", "Email subscribers"],
  },
  {
    id: "paid-subscriptions",
    name: "Paid Subscriptions",
    description: "Monetize with monthly subscriptions",
    features: [
      "Set your own price",
      "Recurring payments",
      "Member-only content",
    ],
  },
  {
    id: "workshops",
    name: "Workshops & Courses",
    description: "One-time purchases for premium content",
    features: ["Sell workshops", "Digital downloads", "Tiered pricing"],
  },
];

// Creator categories
export const CREATOR_CATEGORIES = [
  { id: "writers", label: "Writers & Journalists", count: 156 },
  { id: "coaches", label: "Coaches & Consultants", count: 89 },
  { id: "artists", label: "Artists & Poets", count: 124 },
  { id: "educators", label: "Educators & Teachers", count: 67 },
  { id: "wellness", label: "Wellness & Health", count: 93 },
  { id: "business", label: "Business & Finance", count: 78 },
];

// FAQ for creators
export const CREATOR_FAQ = [
  {
    question: "How much does The Blog Spot take?",
    answer:
      "We take only 10% of your earnings. You keep 90%. This includes payment processing.",
  },
  {
    question: "When do I get paid?",
    answer:
      "Every Friday. If you've earned over $25, we automatically deposit to your account.",
  },
  {
    question: "Can I bring my existing subscribers?",
    answer:
      "Yes! Import your email list and we'll help you transition smoothly.",
  },
  {
    question: "What about my old content?",
    answer:
      "Import all your previous posts with our migration tool. Keep your archive intact.",
  },
  {
    question: "Can I leave anytime?",
    answer:
      "Absolutely. Export your subscriber list and content whenever you want. No lock-in.",
  },
];

// Call-to-action messages
export const CTA_MESSAGES = {
  hero: "Start Earning in 5 Minutes",
  pricing: "Join 500+ Creators",
  features: "See How It Works",
  testimonial: "Start Your Journey",
};

// Footer links
export const FOOTER_LINKS = {
  creators: [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Browse Creators", href: "/creators" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Membership", href: "/membership" },
    { label: "Community", href: "/community" },
  ],
  support: [
    { label: "Help Center", href: "/help", isComingSoon: true },
    { label: "Contact", href: "/contact", isComingSoon: true },
    { label: "Terms", href: "/terms", isComingSoon: true },
  ],
  social: [
    {
      label: "Twitter",
      href: "https://twitter.com/theblogspot",
      isExternal: true,
      icon: "twitter",
    },
    {
      label: "Instagram",
      href: "https://instagram.com/theblogspot",
      isExternal: true,
      icon: "instagram",
    },
  ],
};

// Animation configurations
export const ANIMATIONS = {
  fadeIn: { duration: 600, delay: 0 },
  slideUp: { duration: 800, delay: 100 },
  stagger: { duration: 400, delay: 200 },
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;
