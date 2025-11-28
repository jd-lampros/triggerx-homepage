"use client";
import React from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import logo from "../app/assets/logo.svg";
import crystal from "../app/assets/crystal_hero-2.svg";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect as useGsapEffect } from "react";
import AnimatedButton from "./ui/AnimatedButton";
import { shouldShowPreloader } from "@/lib/visitTracker";


const Header = () => {
  // State variables for UI and animation control
  const [menuOpen, setMenuOpen] = useState(false);
  const [highlightStyle, setHighlightStyle] = useState({});
  const [prevRect, setPrevRect] = useState<DOMRect | undefined>();
  const [scrollToSection, setScrollToSection] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  // Refs for DOM elements used in navigation
  const navRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuItemsRef = useRef<HTMLDivElement[]>([]);
  // Next.js router and current path
  const router = useRouter();
  const pathname = usePathname();

  interface NavItem {
    id: string;
    path?: string;
    label: string;
    target?: string;
    external?: boolean;
    dropdown?: boolean;
  }
  // Navigation items for the menu
  const navItems: NavItem[] = [
    {
      id: "Dev Hub",
      path: "https://app.triggerx.network/devhub",
      label: "Dev Hub",
      target: "_blank",
      external: true,
    },
    {
      id: "Leaderboard",
      path: "https://app.triggerx.network/leaderboard",
      label: "Leaderboard",
      target: "_blank",
      external: true,
    },
    {
      id: "Join as Keeper",
      path: "https://triggerx.gitbook.io/triggerx-docs/getting-started-as-keepers",
      label: "Join as Keeper",
      target: "_blank",
      external: true,
    },
    { id: "Blog", path: "/blog", label: "Blog" },
  ];

  // Checks if a route is active (for nav highlight)
  const isActiveRoute = (path: string) => pathname === path;

  // Handles clicking a nav menu item
  const handleMenuItemClick = (path: string, hasDropdown = false) => {
    if (path && !hasDropdown) {
      router.push(path);
    }
    if (hasDropdown) {
      setDropdownOpen(!dropdownOpen);
    }
  };

  // Handles clicking the "Contact Us" button
  const handleClick = () => {
    if (pathname !== "/") {
      setScrollToSection(true);
      router.push("/");
    } else {
      const section = document.getElementById("contact-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Handles mouse enter on nav item (for highlight animation)
  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    const hoveredElement = event.currentTarget;
    if (!hoveredElement) return;

    // Use requestAnimationFrame to avoid forced reflows
    requestAnimationFrame(() => {
      const rect = hoveredElement.getBoundingClientRect();
      const navRect = navRef.current
        ? navRef.current.getBoundingClientRect()
        : { x: 0, y: 0, width: 0, height: 0 };

      setHighlightStyle({
        opacity: 1,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        transform: `translateX(${rect.x - navRect.x}px)`,
        transition: prevRect ? "all 0.3s ease" : "none",
      });

      setPrevRect(rect);
    });
  };

  // Handles mouse leaving nav (hide highlight)
  const handleMouseLeave = () => {
    setHighlightStyle((prev) => ({
      ...prev,
      opacity: 0,
      transition: "all 0.3s ease",
    }));
  };

  // Toggles dropdown menu
  const toggleDropdown = (item: NavItem) => {
    if (item.dropdown) {
      setDropdownOpen(!dropdownOpen);
    } else {
      setDropdownOpen(false);
    }
  };

  // Handles clicking the logo
  const handleLogoClick = () => {
    router.push("/");
  };

  // useEffect: Closes dropdown menu when clicking outside
  useEffect(() => {
    // Function to handle click outside dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest("button")
      ) {
        setDropdownOpen(false); // Close dropdown
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside); // Listen for outside clicks
    }

    // Cleanup: Remove event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]); // Runs when dropdownOpen changes

  // useEffect: Always scroll to top on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0); // Scroll to top
    }
  }, []); // Runs once on mount

  // useEffect: Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [menuOpen]);




  // Initial mobile check (resize handling is now centralized)
  useEffect(() => {
    const isMobileView = window.innerWidth < 800;
    setIsMobile(isMobileView);
  }, []);

  // Optimized GSAP animation for header entrance (lazy-loaded GSAP)
  useGsapEffect(() => {
    const PRELOADER_DURATION = 2.5; // seconds - reduced to 2.5s
    const shouldShowPreloaderAnimation = shouldShowPreloader();

    // Function to animate header with reduced complexity
    const animateHeader = async () => {
      const gsap = (await import("gsap")).default;
      if (!headerRef.current || !logoRef.current) return;

      // Use transform3d for hardware acceleration
      gsap.set(headerRef.current, {
        y: -200,
        opacity: 0,
        force3D: true,
        willChange: "transform, opacity"
      });
      gsap.set(logoRef.current, {
        y: -100,
        opacity: 0,
        force3D: true,
        willChange: "transform, opacity"
      });

      // Simplified timeline with fewer properties
      const tl = gsap.timeline({
        onComplete: () => {
          // Clean up willChange after animation
          gsap.set([headerRef.current, logoRef.current], { willChange: "auto" });
        }
      });

      // Animate header with hardware acceleration
      tl.to(headerRef.current, {
        duration: 0.6, // Reduced duration
        y: 0,
        opacity: 1,
        ease: "power2.out",
        force3D: true
      })
        // Animate logo with reduced delay
        .to(logoRef.current, {
          duration: 0.6, // Reduced duration
          y: 0,
          opacity: 1,
          ease: "power2.out",
          force3D: true
        }, "-=0.2"); // Reduced delay

      setAnimationCompleted(true);
    };

    // Start header animation after preloader completes or immediately if no preloader
    const delay = shouldShowPreloaderAnimation ? PRELOADER_DURATION * 1000 : 0;

    const timer = setTimeout(() => {
      animateHeader();
    }, delay);

    // Cleanup timer on unmount
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // GSAP animation for mobile menu (lazy-loaded GSAP)
  useGsapEffect(() => {
    if (!mobileMenuRef.current || !mobileMenuItemsRef.current.length) return;

    if (menuOpen) {
      // Set initial state for menu items
      (async () => {
        const gsap = (await import("gsap")).default;
        gsap.set(mobileMenuItemsRef.current, {
          y: 100,
          opacity: 0,
          force3D: true,
          willChange: "transform, opacity"
        });

        // Animate menu items with stagger effect
        gsap.to(mobileMenuItemsRef.current, {
          duration: 0.6,
          y: 0,
          opacity: 1,
          ease: "power2.out",
          stagger: 0.1,
          force3D: true,
          onComplete: () => {
            // Clean up willChange after animation
            gsap.set(mobileMenuItemsRef.current, { willChange: "auto" });
          }
        });
      })();
    } else {
      // Animate menu items out
      (async () => {
        const gsap = (await import("gsap")).default;
        gsap.to(mobileMenuItemsRef.current, {
          duration: 0.4,
          y: -50,
          opacity: 0,
          ease: "power2.in",
          stagger: 0.05,
          force3D: true
        });
      })();
    }
  }, [menuOpen]);

  return (
    <>
      {/* Desktop Header */}
      <div
        className={`w-full z-[9999] bg-transparent hidden lg:block top-0 left-0 absolute ${!animationCompleted ? "opacity-0" : ""}`}
      >

        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 lg:w-[500px] h-full">
          <div className="relative w-full h-full translate-y-[-20px]">
            <Image
              src={crystal}
              alt="Crystal Image"
              priority
              quality={80}
              // sizes="(max-width: 768px) 35vw, (max-width: 1024px) 30vw, (max-width: 1536px) 32vw, 30vw"
            />
          </div>
        </div>


        <div className="w-full my-8 flex justify-center items-center" ref={headerRef}>
          <div className="w-[90%] mx-auto bg-transparent ">
            <div className="w-full flex items-center justify-between header z-100">
              {/* Logo */}
              <div className="flex-shrink-0 w-[130px] xl:w-[160px]">
                <div
                  ref={logoRef}
                  onClick={handleLogoClick}
                  className="relative cursor-pointer"
                >
                  <Link href="/">
                    <Image
                      src={logo}
                      alt="TriggerX Logo"
                      priority
                      quality={90}
                      // sizes="(max-width: 768px) 35vw, (max-width: 1024px) 30vw, (max-width: 1536px) 32vw, 30vw"
                    />
                  </Link>
                </div>
              </div>

              {/* Navigation*/}
              <nav
                ref={navRef}
                className="relative bg-[#181818F0] backdrop-blur-[20px] rounded-2xl z-10 disable-grid-effect"
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="absolute rounded-2xl opacity-0"
                  style={highlightStyle}
                >
                  <div className="w-full h-full rounded-2xl p-[0.5px] bg-gradient-to-b from-[#ffffff] to-[#4B4A4A]">
                    <div className="w-full h-full rounded-2xl bg-[#181818F0] flex items-center justify-center">
                      <div className="w-full h-full rounded-2xl bg-[linear-gradient(180deg,rgba(217,217,217,0.12)_0%,rgba(20,19,19,0.12)_100%)] flex items-center justify-center">

                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative flex xl:gap-5">
                  {navItems.map((item) => (
                    <div key={item.id} className="relative">
                      {item.dropdown ? (
                        <button
                          onClick={() => toggleDropdown(item)}
                          onMouseEnter={handleMouseEnter}
                          className={`text-nowrap font-actayRegular text-center text-sm xl:text-base px-4 xl:px-6 py-3 rounded-2xl text-white relative z-10 cursor-pointer flex items-center gap-1 ${item.path && isActiveRoute(item.path)
                            ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] rounded-2xl border border-[#4B4A4A]"
                            : "transparent"
                            }`}
                        >
                          {item.label}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : "rotate-0"
                              }`}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        </button>
                      ) : item.external ? (
                        <Link
                          href={item.path || "/"}
                          target="_blank"
                          rel="noopener noreferrer"
                          onMouseEnter={handleMouseEnter}
                          className="text-nowrap font-actayRegular text-center lg:text-[11px] xl:text-[14px] px-4 xl:px-6 py-3 rounded-2xl text-white relative z-10 cursor-pointer flex items-center gap-1"
                        >
                          {item.label}
                        </Link>
                      ) : item.label === "Contact Us" ? (
                        <button
                          onClick={handleClick}
                          onMouseEnter={handleMouseEnter}
                          className="text-nowrap font-actayRegular text-center lg:text-[11px] xl:text-[14px] px-4 xl:px-6 py-3 rounded-2xl text-white relative z-10 cursor-pointer flex items-center gap-1"
                        >
                          {item.label}
                        </button>
                      ) : (
                        <Link
                          href={item.path || "/"}
                          passHref
                          onMouseEnter={handleMouseEnter}
                          onClick={() =>
                            handleMenuItemClick(
                              item.path || "",
                              item.dropdown ?? false
                            )
                          }
                          className="text-nowrap font-actayRegular text-center text-sm xl:text-base px-4 xl:px-6 py-3 rounded-2xl text-white relative z-10 cursor-pointer flex items-center gap-1"
                        >
                          {item.label}
                        </Link>
                      )}
                      {/* Desktop Dropdown Menu */}
                      {item.dropdown && dropdownOpen && item.id === "Get Started" && (
                        <div
                          ref={dropdownRef}
                          className="absolute top-full left-0 mt-2 bg-[#181818F0] backdrop-blur-[20px] rounded-2xl shadow-lg border border-[#4b4a4a] z-20 min-w-[200px]"
                        >
                          <div className="py-2">
                            <a
                              href="https://app.triggerx.network/devhub"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-actayRegular block px-4 py-3 text-white hover:bg-[#282828] rounded-2xl text-sm mx-2"
                            >
                              Dev Hub
                            </a>
                            <a
                              href="https://app.triggerx.network/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-actayRegular block px-4 py-3 text-white hover:bg-[#282828] rounded-2xl text-sm mx-2"
                            >
                              Build
                            </a>
                            <a
                              href="https://triggerx.gitbook.io/triggerx-docs/getting-started-as-keepers"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-actayRegular block px-4 py-3 text-white hover:bg-[#282828] rounded-2xl text-sm mx-2"
                            >
                              Join as Keeper
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </nav>

              {/* Desktop CTA on the right */}
              <div className="flex-shrink-0 w-60 flex items-center justify-end">
                <AnimatedButton
                  href="https://app.triggerx.network/"
                  variant="yellow_outline"
                  flairColor="#fff837"
                  size="sm"
                >
                  Start Building
                </AnimatedButton>
              </div>

              {/* {animationCompleted && (
                <div className="absolute right-10">
                  <Link href="https://app.triggerx.network" target="_blank">
                    <button className="relative bg-[#222222] text-[#000000] border border-[#222222] px-6 py-2 sm:px-8 sm:py-3  lg:px-6 xl:px-8 rounded-full group transition-transform">
                      <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
                      <span className="absolute inset-0 bg-[#fff837] rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
                      <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-0 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs sm:text-base">
                        Start Building
                      </span>
                    </button>
                  </Link>
                </div>
              )} */}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Header */}
      <div
        className={`relative h-auto w-full z-50 block lg:hidden bg-transparent`}
      >
        <div
          className="absolute top-0 left-0 right-0 w-full z-50"
        >
          <div className="w-full">
            <div className="w-[100%] sm:px-10 px-2 my-6 md:my-8 flex justify-between gap-3 items-center lg:hidden">
              <div className="w-full relative flex items-center justify-start">
                <Image
                  src={logo}
                  alt="TriggerX Logo"
                  className="w-[170px] h-auto"
                  width={100}
                  height={100}
                />
              </div>
              <div
                className="flex-shrink-0 relative z-10 lg:hidden"
              >
                <div className="menu">
                  <svg
                    className={`ham hamRotate ham1 ${menuOpen ? 'active' : ''} w-12`}
                    viewBox="0 0 100 100"


                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    <path className="line top" d="m 30,33 h 40 c 0,0 9.044436,-0.654587 9.044436,-8.508902 0,-7.854315 -8.024349,-11.958003 -14.89975,-10.85914 -6.875401,1.098863 -13.637059,4.171617 -13.637059,16.368042 v 40" />
                    <path className="line middle" d="m 30,50 h 40" />
                    <path className="line bottom" d="m 30,67 h 40 c 12.796276,0 15.357889,-11.717785 15.357889,-26.851538 0,-15.133752 -4.786586,-27.274118 -16.667516,-27.274118 -11.88093,0 -18.499247,6.994427 -18.435284,17.125656 l 0.252538,40" />
                  </svg>
                </div>
                {menuOpen && (
                  <div
                    ref={mobileMenuRef}
                    className="fixed top-[120px] left-0 right-0 bottom-0 w-full bg-[#0a0a0a] z-[9999] flex items-center justify-center lg:hidden"
                    onClick={() => setMenuOpen(false)}
                  >
                    <nav
                      ref={navRef}
                      className="absolute top-10 left-0 w-full max-w-md mx-auto px-6"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="absolute bg-gradient-to-r from-[#D9D9D924] to-[#14131324] rounded-2xl border border-[#4B4A4A] opacity-0"
                        style={highlightStyle}
                      />
                      <div className="flex flex-col gap-6 items-center">
                        {navItems.map((item, index) => (
                          <div
                            ref={(el) => {
                              if (el) mobileMenuItemsRef.current[index] = el;
                            }}
                            key={item.id}
                            className="relative w-full"
                          >
                            {item.dropdown ? (
                              <button
                                key={item.id}
                                onClick={() => {
                                  handleMenuItemClick(
                                    item.path || "",
                                    item.dropdown ?? false
                                  );
                                }}
                                className={`font-actayRegular text-lg px-8 py-3 rounded-2xl relative z-10 cursor-pointer flex items-center justify-center gap-2 hover:bg-[#282828] w-full ${item.path && isActiveRoute(item.path)
                                  ? "text-white"
                                  : "text-gray-400"
                                  }`}
                              >
                                {item.label}

                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : "rotate-0"
                                    }`}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                  />
                                </svg>
                              </button>
                            ) : item.external ? (
                              <a
                                href={item.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setMenuOpen(false)}
                                className="font-actayRegular text-lg px-8 py-3 rounded-2xl relative z-10 cursor-pointer flex items-center justify-center gap-2 hover:bg-[#282828] w-full"
                              >
                                {item.label}
                              </a>
                            ) : item.label === "Contact Us" ? (
                              <button
                                onClick={() => {
                                  handleClick();
                                  setMenuOpen(false);
                                }}
                                className={`text-nowrap font-actayRegular text-center text-lg px-8 py-3 rounded-2xl text-white relative z-10 cursor-pointer flex items-center justify-center gap-2 w-full ${item.path && isActiveRoute(item.path)
                                  ? "text-white"
                                  : "text-gray-400"
                                  }`}
                              >
                                {item.label}
                              </button>
                            ) : (
                              <Link
                                href={item.path || "/"}
                                target="_blank"
                                onClick={() => {
                                  setMenuOpen(false);
                                }}
                                className={`text-nowrap font-actayRegular text-center text-lg px-8 py-3 rounded-2xl text-white relative z-10 cursor-pointer flex items-center justify-center gap-2 ${item.path && isActiveRoute(item.path)
                                  ? "text-white"
                                  : "text-gray-400"
                                  }`}
                              >
                                {item.label}
                              </Link>
                            )}
                            {item.dropdown && dropdownOpen && item.id === "Get Started" && (
                              <div
                                ref={dropdownRef}
                                className="bg-[#181818F0] mt-4 text-sm rounded-2xl shadow-lg border border-[#4b4a4a] w-full"
                              >
                                <div className="py-3 px-6 flex flex-col gap-2">
                                  <a
                                    href="https://app.triggerx.network/devhub"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setMenuOpen(false)}
                                    className="font-actayRegular block px-4 py-3 text-white hover:bg-[#282828] rounded-[8px] text-center"
                                  >
                                    Dev Hub
                                  </a>
                                  <a
                                    href="https://app.triggerx.network/"
                                    target="_blank"
                                    onClick={() => setMenuOpen(false)}
                                    className="font-actayRegular block px-4 py-3 text-white hover:bg-[#282828] rounded-[8px] text-center"
                                  >
                                    Build
                                  </a>
                                  <a
                                    href="https://triggerx.gitbook.io/triggerx-docs/getting-started-as-keepers"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setMenuOpen(false)}
                                    className="font-actayRegular block px-4 py-3 text-white hover:bg-[#282828] rounded-[8px] text-center"
                                  >
                                    Join as Keeper
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div
                        ref={(el) => {
                          if (el) mobileMenuItemsRef.current[navItems.length] = el;
                        }}
                        className="mt-8 px-4 disable-grid-effect flex items-center justify-center"
                      >
                        <AnimatedButton
                          href="https://app.triggerx.network/"

                          variant="yellow_outline"
                          flairColor="#fff837"
                          className="w-50  md:px-6 md:py-3 md:text-lg px-5 py-2.5 text-base"
                        >
                          <button className="text-[#fff837]">Start Building</button>
                        </AnimatedButton>
                      </div>
                    </nav>
                  </div>
                )}

              </div>
            </div>
          </div>


        </div>
      </div>
    </>
  );
};

export default Header;


