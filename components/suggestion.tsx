import { CornerDownRightIcon } from "lucide-react";
import { motion, stagger } from "motion/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

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
      className={cn("flex flex-1 flex-col items-start justify-center gap-4", className)}
      {...props}
    >
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0 },
        }}
        className="font-medium text-2xl text-gray-11"
      >
        Hi, I'm Wall Street AI. <br /> I'm here to help you with your investing questions. <br />{" "}
      </motion.h2>
      {SUGGESTIONS.map((suggestion) => (
        <motion.button
          key={suggestion}
          onClick={() => onSuggestionClick(suggestion)}
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0 },
          }}
          className="flex h-10 items-center gap-2 rounded-md px-3 transition-colors hover:bg-gray-4"
        >
          <CornerDownRightIcon className="size-4 text-gray-11" />
          <span className="text-gray-12 text-md">{suggestion}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default Suggestions;
