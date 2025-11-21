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
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  console.log(messages);

  return (
    // <div data-slot="root" className="relative h-dvh w-full overflow-y-scroll bg-gray-2">
    <Conversation>
      <div data-slot="header">
        <header className="fixed top-0 right-0 left-0 flex h-16 items-center p-4">
          <ProgressiveBlur direction="top" className="absolute top-0 right-0 left-0 h-14" />
          <div className="z-1 flex items-center justify-between gap-2">
            <h1 className="font-semibold text-lg">Intentface AI</h1>
            <Button variant="primary" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              Theme
            </Button>
          </div>
        </header>
      </div>
      {/* <div data-slot="content" className="flex h-full flex-col justify-center"> */}
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
          <>
            <ConversationTimeline messages={messages} />
            <ConversationContent>
              <Messages messages={messages} />
              <ConversationStatus status={status} />
            </ConversationContent>
          </>
        )}
      </AnimatePresence>
      <div data-slot="prompt-input">
        <PromptInput onSubmit={(prompt) => sendMessage({ text: prompt })} />
      </div>
    </Conversation>
    // </div>
  );
}
