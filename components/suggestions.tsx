import { CornerDownRightIcon } from "lucide-react";
import { motion, stagger } from "motion/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { GlassFrame } from "./glass-frame";

const SUGGESTIONS = [
  "Show me Tesla's company profile",
  "Show me Apple's price history for the past year",
  "How did Nvidia's last quarter earnings compare to estimates?",
  "What do analysts think about Amazon?",
];

type SuggestionsProps = ComponentProps<typeof motion.div> & {
  onSuggestionClick: (suggestion: string) => void;
};

const Suggestions = ({ onSuggestionClick, className, ...props }: SuggestionsProps) => {
  return (
    <motion.div
      variants={{
        hidden: {},
        visible: {
          transition: { delayChildren: stagger(0.1, { from: "first", startDelay: 0.5 }) },
        },
      }}
      initial="hidden"
      animate="visible"
      className={cn("flex flex-1 flex-col items-center justify-center gap-4", className)}
      {...props}
    >
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0 },
        }}
        className="font-[550] text-3xl text-gray-12"
      >
        Hi, I'm Wall Street AI.
      </motion.h2>
      <GlassFrame>
        <div className="relative flex h-full w-full shrink-0 flex-col gap-1 overflow-hidden rounded-[12px] border border-gray-4 bg-gray-2 p-1">
          {SUGGESTIONS.map((suggestion) => (
            <motion.button
              key={suggestion}
              onClick={() => onSuggestionClick(suggestion)}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex h-10 items-center gap-2 rounded-lg px-3 transition-colors hover:bg-gray-10"
            >
              <CornerDownRightIcon className="size-4 text-gray-11" />
              <span className="text-gray-12 text-md">{suggestion}</span>
            </motion.button>
          ))}
        </div>
      </GlassFrame>
    </motion.div>
  );
};

export default Suggestions;
