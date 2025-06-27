// Viewport utilities for handling mobile viewport height issues

/**
 * Sets CSS custom property for viewport height to fix mobile browser issues
 * where 100vh doesn't account for browser UI elements
 */
export const setViewportHeight = () => {
  // First, set the default viewport height
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);

  // Handle visual viewport API for better mobile support
  if ("visualViewport" in window && window.visualViewport) {
    const updateViewport = () => {
      const vv = window.visualViewport;
      if (!vv) return;

      // Set viewport height based on visual viewport
      const vh = vv.height * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);

      // Set viewport width
      const vw = vv.width * 0.01;
      document.documentElement.style.setProperty("--vw", `${vw}px`);
    };

    window.visualViewport.addEventListener("resize", updateViewport);
    updateViewport();
  }

  // Fallback for browsers without visual viewport support
  const updateFallback = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    const vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty("--vw", `${vw}px`);
  };

  // Use resize event as fallback
  window.addEventListener("resize", updateFallback);

  // Handle orientation change for mobile devices
  window.addEventListener("orientationchange", () => {
    // Small delay to let the browser adjust
    setTimeout(updateFallback, 100);
  });
};

/**
 * Initialize viewport height handling
 */
export const initializeViewport = () => {
  // Set initial viewport height
  setViewportHeight();

  // Update on resize and orientation change
  window.addEventListener("resize", setViewportHeight);
  window.addEventListener("orientationchange", () => {
    // Delay to ensure the viewport has updated
    setTimeout(setViewportHeight, 100);
  });

  // Handle iOS Safari viewport changes
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    window.addEventListener("scroll", () => {
      // Only update if we're at the top of the page
      if (window.scrollY === 0) {
        setViewportHeight();
      }
    });
  }
};

/**
 * Get safe viewport dimensions accounting for browser UI
 */
export const getSafeViewportDimensions = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    safeHeight:
      window.innerHeight - (window.screen.height - window.innerHeight),
  };
};

/**
 * Check if device is likely mobile
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Get header height for viewport calculations
 */
export const getHeaderHeight = () => {
  const header = document.querySelector("header");
  return header ? header.offsetHeight : 80; // Default to 80px if not found
};

// Enhanced responsive breakpoints detection
export const getBreakpoint = (): "xs" | "sm" | "md" | "lg" | "xl" | "2xl" => {
  const width = window.innerWidth;

  if (width < 640) return "xs";
  if (width < 768) return "sm";
  if (width < 1024) return "md";
  if (width < 1280) return "lg";
  if (width < 1536) return "xl";
  return "2xl";
};

// Check if device is touch-enabled
export const isTouchDevice = (): boolean => {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

// Get safe area insets for devices with notches
export const getSafeAreaInsets = () => {
  const computedStyle = getComputedStyle(document.documentElement);

  return {
    top: computedStyle.getPropertyValue("env(safe-area-inset-top)") || "0px",
    right:
      computedStyle.getPropertyValue("env(safe-area-inset-right)") || "0px",
    bottom:
      computedStyle.getPropertyValue("env(safe-area-inset-bottom)") || "0px",
    left: computedStyle.getPropertyValue("env(safe-area-inset-left)") || "0px",
  };
};

// Responsive font size calculator
export const getResponsiveFontSize = (
  base: number,
  scale: number = 0.8
): string => {
  const breakpoint = getBreakpoint();
  const multipliers = {
    xs: scale,
    sm: scale * 1.1,
    md: 1,
    lg: 1.1,
    xl: 1.2,
    "2xl": 1.3,
  };

  return `${base * multipliers[breakpoint]}rem`;
};

// Responsive spacing calculator
export const getResponsiveSpacing = (base: number): string => {
  const breakpoint = getBreakpoint();
  const multipliers = {
    xs: 0.7,
    sm: 0.85,
    md: 1,
    lg: 1.15,
    xl: 1.3,
    "2xl": 1.5,
  };

  return `${base * multipliers[breakpoint]}rem`;
};

// Initialize responsive utilities
export const initResponsiveUtils = () => {
  setViewportHeight();

  // Add responsive classes to body for CSS targeting
  const updateBodyClasses = () => {
    const breakpoint = getBreakpoint();
    const isMobile = isMobileDevice();
    const isTouch = isTouchDevice();

    // Remove old classes
    document.body.classList.remove(
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "2xl",
      "mobile",
      "desktop",
      "touch",
      "no-touch"
    );

    // Add current classes
    document.body.classList.add(breakpoint);
    document.body.classList.add(isMobile ? "mobile" : "desktop");
    document.body.classList.add(isTouch ? "touch" : "no-touch");
  };

  updateBodyClasses();
  window.addEventListener("resize", updateBodyClasses);

  // Handle reduced motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.body.classList.add("reduced-motion");
  }

  // Handle high contrast preference
  if (window.matchMedia("(prefers-contrast: high)").matches) {
    document.body.classList.add("high-contrast");
  }

  // Handle dark mode preference (if not already handled)
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.classList.add("prefers-dark");
  }
};

// Debounced resize handler for performance
export const createDebouncedResizeHandler = (
  callback: () => void,
  delay: number = 150
) => {
  let timeoutId: number;

  return () => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(callback, delay);
  };
};

// Check if element is in viewport (for animations)
export const isElementInViewport = (
  element: Element,
  threshold: number = 0
): boolean => {
  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= windowHeight + threshold &&
    rect.right <= windowWidth + threshold
  );
};

// Enhanced scroll position tracking
export const getScrollInfo = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const scrollWidth = document.documentElement.scrollWidth - window.innerWidth;

  return {
    scrollTop,
    scrollLeft,
    scrollHeight,
    scrollWidth,
    scrollPercentY: scrollHeight ? (scrollTop / scrollHeight) * 100 : 0,
    scrollPercentX: scrollWidth ? (scrollLeft / scrollWidth) * 100 : 0,
  };
};
