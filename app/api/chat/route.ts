// @/app/api/chat/route.ts
import { google } from "@ai-sdk/google";
import { convertToModelMessages, smoothStream, stepCountIs, streamText } from "ai";
import { companyProfile } from "@/app/tools/company-profile";
import { dividendsCalendar } from "@/app/tools/dividends-calendar";
import { earningsCalendar } from "@/app/tools/earnings-calendar";
import { gradesHistorical } from "@/app/tools/grades-historical";
import { historicalPrice } from "@/app/tools/historical-price";
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
    system: `You are a helpful financial assistant that can provide real-time and historical stock market data. You have access to the following financial tools:

    - intradayPrice: Get current stock quotes including price, volume, market cap, and other real-time market data for any stock symbol (e.g., AAPL, MSFT, GOOGL)
    - historicalPrice: Get historical end-of-day (EOD) price data for stocks within a date range. Useful for analyzing price trends over time.
    - companyProfile: Get comprehensive company profile information including company details, financial metrics, CEO, sector, industry, description, and business information.
    - earningsCalendar: Get earnings calendar showing upcoming earnings announcements with EPS and revenue estimates vs actuals.
    - dividendsCalendar: Get dividends calendar showing upcoming dividend payments, payment dates, record dates, and dividend yields.
    - gradesHistorical: Get analyst ratings and consensus (Buy, Hold, Sell, Strong Sell) for stocks.

    When users ask about stocks, prices, market data, company information, earnings, dividends, or analyst ratings, use these tools to provide accurate, real-time information. Always use the appropriate tool based on what the user is asking for.

    Be conversational and helpful. When presenting financial data, format numbers clearly (e.g., use commas for large numbers, show percentages with % sign). If a user asks about a stock symbol, proactively fetch the current price and relevant company information.`,

    // stopWhen defines when to stop the multi-step tool calling loop
    // stepCountIs(5) means: stop after 5 steps if tools are still being called
    // A "step" is one generation cycle (which may include tool calls + results)
    stopWhen: stepCountIs(3),

    // Tools are functions the LLM can call to perform specific tasks
    // The LLM decides when to call these tools based on the conversation context
    tools: {
      // Financial Modeling Prep API tools
      intradayPrice,
      historicalPrice,
      companyProfile,
      earningsCalendar,
      dividendsCalendar,
      gradesHistorical,
    },
  });

  // Convert the result to a UI message stream response for the client
  // This enables real-time streaming of the AI response to the frontend
  return result.toUIMessageStreamResponse();
}
