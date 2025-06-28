import type { Quote } from "../types";

// Platform statistics for social proof
export const PLATFORM_STATS = {
  creators: "200+",
  monthlyReaders: "25K+",
  totalEarned: "$500K+",
  avgCreatorIncome: "$5,000/mo",
  medicalSpecialties: "15+",
  cmeHoursDelivered: "10K+",
};

// Hero quotes for medical creator platform
export const CREATOR_HERO_QUOTES: Quote[] = [
  {
    text: "Share your medical expertise. Keep 90% of earnings. Full HIPAA compliance.",
    author: "MedCreator Hub Promise",
  },
  {
    text: "I earn $8,000/month teaching emergency medicine cases to residents.",
    author: "Dr. Sarah Chen, Emergency Medicine",
  },
  {
    text: "My CME courses generate passive income while helping colleagues nationwide.",
    author: "Dr. Marcus Johnson, Cardiology",
  },
  {
    text: "Built a thriving medical education business with zero compliance worries.",
    author: "Dr. Elena Rodriguez, Internal Medicine",
  },
];

// Medical creator success stories for homepage
export const CREATOR_SUCCESS_STORIES = [
  {
    id: "dr-sarah-chen",
    name: "Dr. Sarah Chen, MD",
    avatar: "/images/creators/dr-chen.webp",
    niche: "Emergency Medicine",
    monthlyEarnings: "$12,500",
    subscribers: 2850,
    quote: "Teaching clinical cases to residents while earning sustainably.",
    featured: true,
    credentials: "Board Certified Emergency Medicine",
  },
  {
    id: "dr-marcus-johnson",
    name: "Dr. Marcus Johnson, MD",
    avatar: "/images/creators/dr-johnson.webp",
    niche: "Cardiology CME",
    monthlyEarnings: "$18,200",
    subscribers: 1450,
    quote: "My CME courses help cardiologists stay current with latest guidelines.",
    featured: true,
    credentials: "Fellow, American College of Cardiology",
  },
  {
    id: "dr-elena-rodriguez",
    name: "Dr. Elena Rodriguez, MD",
    avatar: "/images/creators/dr-rodriguez.webp",
    niche: "Internal Medicine",
    monthlyEarnings: "$9,800",
    subscribers: 980,
    quote: "Case-based learning that actually improves patient outcomes.",
    featured: true,
    credentials: "Program Director, IM Residency",
  },
];

// Medical platform features
export const CREATOR_FEATURES = [
  {
    id: "revenue-share",
    title: "Keep 90% of Earnings",
    description: "Best revenue share for medical educators. Only 10% platform fee.",
    icon: "💰",
  },
  {
    id: "hipaa-compliant",
    title: "HIPAA Compliant",
    description: "Full HIPAA compliance for case discussions and patient data.",
    icon: "🔒",
  },
  {
    id: "cme-credits",
    title: "CME Integration",
    description: "Offer accredited CME credits. We handle the paperwork.",
    icon: "🎓",
  },
  {
    id: "case-tools",
    title: "Medical Case Tools",
    description: "Anonymization, DICOM viewers, and clinical image support.",
    icon: "🏥",
  },
  {
    id: "peer-review",
    title: "Peer Review System",
    description: "Built-in peer review for maintaining medical standards.",
    icon: "✅",
  },
  {
    id: "pharma-sponsors",
    title: "Sponsorship Options",
    description: "Connect with pharma and device companies for ethical sponsorships.",
    icon: "🤝",
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

// Medical specialty categories
export const CREATOR_CATEGORIES = [
  { id: "emergency", label: "Emergency Medicine", count: 24 },
  { id: "internal", label: "Internal Medicine", count: 31 },
  { id: "cardiology", label: "Cardiology", count: 18 },
  { id: "radiology", label: "Radiology", count: 22 },
  { id: "surgery", label: "Surgery", count: 19 },
  { id: "pediatrics", label: "Pediatrics", count: 16 },
  { id: "psychiatry", label: "Psychiatry", count: 14 },
  { id: "family", label: "Family Medicine", count: 27 },
  { id: "anesthesia", label: "Anesthesiology", count: 12 },
  { id: "pathology", label: "Pathology", count: 9 },
  { id: "dermatology", label: "Dermatology", count: 8 },
];

// FAQ for medical creators
export const CREATOR_FAQ = [
  {
    question: "Is the platform HIPAA compliant?",
    answer:
      "Yes, fully HIPAA compliant. All patient data is encrypted and we provide BAA agreements.",
  },
  {
    question: "Can I offer CME credits?",
    answer:
      "Yes! We partner with accreditation bodies to help you offer AMA PRA Category 1 Credits.",
  },
  {
    question: "How do you verify medical licenses?",
    answer:
      "We verify all medical licenses through state boards before account activation.",
  },
  {
    question: "What about malpractice concerns?",
    answer:
      "Educational content is covered under our platform insurance. Always include appropriate disclaimers.",
  },
  {
    question: "Can hospitals subscribe for their staff?",
    answer:
      "Yes! We offer institutional subscriptions with volume discounts and admin dashboards.",
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
