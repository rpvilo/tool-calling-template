// @/app/page.tsx
"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import {
  Conversation,
  ConversationContent,
  ConversationStatus,
  ConversationTimeline,
} from "@/components/conversation";
import Messages from "@/components/messages";
import { ProgressiveBlur } from "@/components/progressive-blur";
import PromptInput from "@/components/prompt-input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  console.log(messages);

  console.log(error);
  return (
    <div data-slot="root" className="relative h-dvh w-full">
      <div>
        <header
          data-slot="header"
          className="fixed top-0 right-0 left-0 flex h-16 items-center bg-linear-to-b from-gray-1 to-transparent p-4"
        >
          <ProgressiveBlur direction="top" className="fixed top-0 right-0 left-0 h-14" />
          <div className="z-1 flex w-full items-center justify-between gap-2">
            <h1 className="font-semibold text-lg">Intentface AI</h1>
            <Button
              variant="ghost"
              className="rounded-full capitalize"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme}
            </Button>
          </div>
        </header>
      </div>

      <>
        <Conversation>
          <ConversationTimeline />
          <ConversationContent>
            <AnimatePresence mode="wait">
              {messages.length === 0 ? (
                <div className="flex size-full items-center justify-center">
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    className="mb-6 text-center font-semibold text-2xl text-gray-12"
                  >
                    What would you like to know?
                  </motion.div>
                </div>
              ) : (
                <Messages messages={messages} />
              )}
            </AnimatePresence>
            <ConversationStatus status={status} />
          </ConversationContent>
          <div>
            <div
              data-slot="prompt-input"
              className="fixed right-0 bottom-0 left-0 mx-auto w-full max-w-(--conversation-width) bg-linear-to-t from-gray-1 to-transparent pb-8"
            >
              <ProgressiveBlur
                direction="bottom"
                blurIntensity={0.25}
                className="pointer-events-none absolute right-0 bottom-0 left-0 h-[128px]"
              />
              <PromptInput onSubmit={(prompt) => sendMessage({ text: prompt })} />
            </div>
          </div>
        </Conversation>
      </>
    </div>
  );
}
