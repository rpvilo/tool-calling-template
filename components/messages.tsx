"use client";

import type { UIMessage } from "ai";
import type { CompanyProfileSchema } from "@/app/tools/company-profile";
import type { EarningsHistoricalSchema } from "@/app/tools/earnings-historical";
import type { GradesConsensusSchema } from "@/app/tools/grades-consensus";
import type { HistoricalPriceSchema } from "@/app/tools/historical-prices";
import type { IntradayPriceSchema } from "@/app/tools/intraday-price";
import AnalystRatingChart from "./charts/analyst-rating-chart";
import { EarningsHistoricalChart } from "./charts/earnings-historical-chart";
import { HistoricalPricesChart } from "./charts/historical-prices-chart";
import { ConversationStatus } from "./conversation";
import { Message, MessageContent, MessageText } from "./message";

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
                  return <EarningsHistoricalChart key={index} data={data} />;
                }
                case "output-error":
                  return (
                    <div key={index} className="my-2 text-red-500">
                      Error getting earnings historical: {part.errorText}
                    </div>
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
                  return <AnalystRatingChart key={index} data={data} />;
                }
                case "output-error":
                  return (
                    <div key={index} className="my-2 text-ruby-12 text-sm">
                      Error getting grades consensus: {part.errorText}
                    </div>
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
                  return <HistoricalPricesChart key={index} data={historicalPriceData} />;
                }
                case "output-error":
                  return (
                    <div key={index} className="my-2 text-red-500">
                      Error getting historical prices: {part.errorText}
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
