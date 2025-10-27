"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface AnimatedButtonProps {
    href?: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "white_outline" | "yellow_outline";
    size?: "sm" | "md" | "lg";
    flairColor?: "white" | "black" | string;
    ref?: React.RefObject<HTMLAnchorElement | HTMLButtonElement>;
}

export default function AnimatedButton({
    href,
    children,
    className = "",
    onClick,
    variant = "primary",
    size = "md",
    flairColor = "white",
    ref,
}: AnimatedButtonProps) {
    const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

    useEffect(() => {
        if (!buttonRef.current) return;

        const buttonElement = buttonRef.current;

        // Create the flair element
        const flairElement = document.createElement("div");
        flairElement.className = "button__flair";
        flairElement.style.position = "absolute";
        flairElement.style.bottom = "0";
        flairElement.style.left = "0";
        flairElement.style.right = "0";
        flairElement.style.top = "0";
        flairElement.style.pointerEvents = "none";
        flairElement.style.transform = "scale(0)";
        flairElement.style.transformOrigin = "0 0";
        flairElement.style.willChange = "transform";
        flairElement.style.zIndex = "1";

        // Create the circular background element
        const flairCircle = document.createElement("div");
        flairCircle.style.aspectRatio = "1/1";
        flairCircle.style.backgroundColor = flairColor === "white" ? "#ffffff" : flairColor === "#fff837" ? "#fff837" : "#000000";
        flairCircle.style.borderRadius = "50%";
        flairCircle.style.content = "";
        flairCircle.style.display = "block";
        flairCircle.style.left = "0";
        flairCircle.style.pointerEvents = "none";
        flairCircle.style.position = "absolute";
        flairCircle.style.top = "0";
        flairCircle.style.transform = "translate(-50%, -50%)";
        flairCircle.style.width = "170%";

        flairElement.appendChild(flairCircle);
        buttonElement.appendChild(flairElement);

        // Make button relative for absolute positioning
        buttonElement.style.position = "relative";
        buttonElement.style.overflow = "hidden";

        // Make text appear above the flair
        const buttonText = buttonElement.querySelector("span");
        if (buttonText) {
            buttonText.style.position = "relative";
            buttonText.style.zIndex = "2";
            buttonText.style.transition =
                "color 0.15s cubic-bezier(0.76, 0, 0.24, 1)";
        }

        // Also target the Button component specifically
        const buttonComponent = buttonElement.querySelector(
            "[class*='text-']"
        ) as HTMLElement;
        if (buttonComponent) {
            buttonComponent.style.transition =
                "color 0.15s cubic-bezier(0.76, 0, 0.24, 1)";
        }

        // GSAP quick setters for performance
        const xSet = gsap.quickSetter(flairElement, "xPercent");
        const ySet = gsap.quickSetter(flairElement, "yPercent");

        // Helper function to get XY coordinates
        const getXY = (e: MouseEvent) => {
            const { left, top, width, height } =
                buttonElement.getBoundingClientRect();

            const xTransformer = gsap.utils.pipe(
                gsap.utils.mapRange(0, width, 0, 100),
                gsap.utils.clamp(0, 100)
            );

            const yTransformer = gsap.utils.pipe(
                gsap.utils.mapRange(0, height, 0, 100),
                gsap.utils.clamp(0, 100)
            );

            return {
                x: xTransformer(e.clientX - left),
                y: yTransformer(e.clientY - top),
            };
        };

        buttonElement.addEventListener("mouseenter", (e: Event) => {
            const { x, y } = getXY(e as MouseEvent);

            xSet(x);
            ySet(y);

            gsap.to(flairElement, {
                scale: 1,
                duration: 0.4,
                ease: "power2.out",
            });

            gsap.to(buttonElement, {
                color: flairColor === "white" ? "#000000" : flairColor === "#fff837" ? "black" : flairColor,
                duration: 0.05,
                ease: "power2.out",
            });

            // Also animate the Button component text color
            if (buttonComponent) {
                gsap.to(buttonComponent, {
                    color: flairColor === "white" ? "#000000" : flairColor === "#fff837" ? "black" : flairColor,
                    duration: 0.05,
                    ease: "power2.out",
                });
            }
        });

        // Mouse leave event
        buttonElement.addEventListener("mouseleave", (e: Event) => {
            const { x, y } = getXY(e as MouseEvent);

            gsap.killTweensOf(flairElement);

            gsap.to(flairElement, {
                xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
                yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
                scale: 0,
                duration: 0.3,
                ease: "power2.out",
            });

            gsap.to(buttonElement, {
                color: flairColor === "white" ? "#ffffff" : flairColor === "#fff837" ? "#fff837" : flairColor,
                duration: 0.15,
                ease: "power2.out",
            });

            // Also reset the Button component text color
            if (buttonComponent) {
                gsap.to(buttonComponent, {
                    color: flairColor === "white" ? "#ffffff" : flairColor === "#fff837" ? "#fff837" : flairColor,
                    duration: 0.15,
                    ease: "power2.out",
                });
            }
        });

        // Mouse move event
        buttonElement.addEventListener("mousemove", (e: Event) => {
            const { x, y } = getXY(e as MouseEvent);

            gsap.to(flairElement, {
                xPercent: x,
                yPercent: y,
                duration: 0.4,
                ease: "power2",
            });
        });

        // Mouse move event for smooth tracking
        buttonElement.addEventListener("mousemove", (e: Event) => {
            const { x, y } = getXY(e as MouseEvent);

            gsap.to(flairElement, {
                xPercent: x,
                yPercent: y,
                duration: 0.4,
                ease: "power2",
            });
        });

        // Cleanup function
        return () => {
            if (buttonElement) {
                buttonElement.removeEventListener("mouseenter", () => { });
                buttonElement.removeEventListener("mouseleave", () => { });
                buttonElement.removeEventListener("mousemove", () => { });
            }
        };
    }, [flairColor]);

    // Base styles for different variants
    const getVariantStyles = () => {
        switch (variant) {
        case "primary":
            return "bg-[#fff282] text-black border-[#fff282]";
        case "secondary":
            return "bg-white text-black border-white";
        case "white_outline":
            return "bg-transparent text-white border-[#ffffff]";
        case "yellow_outline":
            return "bg-transparent text-[#fff837] border-[#fff837]";
        default:
            return "bg-[#fff282] text-black border-[#fff282]";
        }
    };

    // Base styles for different sizes
    const getSizeStyles = () => {
        switch (size) {
        case "sm":
            return "px-5 py-2.5 text-base";
        case "md":
            return "px-6 py-3 text-lg";
        case "lg":
            return "px-10 py-5 text-xl";
        default:
            return "px-8 py-4 text-lg";
        }
    };

    const baseStyles =
        "w-50 inline-flex items-center justify-center gap-1 rounded-full border border-[#fff282] bg-transparent transition-all duration-300 ease-out";
    const combinedStyles = `bg-transparent ${baseStyles} ${getVariantStyles()} ${getSizeStyles()} ${className}`;

    if (href) {
        const isHashLink = typeof href === "string" && href.startsWith("#");
        const isExternalLink =
            (typeof href === "string" && /^(https?:)?\/\//.test(href)) ||
            (typeof href === "string" && href.startsWith("mailto:"));

        return (
            <Link
                ref={buttonRef as React.RefObject<HTMLAnchorElement>}
                href={href}
                target={isExternalLink ? "_blank" : undefined}
                rel={isExternalLink ? "noopener noreferrer" : undefined}
                onClick={(e) => {
                    if (isHashLink && typeof href === "string") {
                        e.preventDefault();
                        const targetElement = document.querySelector(href);
                        if (targetElement) {
                            // Use requestAnimationFrame to avoid forced reflow
                            requestAnimationFrame(() => {
                                const elementPosition =
                                    (targetElement as HTMLElement).offsetTop - 50;
                                window.scrollTo({
                                    top: elementPosition,
                                    behavior: "smooth",
                                });
                            });
                        }
                    }
                    if (onClick) onClick();
                }}
                className={combinedStyles}
            >
                <span>{children}</span>
            </Link>
        );
    }

    return (
        <button
            ref={buttonRef as React.RefObject<HTMLButtonElement>}
            onClick={onClick}
            className={combinedStyles}
        >
            <span>{children}</span>
        </button>
    );
}