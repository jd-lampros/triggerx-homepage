import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Define interfaces for the component
interface VelocityState {
  current: number;
  target: number;
  lastDirection: number;
}

interface HorizontalLoopConfig {
  repeat?: number;
  paused?: boolean;
  speed?: number;
  paddingRight?: number;
  paddingLeft?: number;
  snap?: boolean | number;
  reversed?: boolean;
}

interface MarqueePillsProps {
  pills: React.ReactNode[];
  className?: string;
}

const MarqueePills = ({ pills, className = "" }: MarqueePillsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const velocityRef = useRef<VelocityState>({ current: 0, target: 0, lastDirection: 1 });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || !railRef.current) return;

    const pillsElements = gsap.utils.toArray(railRef.current.children) as Element[];

    // Create horizontal loop timeline
    const tl = horizontalLoop(pillsElements, {
      repeat: -1,
      speed: 0.8, // Reduced speed for better viewing comfort
      paddingRight: 32,
      paddingLeft: 32,
    });

    timelineRef.current = tl;

    // Velocity-based animation system
    const updateVelocity = () => {
      const velocity = velocityRef.current;
      const targetVelocity = velocity.target;
      const currentVelocity = velocity.current;

      // Smooth interpolation towards target velocity
      const newVelocity =
        currentVelocity + (targetVelocity - currentVelocity) * 0.1;
      velocity.current = newVelocity;

      // Apply velocity to timeline
      if (tl) {
        tl.timeScale(Math.abs(newVelocity));
        if (newVelocity < 0) {
          tl.reverse();
        } else if (newVelocity > 0 && tl.reversed()) {
          tl.play();
        }
      }

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(updateVelocity);
    };

    // Start velocity animation loop
    updateVelocity();

    // Create scroll trigger for velocity changes
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const velocity = velocityRef.current;
        const direction = self.direction;
        const progress = self.progress;

        // Calculate target velocity based on scroll direction and progress
        let targetVelocity = 1.0; // Reduced base speed

        // Increase speed based on scroll progress
        targetVelocity += progress * 1.5;

        // Apply direction
        targetVelocity *= direction;

        // If direction changed, add braking effect
        if (direction !== velocity.lastDirection) {
          // Braking effect - reduce velocity when direction changes
          targetVelocity *= 0.3;

          // Gradually increase back to normal speed
          gsap.to(velocityRef.current, {
            target: direction * (1.0 + progress * 2),
            duration: 1.2,
            ease: "power2.out",
          });
        } else {
          // Normal acceleration
          velocity.target = targetVelocity;
        }

        velocity.lastDirection = direction;
      },
    });

    return () => {
      scrollTrigger.kill();
      tl.kill();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [pills]);

  return (
    <div ref={containerRef} className={`overflow-hidden w-full ${className}`}>
      <div ref={railRef} className="flex items-center">
        {/* Render pills twice for seamless loop */}
        {pills.map((pill: React.ReactNode, index: number) => (
          <div key={`first-${index}`} className="flex-shrink-0 mx-4">
            {pill}
          </div>
        ))}
        {pills.map((pill: React.ReactNode, index: number) => (
          <div key={`second-${index}`} className="flex-shrink-0 mx-4">
            {pill}
          </div>
        ))}
      </div>
    </div>
  );
};

// Horizontal loop function (adapted from your provided code)
function horizontalLoop(items: Element[], config?: HorizontalLoopConfig): gsap.core.Timeline {
  items = gsap.utils.toArray(items);
  config = config || {};
  const tl = gsap.timeline({
    repeat: config.repeat,
    paused: config.paused,
    defaults: { ease: "none" },
    onReverseComplete: () => {
      tl.totalTime(tl.rawTime() + tl.duration() * 100);
    },
  });

  const length: number = items.length;
  const startX: number = (items[0] as HTMLElement).offsetLeft;
  const times: number[] = [];
  const widths: number[] = [];
  const xPercents: number[] = [];
  let curIndex: number = 0;
  const pixelsPerSecond: number = (config.speed || 1) * 100;
  const snap: (value: number) => number = config.snap === false ? (v: number) => v : gsap.utils.snap(typeof config.snap === 'number' ? config.snap : 1);
  let curX: number;
  let distanceToStart: number;
  let distanceToLoop: number;
  let item: Element;
  let i: number;

  gsap.set(items, {
    xPercent: (i: number, el: Element) => {
      const w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px") as string));
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, "x", "px") as string) / w) * 100 +
        (gsap.getProperty(el, "xPercent") as number)
      );
      return xPercents[i];
    },
  });

  gsap.set(items, { x: 0 });
  const totalWidth: number =
    (items[length - 1] as HTMLElement).offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    (items[length - 1] as HTMLElement).offsetWidth *
    (gsap.getProperty(items[length - 1], "scaleX") as number) +
    (parseFloat(config.paddingRight?.toString() || "0"));

  for (i = 0; i < length; i++) {
    item = items[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = (item as HTMLElement).offsetLeft + curX - startX;
    distanceToLoop =
      distanceToStart + widths[i] * (gsap.getProperty(item, "scaleX") as number);
    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
          ),
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      )
      .add("label" + i, distanceToStart / pixelsPerSecond);
    times[i] = distanceToStart / pixelsPerSecond;
  }

  function toIndex(index: number, vars?: gsap.TweenVars): gsap.core.Tween {
    vars = vars || {};
    if (Math.abs(index - curIndex) > length / 2) {
      index += index > curIndex ? -length : length;
    }
    const newIndex: number = gsap.utils.wrap(0, length, index);
    let time: number = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }

  tl.next = (vars?: gsap.TweenVars) => toIndex(curIndex + 1, vars);
  tl.previous = (vars?: gsap.TweenVars) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index: number, vars?: gsap.TweenVars) => toIndex(index, vars);
  tl.times = times;
  tl.progress(1, true).progress(0, true);

  if (config.reversed) {
    tl.vars.onReverseComplete?.();
    tl.reverse();
  }

  return tl;
}

export default MarqueePills;
