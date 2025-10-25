"use client";
import React, { useState } from "react";
import logo from "@/app/assets/footer svgs/footerLogo.svg";
import Image from "next/image";
import { Tooltip } from "antd";
import github from "@/app/assets/footer svgs/github.svg";
import githubdark from "@/app/assets/footer svgs/githubdark.svg";

import twitter from "@/app/assets/footer svgs/twitter.svg";
import twitterdark from "@/app/assets/footer svgs/twitterdark.svg";
import telegram from "@/app/assets/footer svgs/telegram.svg";
import telegramdark from "@/app/assets/footer svgs/telegramdark.svg";
import gitbook from "@/app/assets/footer svgs/gitbook.svg";
import gitbookdark from "@/app/assets/footer svgs/gitbookdark.svg";
import mirror from "@/app/assets/footer svgs/mirror.svg";
import mirrordark from "@/app/assets/footer svgs/mirrordark.svg";
import medium from "@/app/assets/footer svgs/medium.svg";
import mediumdark from "@/app/assets/footer svgs/mediumdark.svg";
import youtube from "@/app/assets/footer svgs/youtube.svg";
import youtubedark from "@/app/assets/footer svgs/youtubedark.svg";

interface FooterSocialLink {
  id: string;
  title: string;
  href: string;
  iconLight: string;
  iconDark: string;
  applyBorderEffect: boolean;
  alt: string;
}
const footerSocialLinks: FooterSocialLink[] = [
  {
    id: "gitbook",
    title: "Gitbook",
    href: "https://triggerx.gitbook.io/triggerx-docs",
    iconLight: gitbook,
    iconDark: gitbookdark,
    applyBorderEffect: true,
    alt: "TriggerX on GitBook",
  },
  {
    id: "telegram",
    title: "Telegram",
    href: "https://t.me/triggerxnetwork",
    iconLight: telegram,
    iconDark: telegramdark,
    applyBorderEffect: true,
    alt: "TriggerX on Telegram",
  },
  {
    id: "github",
    title: "Github",
    href: "https://github.com/trigg3rX",
    iconLight: github,
    iconDark: githubdark,
    applyBorderEffect: true,
    alt: "TriggerX on GitHub",
  },
  {
    id: "twitter",
    title: "Twitter",
    href: "https://x.com/TriggerXnetwork",
    iconLight: twitter,
    iconDark: twitterdark,
    applyBorderEffect: true,
    alt: "TriggerX on Twitter",
  },
  {
    id: "mirror",
    title: "Mirror",
    href: "https://mirror.xyz/0x0255F7A175f73a05765719c165445F63155aF8E9",
    iconLight: mirror,
    iconDark: mirrordark,
    applyBorderEffect: true,
    alt: "TriggerX on Mirror",
  },
  {
    id: "medium",
    title: "Medium",
    href: "https://medium.com/@triggerx",
    iconLight: medium,
    iconDark: mediumdark,
    applyBorderEffect: true,
    alt: "TriggerX on Medium",
  },
  {
    id: "youtube",
    title: "Youtube",
    href: "https://www.youtube.com/@triggerxnetwork",
    iconLight: youtube,
    iconDark: youtubedark,
    applyBorderEffect: true,
    alt: "TriggerX on YouTube",
  },
];

const footerNavLinksTop = [
  {
    id: "keeperNetwork",
    label: "Keeper Network",
    href: "https://triggerx.gitbook.io/triggerx-docs/getting-started-as-keepers",
    isLink: true,
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    id: "build",
    label: "Build",
    href: "/",
    isLink: true,
  },
  {
    id: "docs",
    label: "Docs",
    href: "https://triggerx.gitbook.io/triggerx-docs",
    isLink: true,
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    id: "devhub",
    label: "Dev Hub",
    href: "/devhub",
    isLink: true,
  },
  {
    id: "termsOfUse",
    label: "Term of Use",
    isLink: true,
    title: "Available Soon",
  },
  {
    id: "privacyPolicy",
    label: "Privacy Policy",
    isLink: true,
    title: "Available Soon",
  },
];

function Footer() {
  const currentYear = new Date().getFullYear();
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  return (
    <footer className="relative z-10 flex flex-col items-center justify-center gap-2 md:gap-4 lg:gap-4 2xl:gap-6 mt-20 pt-20 lg:mt-0">
      {/* Main Content Area - Three Centered Sections */}
      <div className="z-40 flex flex-col items-center justify-center gap-8 md:gap-12 w-[88%] sm:w-[95%] md:w-[85%] xl:w-[70%] mx-auto mt-10 md:mt-20">
        {/* Top Section: Social Icons */}
        <div className="flex space-x-2 xs:space-x-3 lg:space-x-4 items-center justify-center">
          {footerSocialLinks.map((link) => (
            <Tooltip
              key={link.id}
              title={link.title}
              color="#141414"
              placement="top"
            >
              <a
                href={link.href}
                className={`flex items-center justify-center w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 overflow-hidden rounded-full transition-colors duration-200 ${link.applyBorderEffect ? "border border-white hover:bg-white hover:border-white" : ""}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.alt}
                onMouseEnter={() => setHoveredIcon(link.id as string)}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <Image
                  src={hoveredIcon === link.id ? link.iconDark : link.iconLight}
                  alt={link.alt}
                  width={24}
                  height={24}
                  className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 object-contain transition-transform duration-200 group-hover:scale-110"
                />
              </a>
            </Tooltip>
          ))}
        </div>

        {/* Middle Section: Navigation Buttons */}
        <div className="flex flex-wrap justify-center gap-x-3 text-[10px] xs:text-[14px] lg:text-[16px] 2xl:text-[18px] whitespace-nowrap tracking-wide">
          {footerNavLinksTop.map((item) => {
            if (item.isLink) {
              if (item.href && item.href.startsWith("http")) {
                // External link
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className="bg-[#131313] text-white hover:text-[#FBF197] border border-[#2E2E2E] rounded-full px-6 py-3 hover:border-[#FBF197] transition-colors font-actayRegular"
                    target={item.target || "_blank"}
                    rel={item.rel || "noopener noreferrer"}
                  >
                    {item.label}
                  </a>
                );
              } else {
                // Internal link
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className="bg-[#131313] text-white hover:text-[#FBF197] border border-[#2E2E2E] rounded-full px-6 py-3 hover:border-[#FBF197] transition-colors font-actayRegular"
                  >
                    {item.label}
                  </a>
                );
              }
            } else {
              // Not a link, just a span
              return (
                <span
                  key={item.id}
                  className={(item as { className?: string }).className || ""}
                  title={item.title}
                >
                  {item.label}
                </span>
              );
            }
          })}
        </div>

        {/* Bottom Section: Copyright */}

        <p className="text-center text-[10px] xs:text-[12px] lg:text-[14px] 2xl:text-[16px] text-white font-actayRegular">
          © {currentYear} TriggerX. All rights reserved.
        </p>
      </div>

      {/* Footer Logo Banner */}
      <div className="z-20 w-[95%] mx-auto h-max pt-5 pb-0 mt-0 sm:mt-8 md:mt-12">
        <Image
          src={logo}
          alt="TriggerX Footer Banner"
          className="w-full h-50"
          priority={false}
          quality={100}
          loading="lazy"
        />
      </div>

      {/* Decorative Background Images */}
      {/* <div className="z-10 absolute left-0 bottom-[80%] md:bottom-[26%] lg:bottom-[40%] w-[80px] sm:w-[130px] lg:w-[150px] 2xl:w-[200px] h-max overflow-hidden">
        <Image
          src={footer1}
          alt=""
          className="w-full h-auto relative -left-5 md:left-0"
        />
      </div>

      <div className="z-10 absolute right-0 bottom-[60%] md:bottom-[50%] lg:bottom-[30%] w-[80px] sm:w-[130px] 2xl:w-[220px] h-max overflow-hidden">
        <Image
          src={footer2}
          alt=""
          className="w-full h-auto relative left-5 md:left-0"
        />
      </div> */}

      <p className="text-[#8D8D8D] text-[10px] xs:text-[12px] lg:text-[14px] 2xl:text-[15px] mt-0 mx-auto flex items-center justify-center">
        Build with ❤️ by{" "}
        <a
          href="https://lampros.tech/?utm_source=triggerx&utm_medium=footer"
          target="_blank"
          className="hover:underline ml-1.5 sm:ml-2"
        >
          Lampros Tech
        </a>
      </p>
    </footer>
  );
}

export default Footer;
