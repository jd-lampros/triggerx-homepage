/**
 * Optimized GSAP loader that only loads what's needed
 * This reduces bundle size by loading GSAP modules on demand
 */

let gsapInstance: unknown = null;
let morphSVGInstance: unknown = null;

export const loadGSAP = async (): Promise<unknown> => {
  if (gsapInstance) return gsapInstance;

  try {
    const gsap = (await import("gsap")).default;
    gsapInstance = gsap;
    return gsap;
  } catch (error) {
    console.warn("Failed to load GSAP:", error);
    return null;
  }
};

export const loadMorphSVG = async (): Promise<unknown> => {
  if (morphSVGInstance) return morphSVGInstance;

  try {
    const morphMod = await import("gsap/MorphSVGPlugin");
    const MorphSVGPlugin =
      (morphMod as unknown as { MorphSVGPlugin?: unknown; default?: unknown })
        .MorphSVGPlugin ||
      (morphMod as unknown as { MorphSVGPlugin?: unknown; default?: unknown })
        .default;

    if (gsapInstance && MorphSVGPlugin) {
      (
        gsapInstance as { registerPlugin: (plugin: object) => void }
      ).registerPlugin(MorphSVGPlugin as object);
    }

    morphSVGInstance = MorphSVGPlugin;
    return MorphSVGPlugin;
  } catch (error) {
    console.warn("Failed to load MorphSVG:", error);
    return null;
  }
};

export const loadScrollTrigger = async () => {
  try {
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    if (gsapInstance) {
      (
        gsapInstance as { registerPlugin: (plugin: object) => void }
      ).registerPlugin(ScrollTrigger);
    }
    return ScrollTrigger;
  } catch (error) {
    console.warn("Failed to load ScrollTrigger:", error);
    return null;
  }
};

export const loadScrollSmoother = async () => {
  try {
    const { ScrollSmoother } = await import("gsap/ScrollSmoother");
    if (gsapInstance) {
      (
        gsapInstance as { registerPlugin: (plugin: object) => void }
      ).registerPlugin(ScrollSmoother);
    }
    return ScrollSmoother;
  } catch (error) {
    console.warn("Failed to load ScrollSmoother:", error);
    return null;
  }
};

// Preload GSAP core for better performance
export const preloadGSAP = () => {
  if (typeof window !== "undefined" && !gsapInstance) {
    // Preload GSAP core in the background
    import("gsap").then((module) => {
      gsapInstance = module.default;
    });
  }
};
