/**
 * Visit tracking utility to manage preloader visibility
 * Only shows preloader for first-time visitors or users who haven't visited in 10+ minutes
 */

const VISIT_STORAGE_KEY = "triggerx_last_visit";
const VISIT_THRESHOLD = 10 * 60 * 1000; // 10 minutes in milliseconds

export interface VisitData {
  timestamp: number;
  visitCount: number;
}

/**
 * Check if the preloader should be shown based on visit history
 * @returns boolean - true if preloader should be shown, false otherwise
 */
export function shouldShowPreloader(): boolean {
  if (typeof window === "undefined") {
    return true; // Default to showing preloader on server-side
  }

  try {
    const storedData = localStorage.getItem(VISIT_STORAGE_KEY);

    if (!storedData) {
      // First-time visitor
      return true;
    }

    const visitData: VisitData = JSON.parse(storedData);
    const now = Date.now();
    const timeSinceLastVisit = now - visitData.timestamp;

    // Show preloader if it's been more than 10 minutes since last visit
    return timeSinceLastVisit > VISIT_THRESHOLD;
  } catch (error) {
    console.warn("Error reading visit data:", error);
    return true; // Default to showing preloader on error
  }
}

/**
 * Record the current visit timestamp
 */
export function recordVisit(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const storedData = localStorage.getItem(VISIT_STORAGE_KEY);
    let visitData: VisitData;

    if (storedData) {
      visitData = JSON.parse(storedData);
      visitData.visitCount += 1;
    } else {
      visitData = {
        timestamp: Date.now(),
        visitCount: 1,
      };
    }

    visitData.timestamp = Date.now();
    localStorage.setItem(VISIT_STORAGE_KEY, JSON.stringify(visitData));
  } catch (error) {
    console.warn("Error recording visit:", error);
  }
}

/**
 * Get visit statistics
 */
export function getVisitStats(): VisitData | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedData = localStorage.getItem(VISIT_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.warn("Error reading visit stats:", error);
    return null;
  }
}

/**
 * Clear visit data (for testing purposes)
 */
export function clearVisitData(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(VISIT_STORAGE_KEY);
  } catch (error) {
    console.warn("Error clearing visit data:", error);
  }
}
