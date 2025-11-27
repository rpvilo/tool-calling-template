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
import Suggestions from "@/components/suggestions";

export default function Home() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const handleSendMessage = (suggestion: string) => {
    sendMessage({ text: suggestion });
  };

  const handleStop = () => {
    if (status === "streaming" || status === "submitted") {
      stop();
    }
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
          {status === "submitted" && <ConversationStatus />}
        </ConversationContent>
        <PromptInput status={status} onStop={handleStop} onSubmit={handleSendMessage} />
      </Conversation>
    </div>
  );
}
