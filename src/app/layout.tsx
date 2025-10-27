"use client";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import HeaderFooterWrapper from "@/components/HeaderFooterWrapper";
import localFont from "next/font/local";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger, ScrollSmoother } from "gsap/all";
import GridBackground from "@/components/GridBackground";
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

const sharpGroteskMedium20 = localFont({
  src: "../../public/fonts/ActayWide-Bold.otf",
  weight: "500",
  style: "normal",
  variable: "--font-sharp-grotesk-medium-20",
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
  const smoother = useRef<ScrollSmoother | null>(null);
  const pathname = usePathname();
  const [showPreloader, setShowPreloader] = useState(true);

  // Check visit history and control preloader visibility
  useEffect(() => {
    const shouldShow = shouldShowPreloader();
    setShowPreloader(shouldShow);

    if (!shouldShow) {
      // If preloader shouldn't be shown, mark animation as completed immediately
      document.body.classList.add("animationCompleted");
      document.body.style.overflow = "visible";
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

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
      smoother.current = ScrollSmoother.create({
        smooth: 3,
        normalizeScroll: true,
        ignoreMobileResize: true,
        effects: true,
        //preventDefault: true,
        //ease: 'power4.out',
        //smoothTouch: 0.1,
      });

      // Console message with portfolio link
      console.log(
        "%cDev by - Jaydip - %chttps://jaydip.dev",
        "color: #888; font-size: 12px;",
        "color: #4A9EFF; font-size: 12px; text-decoration: underline;"
      );
    },
    {
      dependencies: [pathname],
    }
  );
  return (
    <html
      lang="en"
      className={`${actayRegular.variable} ${sharpGrotesk300Light25.variable} ${sharpGroteskMedium20.variable} ${actayWideBold.variable}`}
    >
      <GoogleTagManager gtmId="GTM-T9XQH8N8" />
      <body suppressHydrationWarning>
        {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}
        <GridBackground />
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <HeaderFooterWrapper>
              <div className="relative z-30"> {children}</div>
            </HeaderFooterWrapper>
          </div>
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}
