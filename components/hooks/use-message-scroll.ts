"use client";

import { useCallback, useEffect, useState } from "react";

export type MessageData = {
  id: string;
  role: string;
  content: string;
};

const getVisibleMessageElements = () => {
  const allMessageElements = Array.from(
    document.querySelectorAll("[data-message-id]"),
  ) as HTMLElement[];
  const visibleMessageElements = allMessageElements.filter(
    (el) => el.getAttribute("data-role") !== "system",
  );
  visibleMessageElements.sort((a, b) => a.offsetTop - b.offsetTop);
  return visibleMessageElements;
};

const getMessagesFromDOM = (): MessageData[] => {
  const visibleMessageElements = getVisibleMessageElements();
  return visibleMessageElements.map((element) => {
    const id = element.getAttribute("data-message-id") ?? "";
    const role = element.getAttribute("data-role") ?? "";
    const contentElement = element.querySelector('[data-slot="message-content"]');
    const content = contentElement?.textContent?.trim() ?? "";

    return {
      id,
      role,
      content,
    };
  });
};

export const useMessageScroll = (scrollRef: React.RefObject<HTMLElement | null>) => {
  const [lastScrolledMessageId, setLastScrolledMessageId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);

  // Helper to update messages and initialize last scrolled message
  const updateMessages = useCallback(() => {
    const domMessages = getMessagesFromDOM();
    setMessages(domMessages);

    // Initialize last scrolled message to the last message in the list if not set
    if (!lastScrolledMessageId && domMessages.length > 0) {
      const lastId = domMessages[domMessages.length - 1]?.id;
      if (lastId) {
        setLastScrolledMessageId(lastId);
      }
    }
  }, [lastScrolledMessageId]);

  // Initial update on mount
  useEffect(() => {
    if (scrollRef.current) {
      updateMessages();
    }
  }, [scrollRef, updateMessages]);

  // Track which message is at the top of the viewport on scroll
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const headerElement = document.querySelector('[data-slot="header"]') as HTMLElement;
      const headerHeight = headerElement?.offsetHeight ?? 0;
      const scrollTop = scrollContainer.scrollTop;
      const viewportTop = scrollTop + headerHeight;

      const visibleMessageElements = getVisibleMessageElements();

      // Update messages array (we're already querying the DOM)
      updateMessages();

      // Find the message that is at or closest to the top of the viewport
      for (let i = 0; i < visibleMessageElements.length; i++) {
        const messageElement = visibleMessageElements[i];
        if (!messageElement) continue;

        const messageTop = messageElement.offsetTop;
        const messageBottom = messageTop + messageElement.offsetHeight;

        // Check if this message is at the top of the viewport (accounting for header)
        if (messageTop <= viewportTop && messageBottom > viewportTop) {
          const messageId = messageElement.getAttribute("data-message-id");
          if (messageId && messageId !== lastScrolledMessageId) {
            setLastScrolledMessageId(messageId);
          }
          break;
        }
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    scrollContainer.addEventListener("scroll", throttledHandleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      scrollContainer.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [scrollRef, lastScrolledMessageId, updateMessages]);

  const scrollToMessage = useCallback(
    (messageId: string) => {
      const messageElement = document.querySelector(
        `[data-message-id="${messageId}"]`,
      ) as HTMLElement;

      if (!messageElement || !scrollRef.current) return;

      // Update messages before scrolling
      updateMessages();

      const messageOffset = messageElement.offsetTop;
      const headerElement = document.querySelector('[data-slot="header"]') as HTMLElement;
      const headerHeight = headerElement?.offsetHeight ?? 0;

      scrollRef.current.scrollTo({
        top: messageOffset - headerHeight,
        behavior: "smooth",
      });

      setLastScrolledMessageId(messageId);
    },
    [scrollRef, updateMessages],
  );

  const scrollUp = useCallback(() => {
    if (!scrollRef.current || !lastScrolledMessageId) return;

    // Update messages to get latest state
    const domMessages = getMessagesFromDOM();
    setMessages(domMessages);

    if (domMessages.length === 0) return;

    const currentIndex = domMessages.findIndex((msg) => msg.id === lastScrolledMessageId);
    if (currentIndex === -1 || currentIndex === 0) return; // Already at first message

    const previousMessage = domMessages[currentIndex - 1];
    if (!previousMessage) return;

    const headerElement = document.querySelector('[data-slot="header"]') as HTMLElement;
    const headerHeight = headerElement?.offsetHeight ?? 0;

    const messageElement = document.querySelector(
      `[data-message-id="${previousMessage.id}"]`,
    ) as HTMLElement;
    if (!messageElement) return;

    const messageOffset = messageElement.offsetTop;
    scrollRef.current.scrollTo({
      top: messageOffset - headerHeight,
      behavior: "smooth",
    });

    setLastScrolledMessageId(previousMessage.id);
  }, [scrollRef, lastScrolledMessageId]);

  const scrollDown = useCallback(() => {
    if (!scrollRef.current || !lastScrolledMessageId) return;

    // Update messages to get latest state
    const domMessages = getMessagesFromDOM();
    setMessages(domMessages);

    if (domMessages.length === 0) return;

    const currentIndex = domMessages.findIndex((msg) => msg.id === lastScrolledMessageId);
    if (currentIndex === -1 || currentIndex === domMessages.length - 1) return; // Already at last message

    const nextMessage = domMessages[currentIndex + 1];
    if (!nextMessage) return;

    const headerElement = document.querySelector('[data-slot="header"]') as HTMLElement;
    const headerHeight = headerElement?.offsetHeight ?? 0;

    const messageElement = document.querySelector(
      `[data-message-id="${nextMessage.id}"]`,
    ) as HTMLElement;
    if (!messageElement) return;

    const messageOffset = messageElement.offsetTop;
    scrollRef.current.scrollTo({
      top: messageOffset - headerHeight,
      behavior: "smooth",
    });

    setLastScrolledMessageId(nextMessage.id);
  }, [scrollRef, lastScrolledMessageId]);

  return {
    scrollToMessage,
    scrollUp,
    scrollDown,
    lastScrolledMessageId,
    messages,
  };
};
