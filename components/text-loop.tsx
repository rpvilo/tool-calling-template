"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { useLoop } from "./hooks/use-loop";

const items = [
  "Show the upcoming earnings dates for Microsoft",
  "Get analyst ratings for Nvidia",
  "How has Google's stock performed this month?",
  "What is the latest price for Amazon",
  "List companies reporting earnings tomorrow",
  "Show the EPS actuals for Apple last quarter",
  "Compare revenue estimates for Tesla and Ford",
  "Any major earnings announcements next week?",
];
const TextLoop = ({ className, ...props }: ComponentProps<"div">) => {
  const { currentItem, key } = useLoop(items);

  return (
    <div
      className={cn("pointer-events-none flex items-center justify-center", className)}
      {...props}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={key}
          initial={{ opacity: 0, y: "100%", filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: "-100%", filter: "blur(4px)" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="whitespace-nowrap text-gray-11/60 text-md"
        >
          {currentItem}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export { TextLoop };
