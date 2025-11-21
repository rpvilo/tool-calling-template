"use client";

import { ArrowDownIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useStickToBottomContext } from "use-stick-to-bottom";
import { ProgressiveBlur } from "./progressive-blur";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "./ui/input-group";

const PromptInput = ({ onSubmit }: { onSubmit: (prompt: string) => void }) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim()) {
        onSubmit(prompt);
        setPrompt("");
      }
    }
  };

  const handleScrollToBottom = () => {
    scrollToBottom();
  };

  return (
    <div className="fixed right-0 bottom-0 left-0 mx-auto w-full max-w-(--conversation-width) pb-6">
      <ProgressiveBlur
        direction="bottom"
        blurIntensity={0.25}
        className="absolute right-0 bottom-0 left-0 h-[128px]"
      />
      <div className="flex justify-end px-3 pb-3">
        <AnimatePresence>
          {!isAtBottom && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="borde flex size-8 items-center justify-center rounded-full border border-gray-4 bg-gray-9 text-gray-12 shadow-sm hover:bg-gray-10"
              onClick={handleScrollToBottom}
            >
              <ArrowDownIcon className="size-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <div className="relative">
        <div className="absolute inset-0 size-full rounded-[16px] border border-gray-3 bg-gray-2/50 brightness-95 backdrop-blur-xs dark:brightness-85" />
        <form onSubmit={handleSubmit} className="p-1">
          <InputGroup className="border border-gray-6 opacity-95 backdrop-blur-sm">
            <InputGroupTextarea
              value={prompt}
              placeholder="Say something..."
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="primary">Send</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    </div>
  );
};

export default PromptInput;
