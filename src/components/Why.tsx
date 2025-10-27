"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Image from "next/image";
import why from "../app/assets/why svg and gifs/why.png";

const DRAG_BUFFER = 50;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring" as const, stiffness: 300, damping: 30 };

// Define interfaces
interface BoxData {
  title: string;
  description: string;
  imageSrc: string;
  mediaType: string;
}

interface WhyProps {
  Boxdata: BoxData[];
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
}

export default function Why({
  Boxdata,
  autoplay = true,
  autoplayDelay = 2000,
  pauseOnHover = true,
  loop = true,
  round = false,
}: WhyProps) {
  const [itemWidth, setItemWidth] = useState<number>(350);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoError, setVideoError] = useState<boolean>(false);

  // Create wrapped items array for infinite loop
  const wrappedItems = [...Boxdata, ...Boxdata, ...Boxdata];
  const totalItems = Boxdata.length;

  // Update screen width and item width on mount and resize with throttling
  useEffect(() => {
    let ticking = false;

    const updateDimensions = (): void => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const width: number = window.innerWidth;
          setIsMobile(width < 640);

          if (width < 640) {
            setItemWidth(width - 32);
          } else if (width < 1024) {
            setItemWidth(350);
          } else {
            setItemWidth(350);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions, { passive: true });
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!isMobile && autoplay && (!pauseOnHover || !isHovered) && !isDragging) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          const nextIndex = prev + 1;
          if (loop) {
            return nextIndex;
          } else {
            return nextIndex % Boxdata.length;
          }
        });
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [
    autoplay,
    autoplayDelay,
    isHovered,
    isDragging,
    Boxdata.length,
    pauseOnHover,
    loop,
    isMobile,
  ]);

  const handleDragStart = (): void => setIsDragging(true);
  const handleDragEnd = (_: unknown, info: PanInfo): void => {
    setIsDragging(false);
    const offset: number = info.offset.x;
    const velocity: number = info.velocity.x;

    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      setCurrentIndex((prev) => prev + 1);
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleAnimationComplete = (): void => {
    if (loop) {
      setCurrentIndex((prev) => (prev % totalItems) + totalItems);
    }
  };

  const renderMediaItem = (box: BoxData, mapIndex: number): React.JSX.Element => {
    if (!box || !box.imageSrc) {
      return (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xs text-gray-400">
          No media
        </div>
      );
    }

    // Determine if the current item in the map is the one centrally displayed in the carousel
    // For mobile list, this logic isn't directly applicable for priority in the same way.
    const effectiveCurrentOriginalIndex: number = loop
      ? currentIndex % totalItems
      : currentIndex;
    const itemOriginalIndex: number = mapIndex % totalItems;
    const isCurrentlyVisibleInCarousel: boolean =
      !isMobile && itemOriginalIndex === effectiveCurrentOriginalIndex;

    if (box.mediaType === "video") {
      const baseName = box.imageSrc.split("/").pop()?.replace(".webm", "") || "";
      const svgPath = `/assets/why svg and gifs/${baseName}.svg`;

      return (
        <div className="relative w-full h-full">
          {!videoError ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              preload="metadata"
              className="object-cover w-full h-full"
              poster={svgPath}
              onError={() => setVideoError(true)}
            >
              <source src={box.imageSrc} type="video/webm" />
              {/* Optionally add more <source> tags for other formats */}
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              src={svgPath}
              alt={box.title}
              fill
              className="object-cover"
              priority={false}
              loading="lazy"
              quality={75}
            />
          )}
        </div>
      );
    }

    return (
      <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xs text-gray-400">
        Unsupported type: {box.mediaType}
      </div>
    );
  };

  if (!Boxdata || Boxdata.length === 0) {
    return (
      <div className="w-full text-center py-10 text-gray-500">
        No data to display.
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden pl-4 md:pl-8 lg:pl-16  ">
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="w-full lg:w-1/3 2xl:w-[40%] flex flex-col items-center lg:items-start gap-6 2xl:items-center ">
          <h2 className="font-sharpGrotesk text-white text-4xl md:text-5xl 2xl:text-7xl text-center xl:w-[60%] text-wrap lg:text-start transform scale-y-[.8] ">
            Why TriggerX?
          </h2>
          <div className="hidden lg:block h-auto w-full max-w-[300px]">
            <Image src={why} alt="Why TriggerX" className="w-full h-auto" sizes="300px" />
          </div>
        </div>

        <div className="w-full lg:w-3/4 2xl:w-[60%] overflow-hidden relative">
          {isMobile ? (
            // Mobile view - vertical list
            <div className="flex flex-col gap-3 pr-4 ">
              {Boxdata.map((box: BoxData, index: number) => (
                <div key={`${box.title}-${index}`} className="w-full">
                  <div className="rounded-[20px] overflow-hidden bg-[#0F0F0F] border border-[#5F5F5F] p-4">
                    <div className="flex gap-3 items-center justify-center">
                      <div className="relative w-24 h-24 overflow-hidden rounded-[10px] flex-shrink-0">
                        {/* <Image
                          src={box.imageSrc}
                          alt={box.title}
                          className="object-cover"
                          fill
                        /> */}
                        {renderMediaItem(box, index)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-actayWide text-[15px] text-white font-bold mb-2">
                          {box.title}
                        </h3>
                        <p className="text-gray-300 text-xs font-actayRegular line-clamp-3">
                          {box.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Desktop/Tablet view - carousel
            <div
              ref={containerRef}
              className="w-full"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <motion.div
                className="flex"
                drag="x"
                dragElastic={0.1}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                animate={{ x: -(currentIndex * (itemWidth + GAP)) }}
                transition={SPRING_OPTIONS}
                onAnimationComplete={handleAnimationComplete}
              >
                <AnimatePresence>
                  {wrappedItems.map((box: BoxData, index: number) => (
                    <motion.div
                      key={`${box.title}-${index}`}
                      className="flex-shrink-0"
                      style={{ width: itemWidth, marginRight: GAP }}
                    >
                      <div className="h-full rounded-[20px] overflow-hidden bg-[#0F0F0F] border border-[#5F5F5F] p-4">
                        <div className="relative h-32 md:h-40 lg:h-48 overflow-hidden rounded-[14px]">
                          {/* <Image
                            src={box.imageSrc}
                            alt={box.title}
                            className="object-cover w-full h-full"
                            fill
                          /> */}
                          {renderMediaItem(box, index)}
                        </div>
                        <div className="space-y-4 p-4">
                          <h3 className="font-actayWide text-lg md:text-xl text-white font-bold">
                            {box.title}
                          </h3>
                          <p className="text-gray-300 text-sm md:text-base font-actayRegular">
                            {box.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
