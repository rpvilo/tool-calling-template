"use client";

import { ArrowDownIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useStickToBottomContext } from "use-stick-to-bottom";
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
    <>
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
      <div className="relative p-1">
        <div className="absolute inset-0 size-full rounded-[30px] border border-gray-3 bg-gray-2/50 p-1 brightness-95 backdrop-blur-xs dark:brightness-85" />
        <form onSubmit={handleSubmit}>
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
    </>
  );
};

export default PromptInput;
