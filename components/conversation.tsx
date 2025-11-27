"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { UIMessage } from "ai";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";
import type { ComponentProps } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { cn } from "@/lib/utils";
import { useMessageScroll } from "./hooks/use-message-scroll";
import { DotLoader } from "./ui/dot-loader";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export type ConversationProps = ComponentProps<typeof StickToBottom>;

export const Conversation = ({ className, ...props }: ConversationProps) => (
  <StickToBottom
    className={cn("h-full w-full overflow-hidden", className)}
    initial="smooth"
    resize="smooth"
    role="log"
    {...props}
  />
);

export type ConversationContentProps = ComponentProps<typeof StickToBottom.Content>;

export const ConversationContent = ({ className, ...props }: ConversationContentProps) => (
  <StickToBottom.Content
    className={cn(
      "mx-auto flex min-h-dvh w-full max-w-(--conversation-width) flex-col gap-8 px-4 pt-20 pb-40",
      className,
    )}
    {...props}
  />
);

export const ConversationEmptyState = ({
  className,
  children,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div className={cn("flex flex-1 items-center justify-center", className)} {...props}>
      {children}
    </div>
  );
};

export const ConversationStatus = ({ status }: { status?: string }) => {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(4px)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="my-2 flex items-center gap-2"
    >
      <DotLoader aria-hidden="true" />
      <span className="font-medium text-gray-11 text-sm capitalize">
        {status ?? "Processing..."}
      </span>
    </motion.div>
  );
};

export type ConversationTimelineProps = ComponentProps<typeof motion.div> & {
  messages?: UIMessage[];
};

export const ConversationTimeline = ({
  className,
  messages = [],
  ...props
}: ConversationTimelineProps) => {
  const { scrollRef } = useStickToBottomContext();
  const {
    scrollToMessage,
    scrollUp,
    scrollDown,
    timelineMessages,
    currentMessageId,
    canScrollUp,
    canScrollDown,
  } = useMessageScroll(scrollRef, messages);

  if (messages.length < 4) return null;

  return (
    <TooltipProvider>
      <motion.nav
        aria-label="Message timeline"
        className="-translate-y-1/2 absolute top-1/2 right-3 z-10"
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <motion.div className={cn("group/timeline flex flex-col items-end", className)} {...props}>
          <button
            type="button"
            aria-label="Scroll to previous message"
            onClick={scrollUp}
            disabled={!canScrollUp}
            className={cn(
              "flex size-7.5 translate-y-1 items-center justify-center rounded-full opacity-0 transition-all group-hover/timeline:translate-y-0 group-hover/timeline:scale-100 group-hover/timeline:opacity-100 [&>svg]:stroke-gray-11",
              canScrollUp && "hover:border-gray-4 hover:bg-gray-4 hover:[&>svg]:stroke-gray-12",
              !canScrollUp && "cursor-not-allowed [&>svg]:stroke-gray-6",
            )}
          >
            <ChevronUp className="size-3.5" />
          </button>
          <div className="flex flex-col">
            {timelineMessages.map((message, index) => (
              <Tooltip key={message.id}>
                <TooltipTrigger asChild>
                  <button
                    className="group/bar flex h-3 w-10 items-center justify-end px-2 transition-all"
                    onClick={() => scrollToMessage(message.id)}
                    type="button"
                    aria-label={`Jump to ${message.role === "user" ? "your" : "assistant"} message ${index + 1}`}
                  >
                    <div
                      aria-hidden="true"
                      className={cn(
                        "h-px rounded-full bg-gray-7 transition-[width,background-color]",
                        "group-hover/bar:w-4 group-hover/bar:bg-gray-11",
                        {
                          "w-3": message.role === "assistant",
                          "w-2": message.role === "user",
                          "w-4 bg-gray-11": message.id === currentMessageId,
                        },
                      )}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="left"
                  align="center"
                  sideOffset={10}
                  className="max-w-48 overflow-hidden truncate text-balance"
                >
                  <span className="whitespace-pre-wrap">{message.label}</span>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          <button
            type="button"
            aria-label="Scroll to next message"
            onClick={scrollDown}
            disabled={!canScrollDown}
            className={cn(
              "flex size-7.5 translate-y-0 items-center justify-center rounded-full opacity-0 transition-all group-hover/timeline:translate-y-1 group-hover/timeline:scale-100 group-hover/timeline:opacity-100 [&>svg]:stroke-gray-11",
              canScrollDown && "hover:bg-gray-4 hover:[&>svg]:stroke-gray-12",
              !canScrollDown && "cursor-not-allowed [&>svg]:stroke-gray-6",
            )}
          >
            <ChevronDown className="size-3.5" />
          </button>
        </motion.div>
      </motion.nav>
    </TooltipProvider>
  );
};
