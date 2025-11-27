"use client";

import type { UIMessage } from "ai";
import type { CompanyProfileSchema } from "@/app/tools/company-profile";
import type { EarningsHistoricalSchema } from "@/app/tools/earnings-historical";
import type { GradesConsensusSchema } from "@/app/tools/grades-consensus";
import type { HistoricalPriceSchema } from "@/app/tools/historical-prices";
import type { IntradayPriceSchema } from "@/app/tools/intraday-price";
import { ConversationStatus } from "./conversation";
import { Message, MessageContent, MessageText } from "./message";
import { AnalystRatingTool } from "./tools/analyst-rating-tool";
import { CompanyProfileTool } from "./tools/company-profile-tool";
import { EarningsHistoricalTool } from "./tools/earnings-historical-tool";
import { HistoricalPricesTool } from "./tools/historical-prices-tool";
import ToolError from "./tools/tool-error";

const Messages = ({ messages }: { messages: UIMessage[] }) => {
  return messages.map((message) => (
    <Message key={message.id} role={message.role} messageId={message.id}>
      <MessageContent>
        {message.parts?.map((part, index) => {
          switch (part.type) {
            case "text":
              return <MessageText key={index}>{part.text}</MessageText>;
            case "tool-companyProfile":
              switch (part.state) {
                case "input-streaming":
                case "input-available":
                  return <ConversationStatus key={index} status="Getting company profile..." />;
                case "output-available": {
                  const companyProfileData = part.output as CompanyProfileSchema;
                  return <CompanyProfileTool key={index} data={companyProfileData} />;
                }
                case "output-error":
                  return (
                    <ToolError
                      key={index}
                      title="Error getting company profile"
                      message={part.errorText}
                    />
                  );
                default:
                  return null;
              }

            case "tool-earningsHistorical":
              switch (part.state) {
                case "input-streaming":
                case "input-available":
                  return <ConversationStatus key={index} status="Getting historical earnings..." />;
                case "output-available": {
                  const data = part.output as {
                    intraday?: IntradayPriceSchema;
                    earnings?: EarningsHistoricalSchema[];
                  };
                  return <EarningsHistoricalTool key={index} data={data} />;
                }
                case "output-error":
                  return (
                    <ToolError
                      key={index}
                      title="Error getting earnings"
                      message={part.errorText}
                    />
                  );
                default:
                  return null;
              }

            case "tool-gradesConsensus":
              switch (part.state) {
                case "input-streaming":
                case "input-available":
                  return <ConversationStatus key={index} status="Getting grades consensus..." />;
                case "output-available": {
                  const data = part.output as {
                    intraday: IntradayPriceSchema;
                    gradesConsensus: GradesConsensusSchema;
                  };
                  return <AnalystRatingTool key={index} data={data} />;
                }
                case "output-error":
                  return (
                    <ToolError
                      key={index}
                      title="Error getting analyst ratings"
                      message={part.errorText}
                    />
                  );
                default:
                  return null;
              }
            case "tool-historicalPrices":
              switch (part.state) {
                case "input-streaming":
                case "input-available":
                  return <ConversationStatus key={index} status="Getting historical prices..." />;
                case "output-available": {
                  const historicalPriceData = part.output as {
                    intraday?: IntradayPriceSchema;
                    historical?: HistoricalPriceSchema[];
                  };
                  return <HistoricalPricesTool key={index} data={historicalPriceData} />;
                }
                case "output-error":
                  return (
                    <ToolError
                      key={index}
                      title="Error getting historical prices"
                      message={part.errorText}
                    />
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
