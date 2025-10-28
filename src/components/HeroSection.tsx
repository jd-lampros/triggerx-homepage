"use client";
import { useRef, useState } from "react";
import Image from "next/image";
// Removed unused asset imports moved into ReliableKeeperNetwork
import eigenlayer from "@/app/assets/HeaderHerosection svgs/Eigenlayer.svg";
import TextRevealSection from "./TextRevealSection";
import WhatIsTriggerX from "./WhatIsTriggerX";
import SecurityEigenLayerSection from "./SecurityEigenLayerSection";
import WhoIsTriggerXFor from "./WhoIsTriggerXFor";
import ReliableKeeperNetwork from "./ReliableKeeperNetwork";
import FutureOfBlockchainHero from "./FutureOfBlockchainHero";
import { useEffect as useGsapEffect } from "react";
import AnimatedButton from "./ui/AnimatedButton";
import MarqueeWords from "./MarqueeWords";
import { shouldShowPreloader } from "@/lib/visitTracker";

function HeroSection() {
  // Refs for animation elements
  const titleRef = useRef<HTMLDivElement>(null);
  const titleLine1Ref = useRef<HTMLHeadingElement>(null);
  const titleLine2Ref = useRef<HTMLHeadingElement>(null);
  const titleLine3Ref = useRef<HTMLHeadingElement>(null);
  const poweredByRef = useRef<HTMLHeadingElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  // Optimized GSAP animation for hero section entrance (lazy-loaded GSAP)
  useGsapEffect(() => {
    const PRELOADER_DURATION = 2.5; // seconds - reduced to 2.5s
    const shouldShowPreloaderAnimation = shouldShowPreloader();

    // Function to animate hero content with reduced complexity 
    const animateHeroContent = async () => {
      const gsap = (await import("gsap")).default;
      if (!poweredByRef.current || !buttonsRef.current) return;

      // Use hardware acceleration for better performance
      gsap.set([poweredByRef.current, buttonsRef.current], {
        y: 80,
        opacity: 0,
        force3D: true,
        willChange: "transform, opacity"
      });

      // Create optimized timeline
      const tl = gsap.timeline({
        onComplete: () => {
          // Clean up willChange after animation
          gsap.set([poweredByRef.current, buttonsRef.current], { willChange: "auto" });
        }
      });

      // Animate title section (desktop only) with reduced complexity
      if (titleLine1Ref.current && titleLine2Ref.current && titleLine3Ref.current) {
        gsap.set([titleLine1Ref.current, titleLine2Ref.current, titleLine3Ref.current], {
          y: 100,
          opacity: 0,
          force3D: true,
          willChange: "transform, opacity"
        });

        tl.to([titleLine1Ref.current, titleLine2Ref.current, titleLine3Ref.current], {
          duration: 0.6, // Reduced duration
          y: 0,
          opacity: 1,
          ease: "power2.out",
          stagger: 0.15, // Reduced stagger
          force3D: true
        });
      }

      // Then animate powered by section with reduced duration
      tl.to(poweredByRef.current, {
        duration: 0.4, // Reduced duration
        y: 0,
        opacity: 1,
        ease: "power2.out",
        force3D: true
      }, "-=0.3") // Reduced delay
        // Finally animate buttons
        .to(buttonsRef.current, {
          duration: 0.4, // Reduced duration
          y: 0,
          opacity: 1,
          ease: "power2.out",
          force3D: true
        }, "-=0.15"); // Reduced delay

      setAnimationCompleted(true);
    };

    // Start hero animation after preloader completes or immediately if no preloader
    const delay = shouldShowPreloaderAnimation ? PRELOADER_DURATION * 1000 : 0;

    const timer = setTimeout(() => {
      animateHeroContent();
    }, delay);

    // Cleanup timer on unmount
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div className="relative z-0 mx-auto">
        <div className="relative z-10">
          {/* Hero Section */}
          <section className={`pt-40 lg:pt-40 md:mb-20 mb-10 min-h-[calc(100vh-90px)] md:min-h-screen mx-auto flex flex-col justify-center items-center ${!animationCompleted ? "opacity-0" : ""}`}>
            <div
              ref={titleRef}
              className="font-sharpGrotesk w-full text-center"
              id="target-section"
            >
              {/* Desktop Title */}
              <div className="hidden lg:block text-4xl sm:text-4xl md:text-6xl xl:text-[5vw] 2xl:text-[5vw]">
                <h1
                  ref={titleLine1Ref}
                  className="text-center transform leading-[100%] tracking-[-0.06em]"
                >
                  Effortless Blockchain
                </h1>
                <h1
                  ref={titleLine2Ref}
                  className="text-center lg:mt-2 md:mt-2 sm:mt-0 mt-0 transform leading-[100%] tracking-[-0.06em]"
                >
                  Automation
                </h1>
                <h1
                  ref={titleLine3Ref}
                  className="text-center lg:mt-2 md:mt-2 sm:mt-0 mt-0 transform leading-[100%] tracking-[-0.06em]"
                >
                  <span className="text-[#82FBD0]">.</span>Limitless Potential
                  <span className="text-[#82FBD0]">.</span>
                </h1>
              </div>

              {/* Mobile Marquee Words */}
              <div className="lg:hidden">
                <MarqueeWords
                  words={["EFFORTLESS", "BLOCKCHAIN", "AUTOMATION", "LIMITLESS", "POTENTIAL"]}
                  speed={0.5}
                  className="mb-8"
                />
              </div>
            </div>

            <h4
              ref={poweredByRef}
              className="flex items-center gap-4 relative text-[#A2A2A2] font-actayRegular text-center text-xl sm:text-lg lg:text-xl py-3 sm:py-5 px-6 sm:px-16 lg:px-20 xl:px-36 tracking-wide leading-[2rem] font-normal w-fit mx-auto my-6 md:my-10"
            >
              Powered by{" "}
              <Image
                src={eigenlayer}
                alt="Eigenlayer"
                width={80}
                height={80}
                quality={100}
                className="w-20 md:w-20 lg:w-22 h-auto"
              ></Image>
              <div className="absolute top-0 left-0 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-l-2 sm:border-t-4 sm:border-l-4 border-[#5047FF] rounded-tl-md sm:rounded-tl-xl"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-r-2 sm:border-b-4 sm:border-r-4 border-[#5047FF] rounded-br-md sm:rounded-br-xl"></div>
            </h4>

            <div ref={buttonsRef} className="flex gap-4 justify-center">
              <AnimatedButton
                href="https://app.triggerx.network/"

                variant="yellow_outline"
                flairColor="#fff837"
                className="w-50  md:px-6 md:py-3 md:text-lg px-5 py-2.5 text-base"
              >
                <button className="text-[#fff837]">Start Building</button>
              </AnimatedButton>
              {/* <Link href="https://app.triggerx.network/" target="blank">
                <button className="relative bg-[#222222] text-[#000000] border border-[#222222] px-6 py-2 sm:px-8 sm:py-3 rounded-full group transition-transform">
                  <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-2 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs sm:text-base">
                    Start Building
                  </span>
                </button>
              </Link> */}
              <AnimatedButton
                href="https://app.triggerx.network/"
                variant="white_outline"
                flairColor="white"
                className="w-50  md:px-6 md:py-3 md:text-lg px-5 py-2.5 text-base"
              >
                <button className="text-white">Let&apos;s Talk</button>
              </AnimatedButton>
            </div>
          </section>

          {/* Text Reveal Section */}
          <TextRevealSection />

          {/* <section className="md:my-[10rem] xs:my-[6rem]">
            <div className="w-full h-auto  mx-auto">
              <Why
                baseWidth={300}
                autoplay={true}
                autoplayDelay={2000}
                pauseOnHover={true}
                loop={true}
                round={true}
                Boxdata={Boxdata}
              />
            </div>
          </section> */}

          {/* What is TriggerX Section */}
          <WhatIsTriggerX />

          {/* Who is TriggerX For Section */}
          <WhoIsTriggerXFor />

          <SecurityEigenLayerSection />

          <ReliableKeeperNetwork />

          <FutureOfBlockchainHero />
        </div>
      </div>
    </>
  );
}

export default HeroSection;
