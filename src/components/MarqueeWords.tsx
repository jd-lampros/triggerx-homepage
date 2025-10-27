import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

interface MarqueeWordsProps {
    words: string[];
    className?: string;
    speed?: number;
}

const MarqueeWords = ({ words, className = "", speed = 1 }: MarqueeWordsProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const railRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    useLayoutEffect(() => {
        if (!containerRef.current || !railRef.current) return;

        const wordLines = gsap.utils.toArray(railRef.current.children) as Element[];

        // Set initial positions (below viewport with opacity 0)
        gsap.set(wordLines, {
            y: 100,
            opacity: 0
        });

        // Start marquee animations immediately
        startMarqueeAnimations(wordLines);

        // Create reveal animation timeline
        const revealTl = gsap.timeline();

        // Animate lines from bottom to top with stagger
        revealTl.to(wordLines, {
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: "power2.out",
            stagger: 0.2, // 0.2s delay between each line
        });

        return () => {
            revealTl.kill();
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
        };
    }, [words, speed]);

    const startMarqueeAnimations = (wordLines: Element[]) => {
        // Create horizontal marquee animation for each line
        railRef.current?.classList.add('opacity-100');
        wordLines.forEach((line, index) => {
            const lineContent = line.querySelector('div');
            if (lineContent) {
                // Duplicate the content for seamless loop
                const originalContent = lineContent.innerHTML;
                lineContent.innerHTML = originalContent + originalContent + originalContent;

                const tl = gsap.timeline({ repeat: -1 });

                // Get the width of one set of content
                const singleSetWidth = lineContent.scrollWidth / 3;

                // Alternate direction for each line
                const isEvenIndex = index % 2 === 0;

                if (isEvenIndex) {
                    // Even lines (0, 2, 4...) move right to left
                    tl.fromTo(lineContent,
                        { x: 0 },
                        {
                            x: -singleSetWidth,
                            duration: singleSetWidth / (speed * 50),
                            ease: "none"
                        }
                    );
                } else {
                    // Odd lines (1, 3, 5...) move left to right
                    tl.fromTo(lineContent,
                        { x: -singleSetWidth },
                        {
                            x: 0,
                            duration: singleSetWidth / (speed * 50),
                            ease: "none"
                        }
                    );
                }

                timelineRef.current = tl;
            }
        });
    };

    return (
        <div ref={containerRef} className={`w-full ${className}`}>
            <div ref={railRef} className="flex flex-col items-center opacity-0">
                {/* Render each word on its own line with repetitions */}
                {words.map((word: string, index: number) => (
                    <div key={index} className="w-full overflow-hidden">
                        <div className="flex items-center whitespace-nowrap">
                            {/* Render word multiple times with hyphens */}
                            {[1, 2, 3, 4, 5].map((repeat) => (
                                <div key={repeat} className="flex items-center my-2">
                                    <span className="text-white font-sharpGrotesk text-[7vh] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl leading-[100%] tracking-[-0.06em] whitespace-nowrap">
                                        {word}
                                    </span>
                                    <span className="text-white font-sharpGrotesk text-[7vh] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl leading-[100%] tracking-[-0.06em] mx-4">
                                        -
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default MarqueeWords;
