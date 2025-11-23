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

  // Update messages from DOM and initialize last scrolled message
  useEffect(() => {
    const updateMessages = () => {
      const domMessages = getMessagesFromDOM();
      setMessages(domMessages);

      // Initialize last scrolled message to the last message in the list if not set
      if (!lastScrolledMessageId && domMessages.length > 0) {
        const lastId = domMessages[domMessages.length - 1]?.id;
        if (lastId) {
          setLastScrolledMessageId(lastId);
        }
      }
    };

    // Initial update
    updateMessages();

    // Set up MutationObserver to watch for DOM changes
    const observer = new MutationObserver(() => {
      updateMessages();
    });

    // Observe the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-message-id", "data-role"],
    });

    return () => {
      observer.disconnect();
    };
  }, [lastScrolledMessageId]);

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
  }, [scrollRef, lastScrolledMessageId]);

  const scrollToMessage = useCallback(
    (messageId: string) => {
      const messageElement = document.querySelector(
        `[data-message-id="${messageId}"]`,
      ) as HTMLElement;

      if (!messageElement || !scrollRef.current) return;

      const messageOffset = messageElement.offsetTop;
      const headerElement = document.querySelector('[data-slot="header"]') as HTMLElement;
      const headerHeight = headerElement?.offsetHeight ?? 0;

      scrollRef.current.scrollTo({
        top: messageOffset - headerHeight,
        behavior: "smooth",
      });

      setLastScrolledMessageId(messageId);
    },
    [scrollRef],
  );

  const scrollUp = useCallback(() => {
    if (!scrollRef.current || !lastScrolledMessageId || messages.length === 0) return;

    const currentIndex = messages.findIndex((msg) => msg.id === lastScrolledMessageId);
    if (currentIndex === -1 || currentIndex === 0) return; // Already at first message

    const previousMessage = messages[currentIndex - 1];
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
  }, [scrollRef, lastScrolledMessageId, messages]);

  const scrollDown = useCallback(() => {
    if (!scrollRef.current || !lastScrolledMessageId || messages.length === 0) return;

    const currentIndex = messages.findIndex((msg) => msg.id === lastScrolledMessageId);
    if (currentIndex === -1 || currentIndex === messages.length - 1) return; // Already at last message

    const nextMessage = messages[currentIndex + 1];
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
  }, [scrollRef, lastScrolledMessageId, messages]);

  return {
    scrollToMessage,
    scrollUp,
    scrollDown,
    lastScrolledMessageId,
    messages,
  };
};
