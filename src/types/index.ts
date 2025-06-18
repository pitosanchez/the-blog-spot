// Global types and interfaces for The Blog Spot application

export interface Quote {
  text: string;
  author: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  slug: string;
  postCount?: number;
}

export interface MenuItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface FeaturedStory {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  readTime: number;
  publishedAt: string;
  author?: string;
}

export interface NavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}

export interface HeroProps {
  featuredStory?: FeaturedStory;
}

export interface CategoriesProps {
  categories?: Category[];
  onCategoryClick?: (category: Category) => void;
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
