"use client";
import { useRef, useState } from "react";
import Image from "next/image";
// Removed unused asset imports moved into ReliableKeeperNetwork
import Link from "next/link";
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

  // GSAP animation for hero section entrance
  useGSAP(() => {
    // Preloader total duration is 4.0 seconds
    const PRELOADER_DURATION = 4.0; // seconds

    // Function to animate hero content
    const animateHeroContent = () => {
      if (!titleLine1Ref.current || !titleLine2Ref.current || !titleLine3Ref.current ||
        !poweredByRef.current || !buttonsRef.current) return;

      // Set initial positions (below viewport)
      gsap.set([titleLine1Ref.current, titleLine2Ref.current, titleLine3Ref.current], {
        y: 100,
        opacity: 0
      });
      gsap.set([poweredByRef.current, buttonsRef.current], {
        y: 80,
        opacity: 0
      });

      // Create timeline for hero animations
      const tl = gsap.timeline();

      // Animate title lines from bottom to top with stagger
      tl.to([titleLine1Ref.current, titleLine2Ref.current, titleLine3Ref.current], {
        duration: 0.8,
        y: 0,
        opacity: 1,
        ease: "power2.out",
        stagger: 0.2, // 0.2s delay between each line
      })
        // Then animate powered by section
        .to(poweredByRef.current, {
          duration: 0.6,
          y: 0,
          opacity: 1,
          ease: "power2.out",
        }, "-=0.4") // Start 0.4s before previous animation ends
        // Finally animate buttons
        .to(buttonsRef.current, {
          duration: 0.6,
          y: 0,
          opacity: 1,
          ease: "power2.out",
        }, "-=0.2"); // Start 0.2s before previous animation ends

      setAnimationCompleted(true);
    };

    // Start hero animation after preloader completes
    const timer = setTimeout(() => {
      animateHeroContent();
    }, PRELOADER_DURATION * 1000); // Convert to milliseconds

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
          <section className={`pt-10 lg:pt-40 mb-20 min-h-screen mx-auto flex flex-col justify-center items-center ${!animationCompleted ? "opacity-0" : ""}`}>
            <div
              ref={titleRef}
              className="font-sharpGrotesk w-[90%] mx-auto  text-center text-4xl sm:text-4xl md:text-6xl xl:text-[5vw] 2xl:text-[5vw]"
              id="target-section"
            >
              <h1
                ref={titleLine1Ref}
                className=" text-center transform leading-[100%] tracking-[-0.06em]"
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
                className=" text-center lg:mt-2 md:mt-2 sm:mt-0 mt-0 transform leading-[100%] tracking-[-0.06em]"
              >
                <span className="text-[#82FBD0]">.</span>Limitless Potential
                <span className="text-[#82FBD0]">.</span>
              </h1>
            </div>

            <h4
              ref={poweredByRef}
              className="flex items-center gap-4 relative text-[#A2A2A2] font-actayRegular text-center text-sm sm:text-lg lg:text-xl py-3 sm:py-5 px-6 sm:px-16 lg:px-20 xl:px-36 tracking-wide leading-[2rem] font-normal w-fit mx-auto my-6 md:my-10"
            >
              Powered by{" "}
              <Image
                src={eigenlayer}
                alt="Eigenlayer"
                width={80}
                height={80}
                quality={100}
                className="w-16 md:w-20 lg:w-22 h-auto"
              ></Image>
              <div className="absolute top-0 left-0 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-l-2 sm:border-t-4 sm:border-l-4 border-[#5047FF] rounded-tl-md sm:rounded-tl-xl"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-r-2 sm:border-b-4 sm:border-r-4 border-[#5047FF] rounded-br-md sm:rounded-br-xl"></div>
            </h4>

            <div ref={buttonsRef} className="flex gap-4 justify-center">
              <AnimatedButton
                href="https://app.triggerx.network/"

                variant="yellow_outline"
                flairColor="#f8ff7c"
                className="w-50  md:px-6 md:py-3 md:text-lg px-5 py-2.5 text-base"
              >
                <button className="text-[#f8ff7c]">Start Building</button>
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
