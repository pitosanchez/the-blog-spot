// Global types and interfaces for The Blog Spot application

export interface Quote {
  text: string;
  author: string;
}

export interface NavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}

export interface NewsletterFormData {
  email: string;
  firstName?: string;
}

// Theme and styling types
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  href?: string;
}

// Animation and interaction types
export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string;
}

export interface ScrollPosition {
  x: number;
  y: number;
}

// Error handling types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// SEO and meta types
export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

// Creator platform specific types
export interface Creator {
  id: string;
  name: string;
  avatar: string;
  niche: string;
  bio?: string;
  monthlyEarnings: string;
  subscribers: number;
  joinedDate?: string;
  verified?: boolean;
  featured?: boolean;
  quote?: string;
}

export interface CreatorStats {
  totalEarnings: number;
  monthlyEarnings: number;
  subscribers: number;
  posts: number;
  engagement: number;
}

export interface PricingTier {
  id: string;
  name: string;
  price?: number;
  interval?: "monthly" | "yearly" | "one-time";
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  price: number;
  creatorId: string;
  duration: string;
  startDate?: string;
  maxParticipants?: number;
  currentParticipants?: number;
}

export interface CreatorFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface PlatformStats {
  creators: string;
  monthlyReaders: string;
  totalEarned: string;
  avgCreatorIncome: string;
}

export interface CreatorCategory {
  id: string;
  label: string;
  count: number;
}
