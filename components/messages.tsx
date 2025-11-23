"use client";

import type { UIMessage } from "ai";
import type { ResponseSchema as CompanyProfileSchema } from "@/app/tools/company-profile";
import { Message, MessageContent, MessageText } from "./message";

const Messages = ({ messages }: { messages: UIMessage[] }) => {
  return messages.map((message, index) => (
    <Message
      key={message.id}
      isLastMessage={index === messages.length - 1 && message.role === "assistant"}
      role={message.role}
      messageId={message.id}
    >
      <MessageContent>
        {message.parts?.map((part, index) => {
          switch (part.type) {
            case "text":
              return <MessageText key={index}>{part.text}</MessageText>;
            case "tool-companyProfile":
              switch (part.state) {
                case "input-streaming":
                case "input-available":
                  return (
                    <div key={index} className="my-2 text-amber-500 text-sm">
                      {part.state}...
                    </div>
                  );
                case "output-available": {
                  const companyProfileData = part.output as CompanyProfileSchema;
                  return (
                    <div key={index} className="my-2 border-blue-200 border-l-2 pl-4">
                      <pre>
                        <code>{JSON.stringify(companyProfileData, null, 2)}</code>
                      </pre>
                    </div>
                  );
                }
                case "output-error":
                  return (
                    <div key={index} className="my-2 text-red-500">
                      Error getting weather: {part.errorText}
                    </div>
                  );
                default:
                  return null;
              }
            default:
              return null;
          }
        })}
      </MessageContent>
    </Message>
  ));
};

export default Messages;
