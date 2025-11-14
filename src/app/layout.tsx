"use client";
import "./globals.css";
// import { GoogleTagManager } from "@next/third-parties/google";
import HeaderFooterWrapper from "@/components/HeaderFooterWrapper";
import localFont from "next/font/local";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
// Lazy-load heavy Three.js background
const GridBackground = dynamic(() => import("@/components/GridBackground"), { ssr: false, loading: () => null });
import Preloader from "@/components/Preloader";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { shouldShowPreloader, recordVisit } from "@/lib/visitTracker";
import { initResizeHandler, destroyResizeHandler } from "@/lib/resizeHandler";

const sharpGrotesk300Light25 = localFont({
  src: "../../public/fonts/SharpGrotesk-Light25.otf",
  weight: "300",
  style: "normal",
  variable: "--font-sharp-grotesk-light-25",
  display: "swap",
});

const actayRegular = localFont({
  src: "../../public/fonts/Actay-Regular.otf",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-actay-regular",
});

const actayWideBold = localFont({
  src: "../../public/fonts/ActayWide-Bold.otf",
  weight: "700",
  style: "normal",
  variable: "--font-actay-wide-bold",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const smoother = useRef<unknown>(null);
  const pathname = usePathname();
  const [showPreloader, setShowPreloader] = useState(true);
  const [shouldLoadGrid, setShouldLoadGrid] = useState(false);
  const [useFallbackPreloader, setUseFallbackPreloader] = useState(false);

  // Check visit history and control preloader visibility
  useEffect(() => {
    const shouldShow = shouldShowPreloader();
    setShowPreloader(shouldShow);

    if (!shouldShow) {
      // If preloader shouldn't be shown, mark animation as completed immediately
      document.body.classList.add("animationCompleted");
      document.body.style.overflow = "visible";
    } else {
      // Fallback to CSS-only preloader if GSAP takes too long
      setTimeout(() => {
        setUseFallbackPreloader(true);
      }, 100); // Very short timeout to ensure LCP
    }
  }, []);

  // Record visit when component mounts
  useEffect(() => {
    recordVisit();
  }, []);

  // Initialize simple resize handler
  useEffect(() => {
    initResizeHandler();

    // Cleanup on unmount
    return () => {
      destroyResizeHandler();
    };
  }, []);

  // Handler for preloader completion
  const handlePreloaderComplete = () => {
    // Preloader animation completed
  };

  // Defer GSAP and smooth scrolling setup to reduce initial bundle
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const [{ default: gsap }, { ScrollTrigger, ScrollSmoother }]: [typeof import("gsap"), typeof import("gsap/all")] = await Promise.all([
        import("gsap"),
        import("gsap/all"),
      ]);
      if (!isMounted) return;
      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
      smoother.current = (ScrollSmoother as unknown as { create: (opts: unknown) => unknown }).create({
        smooth: 3,
        normalizeScroll: true,
        ignoreMobileResize: true,
        effects: true,
      });
      console.log(
        "%cDev by - Jaydip - %chttps://jaydip.dev",
        "color: #888; font-size: 12px;",
        "color: #4A9EFF; font-size: 12px; text-decoration: underline;"
      );
    })();
    return () => {
      isMounted = false;
    };
  }, [pathname]);

  // Defer loading of GridBackground until idle/after first paint
  useEffect(() => {
    if (typeof window === "undefined") return;
    const idle: (cb: () => void) => number = 'requestIdleCallback' in window
      ? (cb) => (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(cb)
      : (cb) => window.setTimeout(cb, 1200);
    const id = idle(() => setShouldLoadGrid(true));
    return () => {
      if ('cancelIdleCallback' in window) {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id);
      } else {
        clearTimeout(id);
      }
    };
  }, []);
  return (
    <html
      lang="en"
      className={`${actayRegular.variable} ${sharpGrotesk300Light25.variable} ${actayWideBold.variable}`}
    >
      <head>
        {/* Preload critical resources for LCP */}
        <link rel="preload" href="/fonts/SharpGrotesk-Light25.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/SharpGrotesk-Medium25.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Actay-Regular.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/ActayWide-Bold.otf" as="font" type="font/otf" crossOrigin="anonymous" />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//cdn.sanity.io" />

        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://cdn.sanity.io" />
      </head>
      <body suppressHydrationWarning>

        <Preloader onComplete={handlePreloaderComplete} />
        {shouldLoadGrid ? <GridBackground /> : null}
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <HeaderFooterWrapper>
              <div className="relative z-30"> {children}</div>
            </HeaderFooterWrapper>
          </div>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Load GTM after LCP
              window.addEventListener('load', function() {
                setTimeout(function() {
                  var script = document.createElement('script');
                  script.src = 'https://www.googletagmanager.com/gtag/js?id=GTM-T9XQH8N8';
                  script.async = true;
                  document.head.appendChild(script);
                }, 1000);
              });
            `,
          }}
        />
        <SpeedInsights />
      </body>
    </html>
  );
}
