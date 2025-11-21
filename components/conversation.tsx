"use client";

import type { ChatStatus, UIMessage } from "ai";
import { ArrowDownIcon, ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ComponentProps } from "react";
import { useCallback } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { cn } from "@/lib/utils";
import { DotLoader } from "./ui/dot-loader";

export type ConversationProps = ComponentProps<typeof StickToBottom>;

export const Conversation = ({ className, ...props }: ConversationProps) => (
  <StickToBottom
    className={cn("relative h-dvh w-full bg-gray-1", className)}
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
    <div className="flex justify-end px-3 pb-3">
      <AnimatePresence>
        {!isAtBottom && (
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
        )}
      </AnimatePresence>
    </div>
  );
};

export const ConversationStatus = ({ status }: { status: ChatStatus }) => {
  // if (status === "submitted") {
  return (
    <div className="my-2 flex items-center gap-2">
      <DotLoader />
      <span className="font-medium text-gray-11 text-sm">Thinking...</span>
    </div>
  );
  // }
  // return null;
};

export const ConversationTimeline = ({
  messages,
  className,
  ...props
}: ComponentProps<"div"> & { messages: UIMessage[] }) => {
  const handleScrollToMessage = (messageId: string) => {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (messages.length < 4) return null;

  return (
    <div className="-translate-y-1/2 absolute top-1/2 right-3 z-10">
      <div className={cn("group/timeline flex flex-col items-end", className)} {...props}>
        <button
          type="button"
          className="flex size-7.5 translate-y-1 items-center justify-center rounded-full opacity-0 transition-all hover:border-gray-4 hover:bg-gray-4 group-hover/timeline:translate-y-0 group-hover/timeline:scale-100 group-hover/timeline:opacity-100 [&>svg]:stroke-gray-11 hover:[&>svg]:stroke-gray-12"
        >
          <ChevronUp className="size-3.5" />
        </button>
        <div className="flex flex-col">
          {messages
            .filter((message) => message.role !== "system")
            .map((message) => (
              <button
                className="group/bar flex h-3 w-10 items-center justify-end px-2 transition-all"
                key={message.id}
                onClick={() => handleScrollToMessage(message.id)}
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
                    },
                  )}
                />
              </button>
            ))}
        </div>
        <button
          type="button"
          className="flex size-7.5 translate-y-0 items-center justify-center rounded-full opacity-0 transition-all hover:bg-gray-4 group-hover/timeline:translate-y-1 group-hover/timeline:scale-100 group-hover/timeline:opacity-100 [&>svg]:stroke-gray-11 hover:[&>svg]:stroke-gray-12"
        >
          <ChevronDown className="size-3.5" />
        </button>
      </div>
    </div>
  );
};
