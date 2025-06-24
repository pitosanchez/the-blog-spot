# The Blog Spot Design System - Creator Platform

## Color Palette

### Primary Colors

- **Purple**: `#9333EA` - Primary brand color
- **Indigo**: `#4F46E5` - Secondary brand color
- **Blue**: `#2563EB` - Accent color

### Gradient Colors

- **Yellow**: `#FDE047` - Highlight gradient start
- **Pink**: `#F472B6` - Highlight gradient end

### Neutral Colors

- **White**: `#FFFFFF` - Primary background
- **Gray-50**: `#F9FAFB` - Light background
- **Gray-100**: `#F3F4F6` - Subtle background
- **Gray-200**: `#E5E7EB` - Borders
- **Gray-600**: `#4B5563` - Secondary text
- **Gray-900**: `#111827` - Primary text

### Interactive States

- **Hover**: Lighten by 10%
- **Active**: Darken by 10%
- **Focus**: Ring with primary color

## Typography

### Font Families

- **Playfair Display**: Headings and hero text
- **Source Sans Pro**: Body text and UI elements

### Font Sizes

- **text-xs**: 12px
- **text-sm**: 14px
- **text-base**: 16px
- **text-lg**: 18px
- **text-xl**: 20px
- **text-2xl**: 24px
- **text-3xl**: 30px
- **text-4xl**: 36px
- **text-5xl**: 48px
- **text-6xl**: 60px
- **text-7xl**: 72px
- **text-8xl**: 96px
- **text-9xl**: 128px

## Spacing Scale

### Padding/Margin

- **1**: 4px
- **2**: 8px
- **3**: 12px
- **4**: 16px
- **6**: 24px
- **8**: 32px
- **12**: 48px
- **16**: 64px
- **20**: 80px
- **24**: 96px

## Component Guidelines

### Buttons

- Use `Button` component for all interactive elements
- Variants: `primary`, `secondary`, `outline`, `ghost`
- Sizes: `sm`, `md`, `lg`
- Include gradient backgrounds for primary CTAs
- Always include proper ARIA labels

### Cards

- White background with subtle shadows
- Border radius: 8px (rounded-lg)
- Padding: 24px (p-6)
- Hover effects for interactive cards

### Loading States

- Use `LoadingSpinner` component
- Sizes: `sm`, `md`, `lg`
- Colors: `primary`, `secondary`, `white`
- Include loading text for clarity

## Gradient Guidelines

### Background Gradients

- Hero: `from-purple-900 via-blue-900 to-indigo-900`
- CTAs: `from-yellow-400 to-pink-400`
- Sections: `from-purple-600 to-indigo-600`

### Animated Elements

- Blob shapes with mix-blend-multiply
- Subtle animations (2-4s duration)
- Animation delays for visual interest

## Animation Guidelines

### Micro-interactions

- Scale on hover: 1.05
- Transition duration: 300ms
- Easing: ease-in-out
- Shadow elevation on hover

### Page Transitions

- Fade in: 600ms
- Slide up: 800ms
- Stagger: 200ms delay

### Background Animations

- Blob animation: 7s infinite
- Pulse animation: 2s infinite
- Respect prefers-reduced-motion

## Layout Guidelines

### Container Widths

- max-w-6xl for navigation
- max-w-7xl for content sections
- Responsive padding: px-4 sm:px-6 lg:px-8

### Grid System

- Mobile: 1 column
- Tablet: 2 columns (md:grid-cols-2)
- Desktop: 3-4 columns (lg:grid-cols-3/4)

### Hero Sections

- Full viewport height minus nav
- Centered content
- Gradient backgrounds
- Animated elements

## Accessibility Guidelines

### Color Contrast

- Text on gradients: white with opacity
- Minimum WCAG AA compliance
- Test with color blindness simulators

### Focus Management

- Visible focus rings
- Keyboard navigation support
- Skip links for navigation

### Screen Readers

- Descriptive ARIA labels
- Semantic HTML structure
- Hidden decorative elements

## Best Practices

### Performance

- Optimize gradient rendering
- Lazy load heavy components
- Use CSS transforms for animations
- Minimize re-renders with memo

### Responsive Design

- Mobile-first approach
- Test on all breakpoints
- Ensure touch targets are 44px+
- Optimize for slow connections

### Creator Focus

- Clear value propositions
- Transparent pricing displays
- Trust indicators (stats, testimonials)
- Simple, clean interfaces
