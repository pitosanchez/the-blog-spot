// Viewport utilities for handling mobile viewport height issues

/**
 * Sets CSS custom property for viewport height to fix mobile browser issues
 * where 100vh doesn't account for browser UI elements
 */
export const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
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
