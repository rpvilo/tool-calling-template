// @/app/api/chat/route.ts
import { google } from "@ai-sdk/google";
import { convertToModelMessages, smoothStream, stepCountIs, streamText } from "ai";
import { formatISO } from "date-fns";
import { companyProfile } from "@/app/tools/company-profile";
import { earningsHistorical } from "@/app/tools/earnings-historical";
import { gradesConsensus } from "@/app/tools/grades-consensus";
import { historicalPrices } from "@/app/tools/historical-prices";
import { intradayPrice } from "@/app/tools/intraday-price";

// Maximum duration for the API route (in seconds)
export const maxDuration = 30;

export async function POST(req: Request) {
  // Extract messages from the request body
  // Messages contain the conversation history (user and assistant messages)
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),

    // Convert UIMessages from the frontend to ModelMessages for the AI
    messages: convertToModelMessages(messages),

    // Smooth stream the response to the client
    experimental_transform: smoothStream({ chunking: "word", delayInMs: 20 }),

    // System prompt defines the AI's behavior and personality
    system: `You are a helpful financial assistant with access to real-time and historical stock market data.

    Today's date is ${formatISO(new Date(), { representation: "date" })}.

    ALWAYS USE TOOLS FIRST. When a user asks anything about stocks, prices, earnings, analyst ratings, or company information, immediately call the appropriate tool before responding. Never answer from memory when a tool can provide accurate data.

    Available tools:
    - intradayPrice: Current and recent price data (open, high, low, close, volume)
    - historicalPrices: Historical daily price data for any date range
    - earningsHistorical: Earnings data including EPS, revenue, gross profit, net income
    - gradesConsensus: Analyst ratings and consensus recommendations
    - companyProfile: Company details (name, ticker, sector, industry, description)

    Users may refer to companies by name or ticker symbol. If they use a company name (e.g., "Apple", "Tesla", "Microsoft"), you already know the corresponding ticker—use it directly when calling tools.

    After executing any tool, provide a brief conversational summary of the key insights. Do NOT restate raw data in lists, bullets, or tables—the data is already displayed visually. Instead, offer interpretation: trends, comparisons, implications, and what the numbers mean for the investor.`,

    stopWhen: stepCountIs(5),

    tools: {
      // Financial Modeling Prep API tools
      intradayPrice,
      historicalPrices,
      companyProfile,
      earningsHistorical,
      gradesConsensus,
    },
  });

  // Convert the result to a UI message stream response for the client
  // This enables real-time streaming of the AI response to the frontend
  return result.toUIMessageStreamResponse();
}
