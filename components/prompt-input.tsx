"use client";

import { ArrowDownIcon, SendIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useStickToBottomContext } from "use-stick-to-bottom";
import { cn } from "@/lib/utils";
import { TextLoop } from "./text-loop";
import { IconButton } from "./ui/icon-button";
import { InputGroup, InputGroupAddon, InputGroupTextarea } from "./ui/input-group";

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
              className="borde flex size-9 items-center justify-center rounded-full border border-gray-4 bg-gray-9 shadow-sm hover:bg-gray-10 [&>svg]:stroke-gray-11 hover:[&>svg]:stroke-gray-12"
              onClick={handleScrollToBottom}
            >
              <ArrowDownIcon className="size-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <div className="relative p-1">
        <div className="absolute inset-0 size-full rounded-2xl border border-gray-3 bg-gray-2/50 brightness-97 backdrop-blur-xs dark:brightness-85" />
        <form onSubmit={handleSubmit}>
          <div>
            <InputGroup className="border border-gray-6 opacity-95 backdrop-blur-sm">
              <InputGroupTextarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <TextLoop className={cn("absolute left-3 h-9", prompt.length > 0 && "opacity-0")} />
              <InputGroupAddon align="inline-end">
                <IconButton size="md">
                  <SendIcon />
                </IconButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </form>
      </div>
    </>
  );
};

export default PromptInput;
