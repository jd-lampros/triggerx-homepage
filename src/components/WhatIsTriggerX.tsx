import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image, { StaticImageData } from "next/image";
import icon1 from "../app/assets/1.png";
import icon2 from "../app/assets/2.png";
import icon3 from "../app/assets/3.png";
import icon4 from "../app/assets/4.png";
import AnimatedButton from "./ui/AnimatedButton";
import { useGSAP } from "@gsap/react";

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

  useGSAP(() => {
    if (!containerRef.current || itemsRef.current.length === 0) return;

    const items = itemsRef.current;
    const offset = 30;
    const totalItems = items.length;
    const breakPoint = 800; // lg breakpoint

    // Setup initial positions
    gsap.set(items, {
      x: (index) => offset * index,
      y: (index) => -offset * index,
      zIndex: (index) => items.length - index,
      position: "absolute",
    });

    // Use GSAP matchMedia for responsive animations
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: `(min-width: ${breakPoint}px)`,
        isMobile: `(max-width: ${breakPoint - 1}px)`,
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop, isMobile, reduceMotion } = context.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
          reduceMotion: boolean;
        };

        if (isDesktop) {
          // Desktop: Optimized scroll-based animation with reduced complexity
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              pin: true,
              scrub: reduceMotion ? 0 : 0.5, // Reduced scrub for better performance
              anticipatePin: 1,
              fastScrollEnd: true,
              preventOverlaps: true,
              markers: false,

              onUpdate: (self) => {
                const progress = self.progress;
                const currentCardIndex = Math.floor(progress * totalItems);

                // Optimized position updates with hardware acceleration
                for (let i = 0; i < totalItems; i++) {
                  const itemIndex = (currentCardIndex + i) % totalItems;
                  const item = items[itemIndex];

                  if (item) {
                    // Use transform3d for hardware acceleration
                    gsap.set(item, {
                      zIndex: totalItems - i,
                      force3D: true,
                      willChange: "transform"
                    });

                    // Simplified animation with fewer properties
                    gsap.to(item, {
                      x: offset * i,
                      y: -offset * i,
                      scale: 1,
                      opacity: 1,
                      duration: reduceMotion ? 0 : 0.2, // Reduced duration
                      ease: "power2.out",
                      force3D: true
                    });
                  }
                }
              }
            }
          });

          return () => {
            tl.kill();
          };
        } else if (isMobile) {
          // Mobile: Manual touch/swipe slider
          const cardWidth = 330; // Card width on mobile (w-80 = 20rem = 320px) - increased for full-width container
          const containerWidth = 400;
          const cardSpacing = 12; // Space between cards

          let isDragging = false;
          let hasStartedDragging = false;
          let startX = 0;
          let startY = 0;
          let currentX = 0;
          let translateX = 0;
          const dragThreshold = 10; // Minimum distance to start dragging

          // Setup mobile slider positions - optimized for full-width container
          const visibleCardWidth = cardWidth + cardSpacing;
          const sideVisibleWidth = 50; // Increased visible side portion for full-width
          const initialOffset = (containerWidth - cardWidth) / 2; // Center the first card
          const maxTranslateX = Math.max(0, (totalItems - 1) * visibleCardWidth - (containerWidth - cardWidth - sideVisibleWidth));

          gsap.set(items, {
            x: (index) => initialOffset + index * visibleCardWidth,
            y: 0,
            zIndex: (index) => items.length - index,
            position: "absolute",
          });

          // Touch event handlers
          const handleTouchStart = (e: TouchEvent) => {
            isDragging = false;
            hasStartedDragging = false;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            currentX = translateX;
          };

          const handleTouchMove = (e: TouchEvent) => {
            if (!hasStartedDragging) {
              const deltaX = Math.abs(e.touches[0].clientX - startX);
              const deltaY = Math.abs(e.touches[0].clientY - startY);

              // Only start dragging if horizontal movement is greater than vertical and exceeds threshold
              if (deltaX > dragThreshold && deltaX > deltaY) {
                hasStartedDragging = true;
                isDragging = true;
              } else if (deltaY > dragThreshold) {
                // If vertical movement is greater, don't start dragging
                return;
              } else {
                // Not enough movement yet
                return;
              }
            }

            if (!isDragging) return;
            e.preventDefault();

            const deltaX = e.touches[0].clientX - startX;
            const newTranslateX = currentX + deltaX;

            // Constrain the translation
            translateX = Math.max(-maxTranslateX, Math.min(0, newTranslateX));

            gsap.set(items, {
              x: (index) => initialOffset + index * visibleCardWidth + translateX,
              force3D: true
            });
          };

          const handleTouchEnd = () => {
            if (!isDragging) {
              // Reset drag state if no dragging occurred
              hasStartedDragging = false;
              return;
            }
            isDragging = false;
            hasStartedDragging = false;

            // Snap to nearest card
            const targetIndex = Math.round(-translateX / visibleCardWidth);
            const targetTranslateX = -targetIndex * visibleCardWidth;

            gsap.to(items, {
              x: (index) => initialOffset + index * visibleCardWidth + targetTranslateX,
              duration: reduceMotion ? 0 : 0.2, // Reduced duration
              ease: "power2.out",
              force3D: true,
              onComplete: () => {
                translateX = targetTranslateX;
              }
            });
          };

          // Mouse event handlers for desktop testing
          const handleMouseDown = (e: MouseEvent) => {
            isDragging = false;
            hasStartedDragging = false;
            startX = e.clientX;
            startY = e.clientY;
            currentX = translateX;
            e.preventDefault();
          };

          const handleMouseMove = (e: MouseEvent) => {
            if (!hasStartedDragging) {
              const deltaX = Math.abs(e.clientX - startX);
              const deltaY = Math.abs(e.clientY - startY);

              // Only start dragging if horizontal movement is greater than vertical and exceeds threshold
              if (deltaX > dragThreshold && deltaX > deltaY) {
                hasStartedDragging = true;
                isDragging = true;
              } else if (deltaY > dragThreshold) {
                // If vertical movement is greater, don't start dragging
                return;
              } else {
                // Not enough movement yet
                return;
              }
            }

            if (!isDragging) return;
            e.preventDefault();

            const deltaX = e.clientX - startX;
            const newTranslateX = currentX + deltaX;

            translateX = Math.max(-maxTranslateX, Math.min(0, newTranslateX));

            gsap.set(items, {
              x: (index) => initialOffset + index * visibleCardWidth + translateX,
            });
          };

          const handleMouseUp = () => {
            if (!isDragging) {
              // Reset drag state if no dragging occurred
              hasStartedDragging = false;
              return;
            }
            isDragging = false;
            hasStartedDragging = false;

            const targetIndex = Math.round(-translateX / visibleCardWidth);
            const targetTranslateX = -targetIndex * visibleCardWidth;

            gsap.to(items, {
              x: (index) => initialOffset + index * visibleCardWidth + targetTranslateX,
              duration: reduceMotion ? 0 : 0.2, // Reduced duration
              ease: "power2.out",
              force3D: true,
              onComplete: () => {
                translateX = targetTranslateX;
              }
            });
          };

          // Add event listeners
          if (containerRef.current) {
            containerRef.current.addEventListener('touchstart', handleTouchStart, { passive: false });
            containerRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
            containerRef.current.addEventListener('touchend', handleTouchEnd);
            containerRef.current.addEventListener('mousedown', handleMouseDown);
            containerRef.current.addEventListener('mousemove', handleMouseMove);
            containerRef.current.addEventListener('mouseup', handleMouseUp);
            containerRef.current.addEventListener('mouseleave', handleMouseUp);
          }

          return () => {
            // Cleanup event listeners
            if (containerRef.current) {
              containerRef.current.removeEventListener('touchstart', handleTouchStart);
              containerRef.current.removeEventListener('touchmove', handleTouchMove);
              containerRef.current.removeEventListener('touchend', handleTouchEnd);
              containerRef.current.removeEventListener('mousedown', handleMouseDown);
              containerRef.current.removeEventListener('mousemove', handleMouseMove);
              containerRef.current.removeEventListener('mouseup', handleMouseUp);
              containerRef.current.removeEventListener('mouseleave', handleMouseUp);
            }
          };
        }
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  // GSAP Animations for initial reveal
  useGSAP(() => {
    const ctx = gsap.context(() => {
      const breakPoint = 1024; // lg breakpoint
      const mm = gsap.matchMedia();

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

      mm.add(
        {
          isDesktop: `(min-width: ${breakPoint}px)`,
          isMobile: `(max-width: ${breakPoint - 1}px)`,
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isMobile, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduceMotion: boolean;
          };

          // Create timeline for initial reveal with responsive triggers
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: isMobile ? "top 90%" : "top 80%", // Start earlier on mobile
              end: isMobile ? "top 30%" : "top 20%", // End earlier on mobile
              scrub: reduceMotion ? 0 : 1,
              preventOverlaps: true,
              fastScrollEnd: true,
            },
          });

          // Animate elements in sequence
          tl.to(titleRef.current, {
            opacity: 1,
            y: 0,
            duration: reduceMotion ? 0 : 0.4,
            ease: "power2.out",
          })
            .to(descriptionRef.current, {
              opacity: 1,
              y: 0,
              duration: reduceMotion ? 0 : 0.4,
              ease: "power2.out",
            })
            .to(containerRef.current, {
              opacity: 1,
              y: 0,
              duration: reduceMotion ? 0 : 0.3,
            })
            .to(buttonRefs.current, {
              opacity: 1,
              y: 0,
              stagger: reduceMotion ? 0 : 0.05,
              duration: reduceMotion ? 0 : 0.3,
            });

          return () => {
            tl.kill();
          };
        }
      );

      return () => {
        mm.revert();
      };
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
      className="mx-auto w-full md:w-[90%] lg:mb-0 max-w-[1600px]"
    >
      {/* Parent Container */}
      <div className="p-0 md:p-6 sm:p-8 lg:p-12 xl:p-16 2xl:p-20 w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-12 gap-4 items-center">
          {/* Left Side - Title and Description */}
          <div className="p-6 md:p-0 text-center space-y-12">
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
                  flairColor="#fff837"
                  className="w-50  md:px-6 md:py-3 md:text-lg px-5 py-2.5 text-base"

                >
                  <button className="text-[#fff837]">Start Building</button>
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
          <div className="relative h-[32rem] sm:h-[36rem] lg:h-[36rem] xl:h-[38rem] 2xl:h-[42rem] flex items-center justify-center overflow-hidden">
            <div
              ref={containerRef}
              className="relative w-full h-full flex justify-start lg:justify-center items-end lg:items-end cursor-grab active:cursor-grabbing"
            >
              {cardData.map((card: CardData, index: number) => (
                <div
                  key={index}
                  ref={(el) => {
                    if (el) itemsRef.current[index] = el;
                  }}
                  className="absolute w-80 sm:w-96 lg:w-96 xl:w-[24rem] h-[28rem] sm:h-[32rem] lg:h-[28rem] xl:h-[32rem] 2xl:h-[36rem] bg-[#0F0F0F] border border-[#4D4D4D] rounded-3xl flex flex-col items-center justify-center p-8 sm:p-10 lg:p-10 shadow-lg lg:transform-none"
                  style={{
                    transform: `translate(${index * 30}px, ${-index * 30}px)`,
                    zIndex: cardData.length - index,
                  }}
                >
                  <div className="w-36 h-36 sm:w-40 sm:h-40 lg:w-[12rem] lg:h-[12rem] mx-auto mb-8 sm:mb-10 rounded-xl flex items-center justify-center shadow-lg">
                    <Image
                      src={card.icon}
                      alt={card.title}
                      width={700}
                      height={700}
                      quality={85}
                      className="w-full object-contain"
                      sizes="(max-width: 640px) 144px, (max-width: 1024px) 160px, 192px"
                    />
                  </div>
                  <h3 className="font-actayWide text-2xl sm:text-3xl lg:text-2xl xl:text-3xl font-bold text-white leading-tight text-center mb-6 sm:mb-8">
                    {card.title}
                  </h3>
                  <p className="text-[#A2A2A2] font-normal font-actayRegular text-lg sm:text-xl lg:text-lg leading-relaxed text-center max-w-md sm:max-w-lg">
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
