"use client";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import getStarted from "@/app/assets/get_started.png";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function FutureOfBlockchainHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    const title = titleRef.current;
    const button = buttonRef.current;

    if (!container || !image || !title || !button) return;

    // Set initial states
    gsap.set([image, title, button], {
      opacity: 0,
      y: 50,
    });

    gsap.set(image, {
      scale: 0.8,
    });

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 90%",
        end: "bottom 80%",
        scrub: 1,
        toggleActions: "play none none reverse",
      },
    });
    tl.to(container, {
      width: "90%",
      borderRadius: 32,
      scale: 1,
      opacity: 1,
      borderColor: "rgba(53, 53, 53, 1)",
    });
    // Animate elements in sequence
    tl.to(
      image,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
      },
      "-=0.3"
    )
      .to(
        title,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .to(
        button,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.3"
      );

    // Add hover animations
    const buttonElement = button as HTMLElement;
    if (buttonElement) {
      buttonElement.addEventListener("mouseenter", () => {
        gsap.to(buttonElement, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      buttonElement.addEventListener("mouseleave", () => {
        gsap.to(buttonElement, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section className="w-full my-20">
      <div
        ref={containerRef}
        className="w-full mx-auto scale-105 opacity-0 p-8 sm:p-12 lg:p-16 xl:p-20 2xl:p-24 flex flex-col items-center justify-center text-center space-y-8 lg:space-y-12"
        style={{
          background: "rgba(16, 16, 16, 0.6)",
          border: "1px solid transparent",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Get Started Image */}
        <div
          ref={imageRef}
          className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 relative"
        >
          <Image
            src={getStarted}
            alt="Get Started"
            width={224}
            height={224}
            className="w-full h-full object-contain"
            quality={100}
          />
        </div>

        {/* Main Text */}
        <div className="space-y-4 lg:space-y-6">
          <h3
            ref={titleRef}
            className="font-sharpGrotesk text-2xl sm:text-4xl lg:text-3xl xl:text-2xl 2xl:text-2xl text-white leading-tight tracking-tight"
          >
            The future of blockchain is automated. Trigger it with TriggerX
          </h3>
        </div>

        {/* CTA Button */}
        <div ref={buttonRef} className="pt-4">
          <Link href="https://app.triggerx.network/" target="blank">
            <button className="relative bg-white text-black px-8 py-4 lg:px-12 lg:py-5 rounded-full font-actayRegular text-base lg:text-lg font-semibold transition-all duration-300 hover:shadow-lg">
              Start Building
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FutureOfBlockchainHero;
