import type { Quote, Category, MenuItem, FeaturedStory } from "../types";

// Inspirational quotes for the hero section
export const HERO_QUOTES: Quote[] = [
  {
    text: "Every corner store has a story. Every story has a home.",
    author: "The Blog Spot",
  },
  {
    text: "Where community meets creativity, magic happens.",
    author: "Our Readers",
  },
  {
    text: "Your truth deserves to be heard.",
    author: "The Blog Spot",
  },
  {
    text: "Stories connect us across all boundaries.",
    author: "Community Member",
  },
];

// Story categories for the homepage
export const STORY_CATEGORIES: Category[] = [
  {
    id: "first-generation",
    title: "First-Generation Stories",
    description: "Tales of new beginnings and cultural bridges",
    icon: "🌉",
    slug: "first-generation",
    postCount: 24,
  },
  {
    id: "neighborhood-memories",
    title: "Neighborhood Memories",
    description: "Stories that shaped our communities",
    icon: "🏘️",
    slug: "neighborhood-memories",
    postCount: 18,
  },
  {
    id: "family-traditions",
    title: "Family Traditions",
    description: "Legacies passed down through generations",
    icon: "👨‍👩‍👧‍👦",
    slug: "family-traditions",
    postCount: 31,
  },
  {
    id: "cultural-fusion",
    title: "Cultural Fusion",
    description: "Where different worlds meet and create magic",
    icon: "✨",
    slug: "cultural-fusion",
    postCount: 15,
  },
  {
    id: "street-wisdom",
    title: "Street Wisdom",
    description: "Life lessons learned on the corner",
    icon: "🧠",
    slug: "street-wisdom",
    postCount: 22,
  },
  {
    id: "community-heroes",
    title: "Community Heroes",
    description: "Everyday people doing extraordinary things",
    icon: "🦸‍♂️",
    slug: "community-heroes",
    postCount: 19,
  },
];

// Navigation menu items for stories dropdown
export const STORIES_MENU: MenuItem[] = [
  { label: "Cornerstore Confessions", href: "/cornerstore-confessions" },
  { label: "Letters to My Younger Self", href: "/letters-to-my-younger-self" },
  { label: "First Times", href: "/first-times" },
  { label: "Poetry", href: "/poetry" },
  { label: "Love", href: "/love" },
  { label: "Relationships", href: "/relationships" },
  { label: "Family & Community", href: "/family-community" },
  { label: "Triumph & Survival", href: "/triumph-survival" },
  { label: "Overcoming", href: "/overcoming" },
  { label: "Illness", href: "/illness" },
  { label: "Loneliness", href: "/loneliness" },
  { label: "Environment", href: "/environment" },
  { label: "Spirituality", href: "/spirituality" },
  { label: "Kindness", href: "/kindness" },
  { label: "Roots & Heritage", href: "/roots-heritage" },
  { label: "Humor & Joy", href: "/humor-joy" },
];

// Featured story for the hero section
export const FEATURED_STORY: FeaturedStory = {
  id: "cornerstore-confessions-1",
  title: "Cornerstore Confessions: The Day I Found My Voice",
  excerpt:
    "I never thought a simple trip to the bodega would change my life. But that day, surrounded by the hum of refrigerators and the smell of fresh bread, I finally spoke my truth.",
  slug: "cornerstore-confessions",
  category: "Personal Growth",
  readTime: 5,
  publishedAt: "2024-01-15",
  author: "Anonymous",
};

// Footer links
export const FOOTER_LINKS = {
  categories: [
    { label: "First-Generation Stories", href: "/first-generation" },
    { label: "Neighborhood Memories", href: "/neighborhood-memories" },
    { label: "Family Traditions", href: "/family-traditions" },
  ],
  connect: [
    { label: "About Us", href: "/about" },
    { label: "Submit Story", href: "/submit" },
    { label: "Contact", href: "/contact" },
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

// SEO metadata for story categories
export const CATEGORY_SEO_DATA = {
  "cornerstore-confessions": {
    title: "Cornerstore Confessions - Real Stories from Everyday Places",
    description:
      "Authentic stories and confessions from corner stores, bodegas, and neighborhood spots. Share your real-life experiences and connect with others.",
    keywords: [
      "cornerstore",
      "confessions",
      "real stories",
      "neighborhood",
      "bodega",
      "authentic experiences",
    ],
  },
  "letters-to-my-younger-self": {
    title: "Letters to My Younger Self - Wisdom and Reflections",
    description:
      "Heartfelt letters and advice to younger selves. Share your wisdom, regrets, and life lessons with our community.",
    keywords: [
      "letters",
      "younger self",
      "advice",
      "wisdom",
      "life lessons",
      "reflections",
    ],
  },
  "first-times": {
    title: "First Times - Stories of New Experiences",
    description:
      "Share your first-time experiences, milestones, and memorable moments. Connect through stories of new beginnings.",
    keywords: [
      "first time",
      "new experiences",
      "milestones",
      "memorable moments",
      "beginnings",
    ],
  },
  poetry: {
    title: "Poetry - Creative Expression and Verse",
    description:
      "Original poetry, spoken word, and creative verse from our community. Share your poetic voice and artistic expression.",
    keywords: [
      "poetry",
      "poems",
      "spoken word",
      "verse",
      "creative writing",
      "artistic expression",
    ],
  },
  love: {
    title: "Love Stories - Romance, Relationships, and Connection",
    description:
      "Stories about love, romance, relationships, and human connection. Share your love experiences and heartfelt moments.",
    keywords: [
      "love",
      "romance",
      "relationships",
      "connection",
      "dating",
      "heartfelt stories",
    ],
  },
  relationships: {
    title: "Relationship Stories - Family, Friends, and Connections",
    description:
      "Stories about all types of relationships - family, friends, romantic, and more. Share your relationship experiences.",
    keywords: [
      "relationships",
      "family",
      "friends",
      "connections",
      "bonds",
      "social stories",
    ],
  },
  "family-community": {
    title: "Family & Community - Stories of Belonging and Togetherness",
    description:
      "Stories about family bonds, community connections, and belonging. Share your experiences of togetherness and support.",
    keywords: [
      "family",
      "community",
      "belonging",
      "togetherness",
      "support",
      "bonds",
    ],
  },
  "triumph-survival": {
    title: "Triumph & Survival - Stories of Overcoming and Resilience",
    description:
      "Inspiring stories of triumph, survival, and resilience. Share your experiences of overcoming challenges and adversity.",
    keywords: [
      "triumph",
      "survival",
      "resilience",
      "overcoming",
      "challenges",
      "adversity",
      "strength",
    ],
  },
  overcoming: {
    title: "Overcoming - Stories of Growth and Perseverance",
    description:
      "Stories about overcoming obstacles, personal growth, and perseverance. Share your journey of transformation.",
    keywords: [
      "overcoming",
      "obstacles",
      "personal growth",
      "perseverance",
      "transformation",
      "journey",
    ],
  },
  illness: {
    title: "Illness - Health Stories and Medical Experiences",
    description:
      "Stories about illness, health challenges, recovery, and medical experiences. Share your health journey with compassion.",
    keywords: [
      "illness",
      "health",
      "medical",
      "recovery",
      "healing",
      "health challenges",
    ],
  },
  loneliness: {
    title: "Loneliness - Stories of Isolation and Connection",
    description:
      "Stories about loneliness, isolation, and finding connection. Share your experiences and find community understanding.",
    keywords: [
      "loneliness",
      "isolation",
      "connection",
      "solitude",
      "mental health",
      "community",
    ],
  },
  environment: {
    title: "Environment - Nature, Climate, and Sustainability Stories",
    description:
      "Stories about the environment, nature, climate change, and sustainability. Share your environmental experiences and perspectives.",
    keywords: [
      "environment",
      "nature",
      "climate",
      "sustainability",
      "ecology",
      "green living",
    ],
  },
  spirituality: {
    title: "Spirituality - Faith, Belief, and Spiritual Journeys",
    description:
      "Stories about spirituality, faith, belief systems, and spiritual journeys. Share your spiritual experiences and insights.",
    keywords: [
      "spirituality",
      "faith",
      "belief",
      "spiritual journey",
      "religion",
      "meditation",
    ],
  },
  kindness: {
    title: "Kindness - Stories of Compassion and Good Deeds",
    description:
      "Stories about kindness, compassion, good deeds, and human generosity. Share uplifting experiences of kindness.",
    keywords: [
      "kindness",
      "compassion",
      "good deeds",
      "generosity",
      "helping others",
      "humanity",
    ],
  },
  "roots-heritage": {
    title: "Roots & Heritage - Cultural Identity and Ancestry Stories",
    description:
      "Stories about cultural roots, heritage, ancestry, and identity. Share your cultural experiences and family history.",
    keywords: [
      "roots",
      "heritage",
      "culture",
      "ancestry",
      "identity",
      "tradition",
      "family history",
    ],
  },
  "humor-joy": {
    title: "Humor & Joy - Funny Stories and Joyful Moments",
    description:
      "Funny stories, joyful moments, and uplifting experiences. Share laughter and positivity with our community.",
    keywords: [
      "humor",
      "joy",
      "funny stories",
      "laughter",
      "happiness",
      "uplifting",
      "positivity",
    ],
  },
} as const;
