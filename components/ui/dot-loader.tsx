"use client";

import { type ComponentProps, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_FRAMES = [
  // Top-left to bottom-left
  [0, 1, 5, 6], // (0,0),(0,1),(1,0),(1,1)
  [5, 6, 10, 11], // (1,0),(1,1),(2,0),(2,1)
  [10, 11, 15, 16], // (2,0),(2,1),(3,0),(3,1)
  // Bottom-left to bottom-right
  [15, 16, 20, 21], // (3,0),(3,1),(4,0),(4,1)
  [16, 17, 21, 22], // (3,1),(3,2),(4,1),(4,2)
  [17, 18, 22, 23], // (3,2),(3,3),(4,2),(4,3)
  // Bottom-right to top-right
  [18, 19, 23, 24], // (3,3),(3,4),(4,3),(4,4)
  [13, 14, 18, 19], // (2,3),(2,4),(3,3),(3,4)
  [8, 9, 13, 14], // (1,3),(1,4),(2,3),(2,4)
  // Top-right to top-left
  [3, 4, 8, 9], // (0,3),(0,4),(1,3),(1,4)
  [2, 3, 7, 8], // (0,2),(0,3),(1,2),(1,3)
  [1, 2, 6, 7], // (0,1),(0,2),(1,1),(1,2)
];

type DotLoaderProps = {
  duration?: number;
  repeatCount?: number;
  onComplete?: () => void;
} & ComponentProps<"div">;

export const DotLoader = ({
  duration = 100,
  className,
  repeatCount = -1,
  onComplete,
  ...props
}: DotLoaderProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const repeats = useRef(0);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const frames = DEFAULT_FRAMES;

  const applyFrameToDots = useCallback(
    (dots: HTMLDivElement[], frameIndex: number) => {
      const frame = DEFAULT_FRAMES[frameIndex];
      if (!frame) return;

      dots.forEach((dot, index) => {
        dot.dataset.active = frame.includes(index) ? "true" : "false";
      });
    },
    [frames],
  );

  useEffect(() => {
    currentIndex.current = 0;
    repeats.current = 0;
  }, []);

  useEffect(() => {
    if (currentIndex.current >= frames.length) {
      currentIndex.current = 0;
    }
    const dotElements = gridRef.current?.children;
    if (!dotElements) return;
    const dots = Array.from(dotElements) as HTMLDivElement[];
    interval.current = setInterval(() => {
      applyFrameToDots(dots, currentIndex.current);
      if (currentIndex.current + 1 >= frames.length) {
        if (repeatCount !== -1 && repeats.current + 1 >= repeatCount) {
          if (interval.current) clearInterval(interval.current);
          onComplete?.();
        }
        repeats.current++;
      }
      currentIndex.current = (currentIndex.current + 1) % frames.length;
    }, duration);

    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [frames, applyFrameToDots, duration, repeatCount, onComplete]);

  return (
    <div {...props} ref={gridRef} className={cn("grid w-fit grid-cols-5 gap-0.5", className)}>
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          data-index={i}
          className={cn("h-0.5 w-0.5 rounded-sm bg-gray-5 data-[active=true]:bg-gray-11")}
        />
      ))}
    </div>
  );
};
