import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import whoisfor from "../app/assets/whoisfor2.png";
import honesty from "../app/assets/honesty.svg";
import security from "../app/assets/security.svg";
import validation from "../app/assets/validation.svg";
import MarqueePills from "./MarqueePills";
import { useCasesData } from "../data/useCasesData";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function WhoIsTriggerXFor() {
  // Refs for animation
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);

  // Helper function to get the correct image import
  const getImageSrc = (imagePath: string) => {
    if (imagePath.includes("honesty.svg")) return honesty;
    if (imagePath.includes("security.svg")) return security;
    if (imagePath.includes("validation.svg")) return validation;
    return honesty; // fallback
  };

  // GSAP Animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(
        [
          imageRef.current,
          titleRef.current,
          subtitleRef.current,
          descriptionRef.current,
        ],
        {
          opacity: 0,
          y: 50,
        }
      );

      // Create timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",

          preventOverlaps: true,
          fastScrollEnd: true,
        },
      });

      // Animate elements in sequence
      tl.to(imageRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      })
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .to(
          descriptionRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4"
        );

      // Add subtle hover animation to image
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
          paused: true,
        });

        (imageRef.current as HTMLElement).addEventListener("mouseenter", () => {
          gsap.to(imageRef.current, { scale: 1.05, duration: 0.3 });
        });

        (imageRef.current as HTMLElement).addEventListener("mouseleave", () => {
          gsap.to(imageRef.current, { scale: 1, duration: 0.3 });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Generate pill components from JSON data
  const generatePills = () => {
    return useCasesData.pills.map((pill) => (
      <div
        key={pill.id}
        className="bg-[#141414] rounded-full px-3 py-3 lg:px-3 lg:py-3 flex items-center gap-3 lg:gap-4 border border-[#ffffff1a] hover:border-[#FBF197] transition-colors"
      >
        <div className="w-14 h-14 rounded-full p-[1px] bg-gradient-to-b from-[#FBF197] to-[rgba(130,251,208,0.37)]">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[linear-gradient(180deg,rgba(130,251,208,0.12)_0%,rgba(248,255,124,0.12)_100%)] flex items-center justify-center">
              <Image
                src={getImageSrc(pill.image.src)}
                alt={pill.image.alt}
                width={pill.image.width}
                height={pill.image.height}
                className="w-6 h-6 avs-icon"
              />
            </div>
          </div>
        </div>
        <span className="text-white text-sm lg:text-2xl font-actayRegular whitespace-nowrap font-actayRegular mr-4">
          {pill.text}
        </span>
      </div>
    ));
  };

  return (
    <section ref={sectionRef} className="mx-auto my-20 py-20 max-w-[2100px]">
      <div className="w-[90%] mx-auto text-center">
        {/* Logo Placeholder */}
        <div
          ref={imageRef}
          className="mx-auto mb-8 flex items-center justify-center"
        >
          <Image
            src={whoisfor}
            alt="Who is TriggerX For"
            width={500}
            height={500}
            quality={100}
            className="w-64 object-contain"
          />
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="font-sharpGrotesk text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-white mb-6 lg:mb-8"
        >
          Who is TriggerX For?
        </h1>

        {/* Description */}
        <p
          ref={descriptionRef}
          className="text-[#A2A2A2] text-base sm:text-lg lg:text-xl xl:text-2xl max-w-4xl mx-auto leading-relaxed mb-8 lg:mb-12 px-4"
        >
          Whether you&apos;re a dApp developer, DeFi protocol creator, or
          enterprise innovator, TriggerX empowers you to automate tasks with
          ease and confidence.
        </p>

        {/* Use Cases Subtitle */}
        <h2
          ref={subtitleRef}
          className="text-[#F8FF7C] text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-actayWide font-bold mb-8 lg:mb-12"
        >
          Use cases include
        </h2>
      </div>
      {/* Use Cases Pills - Animated Marquee */}
      <div className="w-full">
        <MarqueePills pills={generatePills()} />
      </div>
    </section>
  );
}

export default WhoIsTriggerXFor;
