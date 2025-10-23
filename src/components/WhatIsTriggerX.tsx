import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import icon1 from "../app/assets/1.png";
import icon2 from "../app/assets/2.png";
import icon3 from "../app/assets/3.png";
import icon4 from "../app/assets/4.png";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Define interfaces
interface CardData {
  title: string;
  description: string;
  icon: StaticImageData; // Static import type
}

function WhatIsTriggerX() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonRefs = useRef<HTMLButtonElement[]>([]);

  // Function to scroll to a section
  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useLayoutEffect(() => {
    if (!containerRef.current || itemsRef.current.length === 0) return;

    const items = itemsRef.current;
    const offset = 30;

    // Setup initial positions
    gsap.set(items, {
      x: (index) => offset * index,
      y: (index) => -offset * index,
      zIndex: (index) => items.length - index,
      position: "absolute",
      // top: "50%",
      // left: "50%",
      // transform: "translate(-50%, -50%)",
    });

    // Diagonal loop animation
    function diagonalLoop(items: HTMLDivElement[]): () => void {
      const totalItems: number = items.length;
      let currentItem: number = 0;

      function updatePositions(): void {
        for (let i = 0; i < totalItems; i++) {
          const itemIndex: number = (currentItem + i) % totalItems;
          const item: HTMLDivElement = items[itemIndex];
          gsap.to(item, {
            x: offset * i,
            y: -offset * i,
            zIndex: totalItems - i,
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          });
        }
      }

      function moveToNext(): void {
        currentItem = (currentItem + 1) % totalItems;
        updatePositions();
      }

      const interval: NodeJS.Timeout = setInterval(moveToNext, 3000); // Every 3 seconds
      updatePositions();

      // Cleanup function
      return () => clearInterval(interval);
    }

    const cleanup = diagonalLoop(items);

    return cleanup;
  }, []);

  // GSAP Animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(
        [
          titleRef.current,
          descriptionRef.current,
          containerRef.current,
          ...buttonRefs.current,
        ],
        {
          opacity: 0,
          y: 20,
        }
      );

      // Create timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          end: "center center",

          scrub: 1,
          preventOverlaps: true,
          fastScrollEnd: true,
        },
      });

      // Animate elements in sequence
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      })
        .to(descriptionRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        })
        .to(containerRef.current, {
          opacity: 1,
          y: 0,
        })
        .to(buttonRefs.current, {
          opacity: 1,
          y: 0,
          stagger: 0.05,
        });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const cardData: CardData[] = [
    {
      title: "Ready-to-Use Templates",
      description: "Time, event, and condition-based automations.",
      icon: icon1,
    },
    {
      title: "Crypto-Economic Security",
      description: "Backed by EigenLayer AVS.",
      icon: icon2,
    },
    {
      title: "Interlinked Jobs",
      description: "Chain up to three tasks in sequence.",
      icon: icon3,
    },
    {
      title: "Multi-Chain Architecture",
      description: "Works seamlessly across L2s, sidechains, and rollups.",
      icon: icon4,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="mx-auto w-[90%] lg:mb-0 max-w-[2100px]"
    >
      {/* Parent Container */}
      <div className="p-6 sm:p-8 lg:p-12 xl:p-16 2xl:p-20 w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Title and Description */}
          <div className="text-center space-y-8">
            <h1
              ref={titleRef}
              className="font-sharpGrotesk text-3xl sm:text-4xl lg:text-5xl xl:text-5xl 2xl:text-5xl text-white mb-6 lg:mb-8"
            >
              What is &apos;TriggerX&apos;?
            </h1>
            <p
              ref={descriptionRef}
              className="text-[#A2A2A2] font-normal font-actayRegular sm:text-lg lg:text-xl xl:text-2xl leading-relaxed mb-8"
            >
              TriggerX is a decentralized automation layer for the multi-chain
              world. Instead of reinventing automation for every network,
              developers can plug into a secure, scalable framework that just
              works.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="https://app.triggerx.network/" target="blank">
                <button
                  ref={(el) => {
                    if (el) buttonRefs.current[0] = el;
                  }}
                  className="relative bg-[#222222] text-[#000000] border border-[#222222] px-6 py-2 sm:px-8 sm:py-3 rounded-full group transition-transform"
                >
                  <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
                  <span className="absolute inset-0 bg-[#F8FF7C] rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
                  <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-2 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs sm:text-base">
                    Start Building
                  </span>
                </button>
              </Link>
              <button
                ref={(el) => {
                  if (el) buttonRefs.current[1] = el;
                }}
                onClick={() => scrollToSection("contact-section")}
                className="relative bg-transparent text-[#F8FF7C] border border-black px-6 py-2 sm:px-8 sm:py-3 rounded-full group transition-transform"
              >
                <span className="absolute inset-0 bg-transparent border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
                <span className="absolute inset-0 bg-transparent rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
                <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-2 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs sm:text-base text-white">
                  Let&apos;s Talk
                </span>
              </button>
            </div>
          </div>

          {/* Right Side - Animated Cards Container */}
          <div className="relative h-[32rem] lg:h-[36rem] xl:h-[38rem] 2xl:h-[42rem] flex items-center justify-center overflow-hidden">
            <div
              ref={containerRef}
              className="relative w-full h-full flex justify-center items-end"
            >
              {cardData.map((card: CardData, index: number) => (
                <div
                  key={index}
                  ref={(el) => {
                    if (el) itemsRef.current[index] = el;
                  }}
                  className="absolute w-72 sm:w-80 lg:w-96 xl:w-[24rem] h-80 sm:h-96 lg:h-[28rem] xl:h-[32rem] 2xl:h-[36rem] bg-[#0F0F0F] border border-[#4D4D4D] rounded-3xl flex flex-col items-center justify-center p-6 sm:p-8 lg:p-10 shadow-lg"
                  style={{
                    transform: `translate(${index * 30}px, ${-index * 30}px)`,
                    zIndex: cardData.length - index,
                  }}
                >
                  <div className="w-24 h-24 sm:w-24 sm:h-24 lg:w-[12rem] lg:h-[12rem] mx-auto mb-4 sm:mb-6 rounded-xl flex items-center justify-center shadow-lg">
                    <Image
                      src={card.icon}
                      alt={card.title}
                      width={700}
                      height={700}
                      quality={100}
                      className="w-full object-contain"
                    />
                  </div>
                  <h3 className="font-actayWide text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white leading-tight text-center mb-3 sm:mb-4">
                    {card.title}
                  </h3>
                  <p className="text-[#A2A2A2] font-normal font-actayRegular text-sm sm:text-base lg:text-lg leading-relaxed text-center max-w-xs sm:max-w-sm">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhatIsTriggerX;
