"use client";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import HeaderFooterWrapper from "@/components/HeaderFooterWrapper";
import localFont from "next/font/local";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger, ScrollSmoother } from "gsap/all";
import GridBackground from "@/components/GridBackground";
import Preloader from "@/components/Preloader";

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
        <Preloader />
        <GridBackground />
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <HeaderFooterWrapper>
              <div className="relative z-30"> {children}</div>
            </HeaderFooterWrapper>
          </div>
        </div>
      </body>
    </html>
  );
}
