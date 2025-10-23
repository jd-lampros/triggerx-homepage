"use client";
import Image from "next/image";
import honesty from "../app/assets/honesty.svg";
import security from "../app/assets/security.svg";
import validation from "../app/assets/validation.svg";
import reliable from "@/app/assets/reliable.png";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function ReliableKeeperNetwork() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const sectionEl = sectionRef.current;
      if (!sectionEl) return;

      const selector = gsap.utils.selector(sectionEl);

      // Set initial states
      gsap.set(selector(".rk-image"), { autoAlpha: 0, y: 30, rotate: -48 });
      gsap.set(selector(".rk-title-line"), { autoAlpha: 0, y: 20 });
      gsap.set(selector(".rk-desc"), { autoAlpha: 0, y: 20 });
      gsap.set(selector(".rk-card"), { autoAlpha: 0, y: 30 });

      // Image
      gsap.to(selector(".rk-image"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // Title lines
      gsap.to(selector(".rk-title-line"), {
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

      // Description
      gsap.to(selector(".rk-desc"), {
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

      // Cards
      gsap.to(selector(".rk-card"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="w-[90%] my-20 py-20 max-w-[2100px] mx-auto"
    >
      <div className="w-[90%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column - Graphic and Content */}
        <div className="space-y-8">
          {/* Reliable Network Graphic */}
          <div className="w-full h-40 flex items-center justify-start pl-10">
            <Image
              src={reliable}
              alt="Reliable Keeper Network"
              width={200}
              height={150}
              quality={100}
              className="rk-image object-contain rotate-[-48deg]"
            />
          </div>

          {/* Title */}
          <div>
            <h1 className="font-sharpGrotesk text-4xl sm:text-5xl lg:text-4xl xl:text-5xl text-white ">
              <div className="rk-title-line text-white leading-normal">
                Reliable
              </div>
              <div className="rk-title-line text-white leading-normal">
                Keeper Network
              </div>
            </h1>
          </div>

          {/* Description */}
          <p className="rk-desc text-[#A2A2A2] text-lg lg:text-xl xl:text-2xl leading-relaxed max-w-lg">
            TriggerX&apos;s decentralized keeper network powers fault-tolerant,
            unstoppable automation.
          </p>
        </div>

        {/* Right Column - Feature Cards */}
        <div className="space-y-6">
          {/* Card 1 */}
          <div
            className="rk-card flex items-center gap-6 p-6 rounded-[34px]"
            style={{
              background:
                "linear-gradient(180deg, #0D0D0D 0%, rgba(0, 0, 0, 0.03) 100%)",
              border: "0.5px solid rgba(74, 74, 74, 1)",
              backdropFilter: "blur(56px)",
            }}
          >
            <div className="relative rounded-[21px] p-[0.5px] bg-gradient-to-b from-[#A4A4A4] to-[#3E3E3E]">
              <div
                className="w-16 h-16 min-h-16 min-w-16 rounded-[21px] flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(180deg, #222222 0%, #141414 100%)",
                }}
              >
                <Image
                  src={honesty}
                  alt="Consensus"
                  width={24}
                  height={24}
                  className="w-8 h-8"
                />
              </div>
            </div>

            <p className="text-[#A2A2A2] text-lg leading-relaxed font-actayRegular">
              Consensus via BLS aggregation for trustless validation.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="rk-card flex items-center gap-6 p-6 rounded-[34px]"
            style={{
              background:
                "linear-gradient(180deg, #0D0D0D 0%, rgba(0, 0, 0, 0.03) 100%)",
              border: "0.5px solid rgba(74, 74, 74, 1)",
              backdropFilter: "blur(56px)",
            }}
          >
            <div className="relative rounded-[21px] p-[0.5px] bg-gradient-to-b from-[#A4A4A4] to-[#3E3E3E]">
              <div
                className="w-16 h-16 min-h-16 min-w-16 rounded-[21px] flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(180deg, #222222 0%, #141414 100%)",
                  border: "0.5px solid",
                  borderImageSource:
                    "linear-gradient(180deg, #A4A4A4 0%, #3E3E3E 100%)",
                }}
              >
                <Image
                  src={security}
                  alt="Load balancing"
                  width={24}
                  height={24}
                  className="w-8 h-8"
                />
              </div>
            </div>
            <p className="text-[#A2A2A2] text-lg leading-relaxed font-actayRegular">
              Fair, load-balanced task distribution to optimize efficiency.
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="rk-card flex items-center gap-6 p-6 rounded-[34px]"
            style={{
              background:
                "linear-gradient(180deg, #0D0D0D 0%, rgba(0, 0, 0, 0.03) 100%)",
              border: "0.5px solid rgba(74, 74, 74, 1)",
              backdropFilter: "blur(56px)",
            }}
          >
            <div className="relative rounded-[21px] p-[0.5px] bg-gradient-to-b from-[#A4A4A4] to-[#3E3E3E]">
              <div
                className="w-16 h-16 min-h-16 min-w-16 rounded-[21px] flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(180deg, #222222 0%, #141414 100%)",
                  border: "0.5px solid",
                  borderImageSource:
                    "linear-gradient(180deg, #A4A4A4 0%, #3E3E3E 100%)",
                }}
              >
                <Image
                  src={validation}
                  alt="Redundancy"
                  width={24}
                  height={24}
                  className="w-8 h-8"
                />
              </div>
            </div>
            <p className="text-[#A2A2A2] text-lg leading-relaxed font-actayRegular">
              Redundancy ensures jobs never get missed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReliableKeeperNetwork;
