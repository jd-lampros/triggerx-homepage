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
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
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

  // useEffect(() => {
  //   // Always scroll to the top of the page on component mount/refresh
  //   window.scrollTo(0, 0);

  //   // Set initial position below viewport
  //   gsap.set(nextGenRef.current, {
  //     position: "relative",
  //     top: "200vh",
  //     opacity: 0,
  //   });

  //   // Create a GSAP timeline for the initial animation
  //   const tl = gsap.timeline({
  //     onComplete: () => {
  //       gsap.set(nextGenRef.current, {
  //         opacity: 1,
  //         yPercent: 0,
  //         position: "relative",
  //         top: 0,
  //       });
  //     },
  //   });

  //   // Animate the content up with the header
  //   tl.to(nextGenRef.current, {
  //     top: 0,
  //     opacity: 1,
  //     duration: 1,
  //     ease: "power2.out",
  //   });

  //   // Reset horizontal scroll position if the section exists
  //   if (section2Ref.current) {
  //     section2Ref.current.scrollLeft = 0;
  //   }

  //   // Define a scroll event handler for the page
  //   const handleScroll = () => {
  //     // Update visibility state
  //     setIsVisible(window.scrollY === 0);

  //     // Handle horizontal scroll reset
  //     if (scrollTimeout.current) {
  //       clearTimeout(scrollTimeout.current);
  //     }

  //     if (!isScrolling.current) {
  //       isScrolling.current = true;
  //     }

  //     scrollTimeout.current = setTimeout(() => {
  //       isScrolling.current = false;
  //       if (section2Ref.current) {
  //         section2Ref.current.scrollTo({
  //           left: 0,
  //           behavior: "smooth",
  //         });
  //       }
  //     }, 150);
  //   };

  //   // Add the scroll event listener
  //   window.addEventListener("scroll", handleScroll);

  //   // Cleanup: remove scroll event listener and kill all GSAP ScrollTriggers
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //     ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  //   };
  // }, []); // Empty dependency array since we only want this to run once on mount

  // useEffect(() => {
  //   // Get the container element for horizontal scroll
  //   const container = section2Ref.current;
  //   let isInScrollZone = false;

  //   // Function to check if the section is in the active scroll zone
  //   const checkScrollZone = () => {
  //     if (!container) return false;
  //     const rect = container.getBoundingClientRect();
  //     return rect.top <= 120 && rect.bottom > 0;
  //   };

  //   // Handle wheel events to hijack vertical scroll and turn it into horizontal scroll
  //   const handleWheel = (event) => {
  //     if (!container || !isInScrollZone) return;

  //     const maxScrollLeft = container.scrollWidth - container.clientWidth;

  //     if (container.scrollLeft < maxScrollLeft && event.deltaY > 0) {
  //       event.preventDefault();
  //       container.scrollLeft += event.deltaY;
  //     } else if (container.scrollLeft > 0 && event.deltaY < 0) {
  //       event.preventDefault();
  //       container.scrollLeft += event.deltaY;
  //     }
  //   };

  //   // Global scroll handler to detect when section enters/exits the scroll zone
  //   const handleGlobalScroll = () => {
  //     isInScrollZone = checkScrollZone();
  //   };

  //   // Initial check to set isInScrollZone
  //   handleGlobalScroll();

  //   // Add event listeners
  //   window.addEventListener("scroll", handleGlobalScroll);
  //   window.addEventListener("wheel", handleWheel, { passive: false });

  //   // Cleanup: remove event listeners
  //   return () => {
  //     window.removeEventListener("scroll", handleGlobalScroll);
  //     window.removeEventListener("wheel", handleWheel);
  //   };
  // }, []); // Empty dependency array since we only want this to run once on mount

  // // Add this useEffect for initial client-side setup
  // useEffect(() => {
  //   setIsVisible(window.scrollY === 0);
  // }, []);

  // // Update visibility effect
  // useEffect(() => {
  //   // Define a handler to update visibility state on scroll
  //   const handleVisibility = () => {
  //     setIsVisible(window.scrollY === 0);
  //   };

  //   // Add scroll event listener
  //   window.addEventListener("scroll", handleVisibility);
  //   // Cleanup: remove scroll event listener
  //   return () => window.removeEventListener("scroll", handleVisibility);
  // }, []);

  // Optimized GSAP animation for hero section entrance
  useGSAP(() => {
    const PRELOADER_DURATION = 4.0; // seconds
    const shouldShowPreloaderAnimation = shouldShowPreloader();

    // Function to animate hero content with reduced complexity
    const animateHeroContent = () => {
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
