"use client";
import Image from "next/image";
import honesty from "../app/assets/honesty.svg";
import security from "../app/assets/security.svg";
import validation from "../app/assets/validation.svg";
import reliable from "@/app/assets/reliable.png";

// Reliable keeper network cards data
const reliableCards = [
  {
    id: 1,
    icon: honesty,
    title: "Consensus",
    description: "Consensus via BLS aggregation for trustless validation.",
    alt: "Consensus"
  },
  {
    id: 2,
    icon: security,
    title: "Load balancing",
    description: "Fair, load-balanced task distribution to optimize efficiency.",
    alt: "Load balancing"
  },
  {
    id: 3,
    icon: validation,
    title: "Redundancy",
    description: "Redundancy ensures jobs never get missed.",
    alt: "Redundancy"
  }
];
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

      // Set initial states with hardware acceleration
      gsap.set(selector(".rk-image"), {
        autoAlpha: 0,
        y: 30,
        rotate: -48,
        force3D: true,
        willChange: "transform, opacity"
      });
      gsap.set(selector(".rk-title-line"), {
        autoAlpha: 0,
        y: 20,
        force3D: true,
        willChange: "transform, opacity"
      });
      gsap.set(selector(".rk-desc"), {
        autoAlpha: 0,
        y: 20,
        force3D: true,
        willChange: "transform, opacity"
      });
      gsap.set(selector(".rk-card"), {
        autoAlpha: 0,
        y: 30,
        force3D: true,
        willChange: "transform, opacity"
      });

      // Image with reduced duration
      gsap.to(selector(".rk-image"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.5, // Reduced duration
        ease: "power2.out", // Simpler easing
        force3D: true,
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // Title lines with reduced duration
      gsap.to(selector(".rk-title-line"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.4, // Reduced duration
        ease: "power2.out", // Simpler easing
        stagger: 0.1, // Reduced stagger
        force3D: true,
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      // Description with reduced duration
      gsap.to(selector(".rk-desc"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.4, // Reduced duration
        ease: "power2.out", // Simpler easing
        force3D: true,
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });

      // Cards with reduced duration
      gsap.to(selector(".rk-card"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.4, // Reduced duration
        ease: "power2.out", // Simpler easing
        stagger: 0.1, // Reduced stagger
        force3D: true,
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
      <div className="w-[90%] max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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
            <h1 className="font-sharpGrotesk text-3xl sm:text-4xl lg:text-[3vw] xl:text-[3vw] 2xl:text-[3vw] text-white ">
              <div className="rk-title-line text-white leading-normal">
                Reliable
              </div>
              <div className="rk-title-line text-white leading-normal">
                Keeper Network
              </div>
            </h1>
          </div>

          {/* Description */}
          <p className="rk-desc text-[#A2A2A2] text-base sm:text-lg lg:text-2xl xl:text-2xl 2xl:text-3xl leading-relaxed max-w-lg">
            TriggerX&apos;s decentralized keeper network powers fault-tolerant,
            unstoppable automation.
          </p>
        </div>

        {/* Right Column - Feature Cards */}
        <div className="space-y-6">
          {reliableCards.map((card) => (
            <div
              key={card.id}
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
                    src={card.icon}
                    alt={card.alt}
                    width={24}
                    height={24}
                    className="w-8 h-8"
                  />
                </div>
              </div>

              <p className="text-[#A2A2A2] lg:text-base xl:text-xl 2xl:text-2xl leading-relaxed font-actayRegular">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ReliableKeeperNetwork;
