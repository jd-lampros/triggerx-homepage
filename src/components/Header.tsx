"use client";
import React from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import logo from "../app/assets/logo.svg";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";


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
      id: "Leaderboard",
      path: "https://app.triggerx.network/leaderboard",
      label: "Leaderboard",
      target: "_blank",
      external: true,
    }, {
      id: "Get Started",
      label: "Get Started",
      dropdown: true,
    },
    { id: "Blog", path: "/blog", label: "Blog" },
    {
      id: "Contact Us",
      label: "Contact Us",
      external: false,
    },
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





  // useEffect: Animates dropdown menu when opened
  useEffect(() => {
    if (dropdownOpen && dropdownRef.current) {
      // Dropdown will be animated with CSS transitions
      // No GSAP needed - CSS handles the animation
    }
  }, [dropdownOpen]); // Runs when dropdownOpen changes


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

  // useEffect: Scrolls to contact section after navigation
  useEffect(() => {
    if (scrollToSection && pathname === "/") {
      setTimeout(() => {
        const section = document.getElementById("contact-section"); // Find contact section
        if (section) {
          section.scrollIntoView({ behavior: "smooth" }); // Scroll to it
        }
        setScrollToSection(false); // Reset flag
      }, 100); // Wait 100ms for DOM update
      setScrollToSection(false); // Reset flag
    }
  }, [pathname, scrollToSection]); // Runs when path or scrollToSection changes

  // useEffect: Always scroll to top on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0); // Scroll to top
    }
  }, []); // Runs once on mount




  // Add new useEffect for handling window resize
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  // GSAP animation for header entrance
  useGSAP(() => {
    // Preloader total duration is 4.0 seconds
    // Character animations: 2.8s (last character finishes)
    // Characters move up: 1s (starts at 2.8s, ends at 3.8s)
    // SVG curve: 0.4s (starts at 3.2s, ends at 3.6s)
    // SVG flat: 0.4s (starts at 3.6s, ends at 4.0s)
    const PRELOADER_DURATION = 4.0; // seconds

    // Function to animate header
    const animateHeader = () => {
      if (!headerRef.current || !logoRef.current) return;

      // Set initial positions
      gsap.set(headerRef.current, { y: -200, opacity: 0 });
      gsap.set(logoRef.current, { y: -100, opacity: 0 });

      // Create timeline for header animations
      const tl = gsap.timeline();

      // Animate header sliding down from top
      tl.to(headerRef.current, {
        duration: 0.8,
        y: 0,
        opacity: 1,
        ease: "power2.out",
      })
        // Then animate logo with a slight delay
        .to(logoRef.current, {
          duration: 0.6,
          y: 0,
          opacity: 1,
          ease: "power2.out",
        }, "-=0.3");

      setAnimationCompleted(true);
    };

    // Start header animation after preloader completes
    const timer = setTimeout(() => {
      animateHeader();
    }, PRELOADER_DURATION * 1000); // Convert to milliseconds

    // Cleanup timer on unmount
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {/* Desktop Header */}
      <div
        ref={headerRef}
        className={`fixed top-0 left-0 w-full z-[9999] bg-transparent ${isMobile ? "hidden" : "block"} ${!animationCompleted ? "opacity-0" : ""}`}
      >
        <div className="w-full h-[150px] flex justify-center items-center">
          <div className="w-[90%] mx-auto bg-transparent ">
            <div className="w-full flex items-center justify-between header z-100">
              {/* Logo */}
              <div className="flex-shrink-0 w-60">
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
                      className="w-full"
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
                          className={`text-nowrap font-actayRegular text-center text-sm xl:text-base px-4 xl:px-6 py-4 rounded-2xl text-white relative z-10 cursor-pointer flex items-center gap-1 ${item.path && isActiveRoute(item.path)
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
                          className="text-nowrap font-actayRegular text-center text-sm xl:text-base px-4 xl:px-6 py-4 rounded-2xl text-white relative z-10 cursor-pointer flex items-center gap-1"
                        >
                          {item.label}
                        </Link>
                      ) : item.label === "Contact Us" ? (
                        <button
                          onClick={handleClick}
                          onMouseEnter={handleMouseEnter}
                          className="text-nowrap font-actayRegular text-center text-sm xl:text-base px-4 xl:px-6 py-4 rounded-2xl text-white relative z-10 cursor-pointer flex items-center gap-1"
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
                          className="text-nowrap font-actayRegular text-center text-sm xl:text-base px-4 xl:px-6 py-4 rounded-2xl text-white relative z-10 cursor-pointer flex items-center gap-1"
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

              {/* Empty div on the right to maintain balance */}
              <div className="flex-shrink-0 w-60 pointer-events-none invisible"></div>

              {/* {animationCompleted && (
                <div className="absolute right-10">
                  <Link href="https://app.triggerx.network" target="_blank">
                    <button className="relative bg-[#222222] text-[#000000] border border-[#222222] px-6 py-2 sm:px-8 sm:py-3  lg:px-6 xl:px-8 rounded-full group transition-transform">
                      <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
                      <span className="absolute inset-0 bg-[#F8FF7C] rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
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
        className={`relative h-screen w-full ${isMobile ? "block" : "hidden"} bg-[#0a0a0a]`}
      >
        <div
          className="fixed top-0 left-0 right-0 w-full h-[100px]"
        >
          <div className="w-full bg-[#0a0a0a]">
            <div className="w-[100%] sm:px-10 px-5 flex justify-end gap-3 items-center py-10 header lg:hidden">
              <div className="relative  items-center gap-5 ">
                <div className="flex-shrink-0 relative z-10 text-sm sm:hidden hidden md:flex"></div>
              </div>
              <div
                className="flex-shrink-0 relative z-10 "
              >
                <div className="lg:hidden">
                  <h4
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-white text-xl lg:text-2xl cursor-pointer"
                  >
                    {menuOpen ? "✖" : "☰"}
                  </h4>
                  {menuOpen && (
                    <div className="absolute top-full right-0 mt-3 bg-[#181818] p-4 rounded-md shadow-lg z-10 md:w-[20rem] w-60 lg:hidden">
                      <nav ref={navRef} className="relative">
                        <div
                          className="absolute bg-gradient-to-r from-[#D9D9D924] to-[#14131324] rounded-2xl border border-[#4B4A4A] opacity-0"
                          style={highlightStyle}
                        />

                        <div className="flex flex-col gap-4">
                          {navItems.map((item) => (
                            <div
                              ref={dropdownRef}
                              key={item.id}
                              className="relative "
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
                                  className={`font-actayRegular text-sm sm:text-sm px-7 py-3 rounded-2xl relative z-10 cursor-pointer flex items-center gap-1 hover:bg-[#282828] w-full ${item.path && isActiveRoute(item.path)
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
                                    className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : "rotate-0"
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
                                  className="font-actayRegular text-sm
                                   sm:text-sm
                      px-7 py-3 rounded-2xl
                          relative z-10 cursor-pointer flex items-center gap-1 hover:bg-[#282828] w-full"
                                >
                                  {item.label}
                                </a>
                              ) : item.label === "Contact Us" ? (
                                <button
                                  onClick={() => {
                                    handleClick();
                                    setMenuOpen(false);
                                  }}
                                  className={`text-nowrap font-actayRegular text-center text-sm xl:text-base   px-7 py-3 rounded-2xl text-white relative z-10 cursor-pointer flex items-center gap-1 ${item.path && isActiveRoute(item.path)
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
                                  className={`text-nowrap font-actayRegular text-center text-sm xl:text-base px-7 py-3 rounded-2xl text-white relative z-10 cursor-pointer flex items-center gap-1 ${item.path && isActiveRoute(item.path)
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
                                  className="bg-[#181818F0] mt-2 text-xs sm:text-sm rounded-2xl shadow-lg border border-[#4b4a4a]"
                                >
                                  <div className="py-2 px-4 flex flex-col">
                                    <a
                                      href="https://app.triggerx.network/devhub"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={() => setMenuOpen(false)}
                                      className="font-actayRegular block px-4 py-2 text-white hover:bg-[#282828] rounded-[8px] text-sm"
                                    >
                                      Dev Hub
                                    </a>
                                    <a
                                      href="https://app.triggerx.network/"
                                      target="_blank"
                                      onClick={() => setMenuOpen(false)}
                                      className="font-actayRegular block px-4 py-2 text-white hover:bg-[#282828] rounded-[8px] text-sm"
                                    >
                                      Build
                                    </a>
                                    <a
                                      href="https://triggerx.gitbook.io/triggerx-docs/getting-started-as-keepers"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={() => setMenuOpen(false)}
                                      className="text-sm font-actayRegular block px-4 py-2 text-white hover:bg-[#282828] rounded-[8px]"
                                    >
                                      Join as Keeper
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className=" px-5 py-3">
                          <Link
                            href="https://app.triggerx.network/"
                            target="_blank"
                          >
                            <button className="relative bg-[#222222] text-[#000000] border border-[#222222] px-6 py-2 sm:px-8 sm:py-3 rounded-full group transition-transform w-full">
                              <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
                              <span className="absolute inset-0 bg-[#F8FF7C] rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
                              <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-2 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs sm:text-base">
                                Start Building
                              </span>
                            </button>
                          </Link>
                        </div>
                      </nav>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-[100%] px-20 flex sm:my-[100px]  md:my-[100px] lg:my-[100px] my-[100px]  items-center flex-col relative">
            <div className="w-full relative">
              <Image
                src={logo}
                alt="TriggerX Logo"
                className="w-full "
              />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Header;


