"use client";

import type { UIMessage } from "ai";
import { motion } from "motion/react";
import { type ComponentProps, memo } from "react";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";

export const Message = ({
  isLastMessage,
  messageId,
  role,
  className,
  ...props
}: ComponentProps<typeof motion.div> & {
  isLastMessage?: boolean;
  messageId: string;
  role: UIMessage["role"];
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      data-slot="message"
      data-role={role}
      data-message-id={messageId}
      className={cn(
        "group flex w-full gap-2 data-[role=assistant]:justify-start data-[role=user]:justify-end",

        className,
      )}
      {...props}
    />
  );
};

export const MessageContent = ({ children, className, ...props }: ComponentProps<"div">) => (
  <div
    data-slot="message-content"
    className={cn(
      "flex flex-col gap-2 overflow-hidden border",
      "group-data-[role=user]:max-w-[80%] group-data-[role=user]:rounded-[16px] group-data-[role=user]:border-gray-4 group-data-[role=user]:bg-gray-9 group-data-[role=user]:p-3 group-data-[role=user]:text-gray-12",
      "group-data-[role=assistant]:w-full group-data-[role=assistant]:border-transparent group-data-[role=assistant]:text-gray-12",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export const MessageText = memo(
  ({ className, ...props }: ComponentProps<typeof Streamdown>) => (
    <Streamdown
      className={cn("size-full *:text-md [&>*:first-child]:mt-0 [&>*:last-child]:mb-0", className)}
      components={{
        p: ({ children, ...props }) => (
          <p className={cn("whitespace-pre-wrap")} {...props}>
            {children}
          </p>
        ),
      }}
      {...props}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
