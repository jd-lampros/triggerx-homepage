/**
 * Simple resize handler that reloads the page when window size changes
 */

let lastWidth = 0;
let lastHeight = 0;
let resizeTimer: NodeJS.Timeout | null = null;

function handleResize() {
  const currentWidth = window.innerWidth;
  const currentHeight = window.innerHeight;

  // Clear existing timer
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }

  // Wait 300ms after resize stops
  resizeTimer = setTimeout(() => {
    const widthChange = Math.abs(currentWidth - lastWidth);
    const heightChange = Math.abs(currentHeight - lastHeight);

    // Reload if width or height changed by 100px or more
    if (widthChange >= 100 || heightChange >= 100) {
      console.log("Window size changed significantly, reloading page...");
      window.location.reload();
    } else {
      // Update last size for minor changes
      lastWidth = currentWidth;
      lastHeight = currentHeight;
    }
  }, 300);
}

function initResizeHandler() {
  if (typeof window === "undefined") return;

  // Store initial size
  lastWidth = window.innerWidth;
  lastHeight = window.innerHeight;

  // Add resize listener
  window.addEventListener("resize", handleResize, { passive: true });

  console.log("Simple resize handler initialized");
}

function destroyResizeHandler() {
  if (typeof window === "undefined") return;

  window.removeEventListener("resize", handleResize);

  if (resizeTimer) {
    clearTimeout(resizeTimer);
    resizeTimer = null;
  }
}

export { initResizeHandler, destroyResizeHandler };
