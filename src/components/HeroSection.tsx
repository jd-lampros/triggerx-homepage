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

function HeroSection() {


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

  return (
    <>
      <div className="relative z-0 mx-auto">
        <div className="relative -z-10">
          {/* Hero Section */}
          <section className="mb-20 min-h-screen mx-auto flex flex-col justify-center items-center">
            <div
              className="font-sharpGrotesk w-[90%] mx-auto  text-center text-4xl sm:text-5xl md:text-5xl lg:text-[70px] "
              id="target-section"
            >
              <h1 className=" text-center text-4xl sm:text-4xl md:text-5xl xl:text-[64px] 2xl:text-[4vw] transform  leading-[130%] tracking-[-0.06em]">
                Effortless Blockchain
              </h1>
              <h1 className="text-center text-4xl sm:text-4xl md:text-5xl xl:text-[64px] 2xl:text-[4vw] lg:mt-3 md:mt-3 sm:mt-0 mt-0 transform  leading-[130%] tracking-[-0.06em]">
                Automation
              </h1>
              <h1 className=" text-center text-4xl sm:text4xl md:text-5xl xl:text-[64px] 2xl:text-[4vw] lg:mt-3 md:mt-3 sm:mt-0 mt-0 transform leading-[130%] tracking-[-0.06em]">
                <span className="text-[#82FBD0]">.</span>Limitless Potential
                <span className="text-[#82FBD0]">.</span>
              </h1>
            </div>

            <h4 className="flex items-center gap-4 relative text-[#A2A2A2] font-actayRegular text-center text-xs sm:text-base lg:text-lg py-3 sm:py-5 px-6 sm:px-16 lg:px-20 xl:px-36 tracking-wide leading-[2rem] font-normal w-fit mx-auto my-6 md:my-10">
              Powered by{" "}
              <Image
                src={eigenlayer}
                alt="Eigenlayer"
                width={80}
                height={80}
                className="w-16 md:w-20 lg:w-22 h-auto"
              ></Image>
              <div className="absolute top-0 left-0 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-l-2 sm:border-t-4 sm:border-l-4 border-[#5047FF] rounded-tl-md sm:rounded-tl-xl"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-r-2 sm:border-b-4 sm:border-r-4 border-[#5047FF] rounded-br-md sm:rounded-br-xl"></div>
            </h4>

            <div className="flex gap-4 justify-center">
              <Link href="https://app.triggerx.network/" target="blank">
                <button className="relative bg-[#222222] text-[#000000] border border-[#222222] px-6 py-2 sm:px-8 sm:py-3 rounded-full group transition-transform">
                  <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
                  <span className="absolute inset-0 bg-[#F8FF7C] rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
                  <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-2 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs sm:text-base">
                    Start Building
                  </span>
                </button>
              </Link>
              <button
                onClick={() => { }}
                className="relative bg-transparent text-[#F8FF7C] border border-black px-6 py-2 sm:px-8 sm:py-3 rounded-full group transition-transform"
              >
                <span className="absolute inset-0 bg-transparent border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
                <span className="absolute inset-0 bg-transparent rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
                <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-2 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs sm:text-base text-white">
                  Let&apos;s Talk
                </span>
              </button>
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
