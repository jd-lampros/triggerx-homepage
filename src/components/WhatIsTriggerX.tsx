import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image, { StaticImageData } from "next/image";
import icon1 from "../app/assets/1.png";
import icon2 from "../app/assets/2.png";
import icon3 from "../app/assets/3.png";
import icon4 from "../app/assets/4.png";
import AnimatedButton from "./ui/AnimatedButton";

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
  const buttonRefs = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    if (!containerRef.current || itemsRef.current.length === 0) return;

    const items = itemsRef.current;
    const offset = 30;
    const totalItems = items.length;

    // Setup initial positions
    gsap.set(items, {
      x: (index) => offset * index,
      y: (index) => -offset * index,
      zIndex: (index) => items.length - index,
      position: "absolute",
    });

    // Create scroll-based animation with original diagonal stacking
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top", // Scroll from section top to bottom
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        fastScrollEnd: true,
        preventOverlaps: true,

        onUpdate: (self) => {
          const progress = self.progress;
          const currentCardIndex = Math.floor(progress * totalItems);

          // Update positions for all cards in the diagonal stack
          for (let i = 0; i < totalItems; i++) {
            const itemIndex = (currentCardIndex + i) % totalItems;
            const item = items[itemIndex];

            if (item) {
              // Set z-index immediately to prevent layering issues
              gsap.set(item, { zIndex: totalItems - i });

              // Then animate position and other properties
              gsap.to(item, {
                x: offset * i,
                y: -offset * i,
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: "power2.out",
              });
            }
          }
        }
      }
    });

    return () => {
      tl.kill();
    };
  }, []);

  // GSAP Animations for initial reveal
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

      // Create timeline for initial reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
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
      className="mx-auto w-[90%] lg:mb-0 max-w-[1600px]"
    >
      {/* Parent Container */}
      <div className="p-6 sm:p-8 lg:p-12 xl:p-16 2xl:p-20 w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Title and Description */}
          <div className="text-center space-y-12">
            <h1
              ref={titleRef}
              className="font-sharpGrotesk text-3xl sm:text-4xl lg:text-[3vw] xl:text-[3vw] 2xl:text-[3vw] text-white mb-8 lg:mb-8"
            >
              What is &apos;TriggerX&apos;?
            </h1>
            <p
              ref={descriptionRef}
              className="text-[#A2A2A2] font-normal font-actayRegular sm:text-lg lg:text-2xl xl:text-2xl 2xl:text-3xl leading-relaxed mb-8"
            >
              TriggerX is a decentralized automation layer for the multi-chain
              world. Instead of reinventing automation for every network,
              developers can plug into a secure, scalable framework that just
              works.
            </p>
            <div className="flex gap-4 justify-center">
              <div ref={(el) => {
                if (el) {
                  buttonRefs.current[0] = el;
                }
              }}>
                <AnimatedButton
                  href="https://app.triggerx.network/"
                  variant="yellow_outline"
                  flairColor="#f8ff7c"
                  className="w-50  md:px-6 md:py-3 md:text-lg px-5 py-2.5 text-base"

                >
                  <button className="text-[#f8ff7c]">Start Building</button>
                </AnimatedButton>
              </div>

              <div ref={(el) => {
                if (el) {
                  buttonRefs.current[1] = el;
                }
              }}>
                <AnimatedButton
                  href="https://app.triggerx.network/"
                  variant="white_outline"
                  flairColor="white"
                  className="w-50  md:px-6 md:py-3 md:text-lg px-5 py-2.5 text-base"

                >
                  <button>Let&apos;s Talk</button>
                </AnimatedButton>
              </div>
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
