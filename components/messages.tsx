import type { UIMessage } from "ai";
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
            case "tool-weather":
              return null;
            case "tool-whatToWear":
              return null;
            default:
              return null;
          }
        })}
      </MessageContent>
    </Message>
  ));
};

export default Messages;
