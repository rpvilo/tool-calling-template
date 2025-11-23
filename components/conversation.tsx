"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { ChatStatus } from "ai";
import { ArrowDownIcon, ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ComponentProps } from "react";
import { useCallback } from "react";
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
      "mx-auto flex w-full max-w-(--conversation-width) flex-col gap-8 px-4 pt-20 pb-40",
      className,
    )}
    {...props}
  />
);

// export type ConversationEmptyStateProps = ComponentProps<"div"> & {
//   title?: string;
//   description?: string;
//   icon?: React.ReactNode;
// };

// export const ConversationEmptyState = ({
//   className,
//   title = "No messages yet",
//   description = "Start a conversation to see messages here",
//   icon,
//   children,
//   ...props
// }: ConversationEmptyStateProps) => (
//   <div
//     className={cn(
//       "flex size-full flex-col items-center justify-center gap-3 p-8 text-center",
//       className,
//     )}
//     {...props}
//   >
//     {children ?? (
//       <>
//         {icon && <div className="text-muted-foreground">{icon}</div>}
//         <div className="space-y-1">
//           <h3 className="font-medium text-sm">{title}</h3>
//           {description && <p className="text-muted-foreground text-sm">{description}</p>}
//         </div>
//       </>
//     )}
//   </div>
// );

export const ConversationScrollButton = ({
  className,
  ...props
}: ComponentProps<typeof motion.button>) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  return (
    <AnimatePresence>
      {!isAtBottom && (
        <div className="flex justify-end px-3 pb-3">
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "borde flex size-8 items-center justify-center rounded-full border border-gray-4 bg-gray-9 text-gray-12 shadow-sm hover:bg-gray-10",
              className,
            )}
            onClick={handleScrollToBottom}
            {...props}
          >
            <ArrowDownIcon className="size-4" />
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
};

export const ConversationStatus = ({ status }: { status: ChatStatus }) => {
  if (status === "submitted") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="my-2 flex items-center gap-2"
        >
          <DotLoader />
          <span className="font-medium text-gray-11 text-sm capitalize">{status}...</span>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
};

export const ConversationTimeline = ({
  className,
  ...props
}: ComponentProps<typeof motion.div>) => {
  const { scrollRef } = useStickToBottomContext();
  const { scrollToMessage, scrollUp, scrollDown, messages, lastScrolledMessageId } =
    useMessageScroll(scrollRef);

  if (messages.length < 4) return null;

  return (
    <TooltipProvider>
      <div className="-translate-y-1/2 absolute top-1/2 right-3 z-10">
        <motion.div className={cn("group/timeline flex flex-col items-end", className)} {...props}>
          <button
            type="button"
            onClick={scrollUp}
            className="flex size-7.5 translate-y-1 items-center justify-center rounded-full opacity-0 transition-all hover:border-gray-4 hover:bg-gray-4 group-hover/timeline:translate-y-0 group-hover/timeline:scale-100 group-hover/timeline:opacity-100 [&>svg]:stroke-gray-11 hover:[&>svg]:stroke-gray-12"
          >
            <ChevronUp className="size-3.5" />
          </button>
          <div className="flex flex-col">
            {messages
              .filter((message) => message.role !== "system")
              .map((message) => (
                <Tooltip key={message.id}>
                  <TooltipTrigger asChild>
                    <button
                      className="group/bar flex h-3 w-10 items-center justify-end px-2 transition-all"
                      key={message.id}
                      onClick={() => scrollToMessage(message.id)}
                      type="button"
                    >
                      <div
                        key={message.id}
                        className={cn(
                          "h-px rounded-full bg-gray-7 transition-[width,background-color]",
                          "group-hover/bar:w-4 group-hover/bar:bg-gray-11",
                          {
                            "w-3": message.role === "assistant",
                            "w-2": message.role === "user",
                            "w-4 bg-gray-12": message.id === lastScrolledMessageId,
                          },
                        )}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="left"
                    align="center"
                    sideOffset={10}
                    className="max-w-60 overflow-hidden truncate text-pretty"
                  >
                    <span className="whitespace-pre-wrap">{message.content}</span>
                  </TooltipContent>
                </Tooltip>
              ))}
          </div>
          <button
            type="button"
            onClick={scrollDown}
            className="flex size-7.5 translate-y-0 items-center justify-center rounded-full opacity-0 transition-all hover:bg-gray-4 group-hover/timeline:translate-y-1 group-hover/timeline:scale-100 group-hover/timeline:opacity-100 [&>svg]:stroke-gray-11 hover:[&>svg]:stroke-gray-12"
          >
            <ChevronDown className="size-3.5" />
          </button>
        </motion.div>
      </div>
    </TooltipProvider>
  );
};
