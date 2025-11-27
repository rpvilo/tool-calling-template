"use client";

import type { ChatStatus } from "ai";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useStickToBottomContext } from "use-stick-to-bottom";
import { cn } from "@/lib/utils";
import { GlassFrame } from "./glass-frame";
import ArrowDownIcon from "./icons/arrow-down-icon";
import { SendIcon } from "./icons/send-icon";
import StopIcon from "./icons/stop-icon";
import { ProgressiveBlur } from "./progressive-blur";
import { TextLoop } from "./text-loop";
import { IconButton } from "./ui/icon-button";
import { InputGroup, InputGroupAddon, InputGroupTextarea } from "./ui/input-group";

const PromptInput = ({
  status,
  onStop,
  onSubmit,
}: {
  status: ChatStatus;
  onStop: () => void;
  onSubmit: (prompt: string) => void;
}) => {
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
    <div
      data-slot="prompt-input"
      className="fixed right-0 bottom-0 left-0 mx-auto w-full max-w-(--conversation-width) bg-linear-to-t from-gray-1 to-transparent pb-8"
    >
      <ProgressiveBlur
        direction="bottom"
        className="pointer-events-none absolute right-0 bottom-0 left-0 h-[128px]"
      />
      <div className="flex justify-end px-3 pb-3">
        <AnimatePresence>
          {!isAtBottom && (
            <motion.button
              type="button"
              aria-label="Scroll to bottom"
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="borde flex size-9 items-center justify-center rounded-full border border-gray-4 bg-gray-9 shadow-md hover:bg-gray-10 [&>svg]:fill-gray-11 hover:[&>svg]:fill-gray-12"
              onClick={handleScrollToBottom}
            >
              <ArrowDownIcon className="size-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <GlassFrame
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
      >
        <form onSubmit={handleSubmit}>
          <InputGroup className="border border-gray-4 opacity-95 backdrop-blur-sm">
            <TextLoop className={cn("absolute left-3 h-9", prompt.length > 0 && "opacity-0")} />
            <InputGroupTextarea
              autoFocus
              aria-label="Message input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <InputGroupAddon align="inline-end">
              {status === "streaming" || status === "submitted" ? (
                <IconButton size="md" variant="ghost" aria-label="Stop generating" onClick={onStop}>
                  <StopIcon />
                </IconButton>
              ) : (
                <IconButton size="md" variant="ghost" aria-label="Generate response" type="submit">
                  <SendIcon />
                </IconButton>
              )}
            </InputGroupAddon>
          </InputGroup>
        </form>
      </GlassFrame>
    </div>
  );
};

export default PromptInput;
