"use client";

import type { UIMessage } from "ai";
import { useCallback, useEffect, useMemo, useState } from "react";

const MAX_LABEL_LENGTH = 60;
const HEADER_HEIGHT = 64; // h-16 in tailwind

const truncateText = (text: string, maxLength: number = MAX_LABEL_LENGTH): string => {
  const oneLiner = text.replace(/\n+/g, " ").trim();
  if (oneLiner.length <= maxLength) return oneLiner;
  return `${oneLiner.slice(0, maxLength)}...`;
};

const getToolCallInfo = (
  parts: UIMessage["parts"],
): { toolName: string; symbol?: string } | null => {
  const toolPart = parts.find((part) => part.type.startsWith("tool-"));
  if (!toolPart) return null;

  const toolName = toolPart.type.replace("tool-", "");
  const input = "input" in toolPart ? (toolPart.input as Record<string, unknown>) : null;
  const symbol = input?.symbol as string | undefined;
  return { toolName, symbol };
};

const getTextContent = (parts: UIMessage["parts"]): string => {
  const textPart = parts.find((part) => part.type === "text");
  return textPart && "text" in textPart ? textPart.text : "";
};

const formatToolName = (toolName: string): string =>
  toolName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();

const getMessageLabel = (message: UIMessage): string => {
  const parts = message.parts ?? [];

  if (message.role === "user") {
    const textContent = getTextContent(parts);
    return textContent ? truncateText(textContent) : "User message";
  }

  if (message.role === "assistant") {
    const toolCallInfo = getToolCallInfo(parts);
    if (toolCallInfo) {
      const { toolName, symbol } = toolCallInfo;
      const formattedName = formatToolName(toolName);
      return symbol ? `${formattedName} (${symbol.toUpperCase()})` : formattedName;
    }

    const textContent = getTextContent(parts);
    return textContent ? truncateText(textContent) : "Assistant message";
  }

  return "Message";
};

export const useMessageScroll = (
  scrollRef: React.RefObject<HTMLElement | null>,
  messages: UIMessage[] = [],
) => {
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);

  // Memoize processed messages - only recalculate when messages array changes
  const timelineMessages = useMemo(
    () =>
      messages
        .filter((msg) => msg.role !== "system")
        .map((msg) => ({
          id: msg.id,
          role: msg.role,
          label: getMessageLabel(msg),
        })),
    [messages],
  );

  // Memoize current index lookup
  const currentIndex = useMemo(
    () =>
      currentMessageId ? timelineMessages.findIndex((msg) => msg.id === currentMessageId) : -1,
    [currentMessageId, timelineMessages],
  );

  // Initialize current message to the last message
  useEffect(() => {
    if (timelineMessages.length > 0) {
      const lastMessage = timelineMessages[timelineMessages.length - 1];
      if (lastMessage) {
        setCurrentMessageId(lastMessage.id);
      }
    }
  }, [timelineMessages.length]);

  // Track scroll position and update current message
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let ticking = false;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      const viewportTop = scrollTop + HEADER_HEIGHT;

      const messageElements = document.querySelectorAll<HTMLElement>(
        '[data-message-id][data-role]:not([data-role="system"])',
      );

      for (const el of messageElements) {
        const top = el.offsetTop;
        if (top <= viewportTop && top + el.offsetHeight > viewportTop) {
          const id = el.dataset.messageId;
          if (id) setCurrentMessageId(id);
          break;
        }
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
      }
    };

    scrollContainer.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", onScroll);
  }, [scrollRef]);

  const scrollToElement = useCallback(
    (messageId: string) => {
      const el = document.querySelector<HTMLElement>(`[data-message-id="${messageId}"]`);
      if (!el || !scrollRef.current) return;

      scrollRef.current.scrollTo({
        top: el.offsetTop - HEADER_HEIGHT,
        behavior: "smooth",
      });
    },
    [scrollRef],
  );

  const scrollToMessage = useCallback(
    (messageId: string) => {
      setCurrentMessageId(messageId);
      scrollToElement(messageId);
    },
    [scrollToElement],
  );

  const scrollUp = useCallback(() => {
    if (currentIndex <= 0) return;
    const prev = timelineMessages[currentIndex - 1];
    if (prev) {
      setCurrentMessageId(prev.id);
      scrollToElement(prev.id);
    }
  }, [currentIndex, timelineMessages, scrollToElement]);

  const scrollDown = useCallback(() => {
    if (currentIndex < 0 || currentIndex >= timelineMessages.length - 1) return;
    const next = timelineMessages[currentIndex + 1];
    if (next) {
      setCurrentMessageId(next.id);
      scrollToElement(next.id);
    }
  }, [currentIndex, timelineMessages, scrollToElement]);

  return {
    scrollToMessage,
    scrollUp,
    scrollDown,
    currentMessageId,
    timelineMessages,
    canScrollUp: currentIndex > 0,
    canScrollDown: currentIndex >= 0 && currentIndex < timelineMessages.length - 1,
  };
};
