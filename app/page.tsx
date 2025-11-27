// @/app/page.tsx
"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Conversation,
  ConversationContent,
  ConversationStatus,
  ConversationTimeline,
} from "@/components/conversation";
import Header from "@/components/header";
import Messages from "@/components/messages";
import PromptInput from "@/components/prompt-input";
import Suggestions from "@/components/suggestion";

export default function Home() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const handleSendMessage = (suggestion: string) => {
    sendMessage({ text: suggestion });
  };

  return (
    <div data-slot="root" className="relative h-dvh w-full">
      <Header />
      <Conversation>
        <ConversationTimeline messages={messages} />
        <ConversationContent>
          {messages.length === 0 ? (
            <Suggestions onSuggestionClick={handleSendMessage} />
          ) : (
            <Messages messages={messages} />
          )}
          {status === "submitted" && <ConversationStatus status={status} />}
        </ConversationContent>
        <PromptInput status={status} onStop={stop} onSubmit={handleSendMessage} />
      </Conversation>
    </div>
  );
}
