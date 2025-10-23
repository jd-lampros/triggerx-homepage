"use client";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import honesty from "../app/assets/honesty.svg";
import security from "../app/assets/security.svg";
import validation from "../app/assets/validation.svg";

function SecurityEigenLayerSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const sectionEl = sectionRef.current;
      if (!sectionEl) return;

      const selector = gsap.utils.selector(sectionEl);

      // Set initial states
      gsap.set(selector(".se-title-line"), { autoAlpha: 0, y: 20 });
      gsap.set(selector(".se-desc"), { autoAlpha: 0, y: 20 });
      gsap.set(cardRefs.current, { autoAlpha: 0, y: 30, scale: 0.8 });
      gsap.set(statsRef.current, { autoAlpha: 0, y: -20 });

      // Title lines animation
      gsap.to(selector(".se-title-line"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      // Description animation
      gsap.to(selector(".se-desc"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });

      // Cards animation
      gsap.to(cardRefs.current, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      // Stats animation
      gsap.to(statsRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    // Cleanup on unmount
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-[90%] my-20 py-20 max-w-[2100px] mx-auto"
    >
      <div className="text-center mb-12 lg:mb-16">
        <h1 className="font-sharpGrotesk text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-white mb-6 lg:mb-8">
          <div className="se-title-line text-white leading-normal">
            Security & EigenLayer
          </div>
          <div className="se-title-line text-white leading-normal">AVS</div>
        </h1>
        <p className="se-desc text-[#A2A2A2] text-base sm:text-lg lg:text-xl xl:text-2xl max-w-4xl mx-auto leading-relaxed px-4">
          TriggerX leverages EigenLayer&apos;s Actively Validated Services (AVS)
          to bring Ethereum-grade security to automation.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-6 lg:mb-8">
        {/* Ethereum-level protection */}
        <div
          ref={(el) => {
            if (el) {
              cardRefs.current[0] = el;
            }
          }}
          className="rounded-[34px] p-6 lg:p-8 text-left space-y-8"
          style={{
            background:
              "linear-gradient(180deg, rgba(28, 28, 28, 0.43) 0%, #0D0D0D 100%)",
            border: "0.5px solid rgba(74, 74, 74, 1)",
            backdropFilter: "blur(56px)",
          }}
        >
          <div className="relative max-w-max rounded-[21px] p-[0.5px] bg-gradient-to-b from-[#A4A4A4] to-[#3E3E3E]">
            <div
              className="w-16 h-16 min-h-16 min-w-16 rounded-[21px] flex items-center justify-center"
              style={{
                background: "linear-gradient(180deg, #100618 0%, #352050 100%)",
              }}
            >
              <Image
                src={honesty}
                alt="Ethereum-level protection"
                width={32}
                height={32}
                quality={100}
                className="w-8 h-8 avs-icon"
              />
            </div>
          </div>
          <h3 className="max-w-[80%] font-actayWide text-lg lg:text-xl xl:text-2xl font-bold text-white leading-tight">
            Ethereum-level protection
          </h3>
          <p className="text-[#A2A2A2] text-sm lg:text-base xl:text-lg leading-relaxed">
            Inherits battle-tested security from Ethereum&apos;s validator set.
          </p>
        </div>

        {/* Decentralized validation */}
        <div
          ref={(el) => {
            if (el) {
              cardRefs.current[1] = el;
            }
          }}
          className="rounded-[34px] p-6 lg:p-8 text-left space-y-8"
          style={{
            background:
              "linear-gradient(180deg, rgba(28, 28, 28, 0.43) 0%, #0D0D0D 100%)",
            border: "0.5px solid rgba(74, 74, 74, 1)",
            backdropFilter: "blur(56px)",
          }}
        >
          <div className="relative max-w-max rounded-[21px] p-[0.5px] bg-gradient-to-b from-[#A4A4A4] to-[#3E3E3E]">
            <div
              className="w-16 h-16 min-h-16 min-w-16 rounded-[21px] flex items-center justify-center"
              style={{
                background: "linear-gradient(180deg, #100618 0%, #352050 100%)",
                border: "0.5px solid",
                borderImageSource:
                  "linear-gradient(180deg, #A4A4A4 0%, #3E3E3E 100%)",
              }}
            >
              <Image
                src={security}
                alt="Decentralized validation"
                width={32}
                height={32}
                quality={100}
                className="w-8 h-8 avs-icon"
              />
            </div>
          </div>
          <h3 className="max-w-[80%] font-actayWide text-lg lg:text-xl xl:text-2xl font-bold text-white leading-tight">
            Decentralized validation
          </h3>
          <p className="text-[#A2A2A2] text-sm lg:text-base xl:text-lg leading-relaxed">
            Jobs are executed and verified by independent keeper quorums.
          </p>
        </div>

        {/* Fault-tolerant design */}
        <div
          ref={(el) => {
            if (el) {
              cardRefs.current[2] = el;
            }
          }}
          className="rounded-[34px] p-6 lg:p-8 text-left space-y-8"
          style={{
            background:
              "linear-gradient(180deg, rgba(28, 28, 28, 0.43) 0%, #0D0D0D 100%)",
            border: "0.5px solid rgba(74, 74, 74, 1)",
            backdropFilter: "blur(56px)",
          }}
        >
          <div className="relative max-w-max rounded-[21px] p-[0.5px] bg-gradient-to-b from-[#A4A4A4] to-[#3E3E3E]">
            <div
              className="w-16 h-16 min-h-16 min-w-16 rounded-[21px] flex items-center justify-center"
              style={{
                background: "linear-gradient(180deg, #100618 0%, #352050 100%)",
              }}
            >
              <Image
                src={validation}
                alt="Fault-tolerant design"
                width={32}
                height={32}
                quality={100}
                className="w-8 h-8 avs-icon"
              />
            </div>
          </div>
          <h3 className="max-w-[80%] font-actayWide text-lg lg:text-xl xl:text-2xl font-bold text-white leading-tight">
            Fault-tolerant design
          </h3>
          <p className="text-[#A2A2A2] text-sm lg:text-base xl:text-lg leading-relaxed">
            Aggregated BLS signatures safeguard results against malicious or
            faulty actors.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div
        ref={statsRef}
        className="w-[90%] mx-auto rounded-[34px] p-6 lg:p-8"
        style={{
          background:
            "linear-gradient(180deg, #0D0D0D 0%, rgba(0, 0, 0, 0.03) 100%)",
          backdropFilter: "blur(56px)",
          border: "0.5px solid rgba(74, 74, 74, 1)",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
          <div className="text-left">
            <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2">
              25,760
            </div>
            <div className="text-[#A2A2A2] text-sm lg:text-base xl:text-lg">
              Total Stakers
            </div>
          </div>

          <div className="text-left">
            <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2">
              4
            </div>
            <div className="text-[#A2A2A2] text-sm lg:text-base xl:text-lg">
              Total Operators
            </div>
          </div>

          <div className="text-left">
            <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2">
              668,010.17
            </div>
            <div className="text-[#A2A2A2] text-sm lg:text-base xl:text-lg">
              TVL
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SecurityEigenLayerSection;
